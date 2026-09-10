from pathlib import Path
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

#enable flask and allow astro to query
app = Flask(__name__)
CORS(app)

DATABASE_NAME = "travel_planner.db"
WEATHER_OPTIONS = ["Hot", "Mild", "Cold"]
SCORING_FILTER_KEYS = ("cost", "weather", "activity", "vibe")
MONTH_NAMES = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December",
}
MONTH_LOOKUP = {name.lower(): number for number, name in MONTH_NAMES.items()}
MONTH_LOOKUP.update({name[:3].lower(): number for number, name in MONTH_NAMES.items()})
MONTH_LOOKUP.update({str(number): number for number in MONTH_NAMES})


def get_base_dir():
    try:
        return Path(__file__).resolve().parent
    except NameError:
        return Path.cwd().resolve()


def get_db_path():
    base_dir = get_base_dir()
    cwd = Path.cwd().resolve()
    candidates = [
        base_dir / DATABASE_NAME,
        base_dir / "setup" / DATABASE_NAME,
        base_dir.parent / "setup" / DATABASE_NAME,
        cwd / DATABASE_NAME,
        cwd / "setup" / DATABASE_NAME,
        cwd.parent / "setup" / DATABASE_NAME,
        base_dir / "data" / DATABASE_NAME,
        base_dir.parent / "apiserver" / "data" / DATABASE_NAME,
        cwd / "data" / DATABASE_NAME,
        cwd / "apiserver" / "data" / DATABASE_NAME,
        cwd.parent / "apiserver" / "data" / DATABASE_NAME,
    ]

    for candidate in candidates:
        resolved = candidate.resolve()
        if resolved.exists():
            return resolved

    raise FileNotFoundError(f"Could not find setup/{DATABASE_NAME}.")

#open sqlite connection
def get_db_connection():
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    return conn


def normalize(value):
    return value.strip().lower() if isinstance(value, str) else ""


def parse_month(value):
    normalized = normalize(value)
    return MONTH_LOOKUP.get(normalized)

#convert temps into one of our three ranges
def weather_band_for_temp(temp):
    if temp is None:
        return ""
    if temp <= 5:
        return "Cold"
    if temp >= 25:
        return "Hot"
    return "Mild"


def quote_identifier(name):
    return '"' + name.replace('"', '""') + '"'


def grouped_rows(rows, key_name):
    grouped = {}
    for row in rows:
        grouped.setdefault(row[key_name], []).append(dict(row))
    return grouped


def choose_weather(weather_rows, selected_month, selected_weather):
    if not weather_rows:
        return None

    if selected_month:
        for row in weather_rows:
            if row["Month"] == selected_month:
                return row

    weather_preference = normalize(selected_weather)
    if weather_preference:
        matching_rows = [
            row for row in weather_rows
            if normalize(weather_band_for_temp(row["AvgTempC"])) == weather_preference
        ]
        if matching_rows:
            if weather_preference == "hot":
                return max(matching_rows, key=lambda row: row["AvgTempC"])
            if weather_preference == "cold":
                return min(matching_rows, key=lambda row: row["AvgTempC"])
            return min(matching_rows, key=lambda row: abs(row["AvgTempC"] - 20))

    return min(weather_rows, key=lambda row: abs(row["AvgTempC"] - 20))


def get_search_payload(selected_filters):
    selected_month = parse_month(selected_filters.get("month", ""))

    conn = get_db_connection()
    try:
        destination_rows = conn.execute("""
            SELECT
                D.DestinationID AS DestinationID,
                D.CityName AS CityName,
                D.Country AS Country,
                D.Description AS Description,
                CP.BudgetLevel AS BudgetLevel
            FROM Destinations D
            LEFT JOIN Cost_Profiles CP ON CP.DestinationID = D.DestinationID
            ORDER BY D.CityName;
        """).fetchall()

        weather_by_destination = grouped_rows(conn.execute("""
            SELECT DestinationID, Month, AvgTempC, RainfallMM
            FROM Weather_Monthly
            ORDER BY DestinationID, Month;
        """).fetchall(), "DestinationID")

        activities_by_destination = grouped_rows(conn.execute("""
            SELECT
                DA.DestinationID AS DestinationID,
                A.ActivityName AS ActivityName,
                DA.Spotlight_Description AS Spotlight_Description
            FROM Destinations_Activities DA
            JOIN Activities A ON A.ActivityID = DA.ActivityID
            ORDER BY DA.DestinationID, A.ActivityName;
        """).fetchall(), "DestinationID")

        vibes_by_destination = grouped_rows(conn.execute("""
            SELECT
                DV.DestinationID AS DestinationID,
                V.VibeName AS VibeName
            FROM Destination_Vibes DV
            JOIN Travel_Vibes V ON V.VibeID = DV.VibeID
            ORDER BY DV.DestinationID, V.VibeName;
        """).fetchall(), "DestinationID")
    finally:
        conn.close()

    # A month chooses the weather record to show and evaluate, but every destination has
    # a record for every month. It therefore provides context rather than a scoreable
    # distinction between destinations.
    scoring_filters = {
        key: selected_filters[key]
        for key in SCORING_FILTER_KEYS
        if selected_filters.get(key)
    }
    results = []

    for row in destination_rows:
        destination_id = row["DestinationID"]
        activity_rows = activities_by_destination.get(destination_id, [])
        vibe_rows = vibes_by_destination.get(destination_id, [])
        weather_rows = weather_by_destination.get(destination_id, [])

        selected_activity = selected_filters.get("activity", "")
        matched_activity = next(
            (activity for activity in activity_rows if normalize(activity["ActivityName"]) == normalize(selected_activity)),
            activity_rows[0] if activity_rows else None,
        )
        chosen_weather = choose_weather(weather_rows, selected_month, selected_filters.get("weather", ""))
        vibe_names = [vibe["VibeName"] for vibe in vibe_rows]
        weather_band = weather_band_for_temp(chosen_weather["AvgTempC"]) if chosen_weather else ""


        # Count only preferences that can distinguish one destination from another.
        match_count = 0
        if normalize(selected_filters.get("cost", "")) == normalize(row["BudgetLevel"]):
            match_count += 1
        if normalize(selected_filters.get("weather", "")) == normalize(weather_band):
            match_count += 1
        if selected_activity and matched_activity and normalize(matched_activity["ActivityName"]) == normalize(selected_activity):
            match_count += 1
        if selected_filters.get("vibe") and normalize(selected_filters["vibe"]) in [normalize(vibe) for vibe in vibe_names]:
            match_count += 1

        results.append({
            "destination": row["CityName"],
            "country": row["Country"],
            "description": row["Description"],
            "cost": row["BudgetLevel"],
            "activity_type": matched_activity["ActivityName"] if matched_activity else "",
            "activity_name": matched_activity["Spotlight_Description"] if matched_activity else row["Description"],
            "weather_band": weather_band,
            "avg_temp_c": chosen_weather["AvgTempC"] if chosen_weather else None,
            "rainfall_mm": chosen_weather["RainfallMM"] if chosen_weather else None,
            "month": MONTH_NAMES.get(chosen_weather["Month"], "") if chosen_weather else "",
            "vibes": vibe_names,
            "match_count": match_count,
            "scored_filter_count": len(scoring_filters),
        })

    #show the best destination
    results.sort(key=lambda destination: (-destination["match_count"], destination["destination"]))
    return results


