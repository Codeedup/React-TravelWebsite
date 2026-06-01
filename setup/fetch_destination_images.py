from pathlib import Path
from urllib import error, parse, request
import argparse
import json
import os
import re
import sqlite3
import time


REPO_ROOT = Path(__file__).resolve().parents[1]
DATABASE_PATH = REPO_ROOT / "setup" / "travel_planner.db"
ASSET_DIR = REPO_ROOT / "apiviewer" / "public" / "assets" / "destinations"
CREDIT_PATH = REPO_ROOT / "apiviewer" / "src" / "components" / "destinationImageCredits.json"
PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"


def load_env_files():
    for env_path in (REPO_ROOT / ".env", REPO_ROOT / "setup" / ".env"):
        if not env_path.exists():
            continue

        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def slugify(value):
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug


def read_destinations():
    conn = sqlite3.connect(DATABASE_PATH)
    try:
        rows = conn.execute("""
            SELECT CityName, Country
            FROM Destinations
            ORDER BY CityName;
        """).fetchall()
    finally:
        conn.close()

    return rows


def read_credits():
    if not CREDIT_PATH.exists():
        return {}

    return json.loads(CREDIT_PATH.read_text(encoding="utf-8"))


def write_credits(credits):
    CREDIT_PATH.write_text(
        json.dumps(credits, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def pexels_search(city, country, api_key):
    query = f"{city} {country} travel city skyline"
    query_string = parse.urlencode({
        "query": query,
        "per_page": 1,
        "orientation": "landscape",
    })
    api_request = request.Request(
        f"{PEXELS_SEARCH_URL}?{query_string}",
        headers={
            "Authorization": api_key,
            "Accept": "application/json",
        },
    )

    with request.urlopen(api_request, timeout=15) as response:
        payload = json.loads(response.read().decode("utf-8"))

    photos = payload.get("photos") or []
    if not photos:
        return None

    photo = photos[0]
    src = photo.get("src") or {}
    image_url = (
        src.get("large")
        or src.get("landscape")
        or src.get("medium")
        or src.get("original")
    )
    if not image_url:
        return None

    return {
        "image_url": image_url,
        "credit": {
            "alt": photo.get("alt") or f"{city}, {country}",
            "photographer": photo.get("photographer") or "",
            "photographer_url": photo.get("photographer_url") or "",
            "photo_url": photo.get("url") or "",
            "provider": "Pexels",
            "query": query,
        },
    }


def download_image(image_url, target_path):
    image_request = request.Request(
        image_url,
        headers={"User-Agent": "DREAMROUTE destination image fetcher"},
    )
    with request.urlopen(image_request, timeout=30) as response:
        target_path.write_bytes(response.read())


def main():
    parser = argparse.ArgumentParser(
        description="Download missing destination images from the Pexels API.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace existing destination image files instead of skipping them.",
    )
    parser.add_argument(
        "--pause",
        default=0.25,
        type=float,
        help="Seconds to pause between Pexels requests.",
    )
    args = parser.parse_args()

    load_env_files()
    api_key = os.environ.get("PEXELS_API_KEY", "").strip()
    if not api_key:
        raise SystemExit(
            "PEXELS_API_KEY is missing. Add it to setup/.env or your shell environment."
        )

    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    credits = read_credits()
    downloaded = 0
    skipped = 0

    for city, country in read_destinations():
        slug = slugify(city)
        target_path = ASSET_DIR / f"{slug}.jpg"

        if target_path.exists() and not args.overwrite:
            print(f"skip existing: {city}")
            skipped += 1
            continue

        try:
            result = pexels_search(city, country, api_key)
            if not result:
                print(f"no image found: {city}, {country}")
                continue

            download_image(result["image_url"], target_path)
            credits[slug] = result["credit"]
            write_credits(credits)
            downloaded += 1
            print(f"downloaded: {city} -> {target_path.name}")
            time.sleep(args.pause)
        except error.HTTPError as exc:
            raise SystemExit(f"Pexels request failed with HTTP {exc.code}.") from exc
        except error.URLError as exc:
            raise SystemExit(f"Pexels request failed: {exc.reason}") from exc

    print(f"Done. Downloaded {downloaded}, skipped {skipped}.")


if __name__ == "__main__":
    main()
