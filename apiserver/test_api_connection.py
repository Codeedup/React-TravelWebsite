import requests

BASE_URL = "http://127.0.0.1:5001"

# A list of all the endpoints built into your Flask app
endpoints_to_test = [
    "/api/cities",
    "/api/destinations",
    "/api/activities",
    "/api/vibes",
    "/api/filter-options",
    "/api/search",  # Tests search with no filters
    "/api/search?cost=Cheap&weather=Hot",  # Tests search with query parameters
    "/api/database"
]

print(f"Starting API health check against {BASE_URL}...\n")
print("-" * 50)

for endpoint in endpoints_to_test:
    url = f"{BASE_URL}{endpoint}"
    
    try:
        # Send a GET request with a 5-second timeout
        response = requests.get(url, timeout=5)
        
        # Check if the HTTP status code is 200 (OK)
        if response.status_code == 200:
            # Optional: Ensure it actually returned JSON
            try:
                data = response.json()
                print(f"[OK] {endpoint} is working. (Returned {len(data)} items/keys)")
            except ValueError:
                print(f"[WARNING] {endpoint} is working (200 OK), but did not return valid JSON.")
        else:
            print(f"[DOESN'T WORK] {endpoint} returned status code: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print(f"[FATAL ERROR] Could not connect to {BASE_URL}.")
        print("Are you sure your Flask server is currently running?")
        break 
        
    except requests.exceptions.Timeout:
        print(f"[DOESN'T WORK] {endpoint} timed out after 5 seconds.")

print("-" * 50)
print("Testing complete.")