@app.route('/api/cities', methods=['GET'])
@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    conn = get_db_connection()
    data = conn.execute("""
        SELECT
            DestinationID AS id,
            CityName AS name,
            Country AS country,
            Description AS description
        FROM Destinations
        ORDER BY CityName;
    """).fetchall()
    conn.close()
    return jsonify([dict(row) for row in data])


@app.route('/api/activities', methods=['GET'])
def get_activities():
    conn = get_db_connection()
    data = conn.execute("""
        SELECT
            A.ActivityID AS id,
            D.CityName AS destination,
            A.ActivityName AS activity_name,
            DA.Spotlight_Description AS description
        FROM Activities A
        JOIN Destinations_Activities DA ON DA.ActivityID = A.ActivityID
        JOIN Destinations D ON D.DestinationID = DA.DestinationID
        ORDER BY A.ActivityName, D.CityName;
    """).fetchall()
    conn.close()
    return jsonify([dict(row) for row in data])


@app.route('/api/vibes', methods=['GET'])
def get_vibes():
    conn = get_db_connection()
    data = conn.execute("SELECT VibeID AS id, VibeName AS name FROM Travel_Vibes ORDER BY VibeName;").fetchall()
    conn.close()
    return jsonify([dict(row) for row in data])


@app.route('/api/filter-options', methods=['GET'])
def get_filter_options():
    conn = get_db_connection()
    try:
        cost_options = [row['BudgetLevel'] for row in conn.execute("""
            SELECT DISTINCT BudgetLevel
            FROM Cost_Profiles
            WHERE BudgetLevel IS NOT NULL
            ORDER BY CASE BudgetLevel WHEN 'Cheap' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Expensive' THEN 3 ELSE 4 END, BudgetLevel;
        """).fetchall()]
        activity_options = [row['ActivityName'] for row in conn.execute("""
            SELECT DISTINCT ActivityName
            FROM Activities
            ORDER BY ActivityName;
        """).fetchall()]
        vibe_options = [row['VibeName'] for row in conn.execute("""
            SELECT DISTINCT VibeName
            FROM Travel_Vibes
            ORDER BY VibeName;
        """).fetchall()]
    finally:
        conn.close()

    return jsonify({
        "cost": cost_options,
        "month": list(MONTH_NAMES.values()),
        "weather": WEATHER_OPTIONS,
        "activity": activity_options,
        "vibe": vibe_options,
    })


@app.route('/api/search', methods=['GET'])
def search_destinations():
    selected_filters = {
        "cost": request.args.get("cost", "").strip(),
        "month": request.args.get("month", "").strip(),
        "weather": request.args.get("weather", "").strip(),
        "activity": request.args.get("activity", "").strip(),
        "vibe": request.args.get("vibe", "").strip(),
    }
    return jsonify(get_search_payload(selected_filters))


@app.route('/api/database', methods=['GET'])
def get_database_snapshot():
    conn = get_db_connection()
    tables = []
    try:
        table_names = [row['name'] for row in conn.execute("""
            SELECT name
            FROM sqlite_master
            WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
            ORDER BY name;
        """).fetchall()]

        for table_name in table_names:
            quoted_name = quote_identifier(table_name)
            columns = [row['name'] for row in conn.execute(f"PRAGMA table_info({quoted_name});").fetchall()]
            order_by = quote_identifier(columns[0]) if columns else "rowid"
            rows = conn.execute(f"SELECT * FROM {quoted_name} ORDER BY {order_by};").fetchall()
            tables.append({
                "name": table_name,
                "columns": columns,
                "rows": [dict(row) for row in rows],
            })
    finally:
        conn.close()

    return jsonify({
        "database": get_db_path().name,
        "tables": tables,
    })


if __name__ == '__main__':
    app.run(port=5001, debug=True, use_reloader=False)
