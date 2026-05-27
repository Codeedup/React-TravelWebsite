# Project Submission Structure

This project is organized for submission using the requested folder layout:

```text
/
+-- setup/
+-- apiserver/
+-- apiviewer/
+-- report/
```

## File List

### `/setup/`

- `setup/setup.ipynb`
- `setup/updater.ipynb`
- `setup/datatables_dylan_test.ipynb` (legacy development/test notebook)
- `setup/travel_planner.db`

### `/apiserver/`

- `apiserver/server.ipynb`

### `/apiviewer/`

- Astro/React frontend for the DREAMROUTE interface.

### `/report/`

- Add written report and video documentation files here.

## Run Commands

Run the Flask API manually from the notebook:

1. Open `apiserver/server.ipynb`.
2. Run the setup/install cell if Flask or Flask-CORS is not installed.
3. Run the Flask app cell.
4. Keep the notebook kernel running while using the frontend.

Run the Astro/React frontend from the frontend folder:

```powershell
cd apiviewer
npm install
npm run dev
```

The frontend expects the API at `http://127.0.0.1:5001`.

## Database Build Flow

Run `setup/setup.ipynb` first to create the canonical SQLite schema, then run
`setup/updater.ipynb` to populate `setup/travel_planner.db`. The Flask
server reads that database directly.

## Generated Files

Generated folders such as `node_modules/`, `.astro/`, `dist/`, `.npm-cache/`, and log files are not listed above as source files and should not be included in the final submission zip. They can be recreated from `apiviewer/package.json` and `apiviewer/package-lock.json` by running `npm install`, and `dist/` can be recreated with `npm run build`.
