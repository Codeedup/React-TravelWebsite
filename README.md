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
- `setup/datatables_analysis.ipynb`

### `/apiserver/`

- `apiserver/run_api.py`
- `apiserver/server.ipynb`
- `apiserver/data/travel.db`

### `/apiviewer/`

- `apiviewer/astro.config.mjs`
- `apiviewer/package-lock.json`
- `apiviewer/package.json`
- `apiviewer/tsconfig.json`
- `apiviewer/src/components/CityCard.jsx`
- `apiviewer/src/components/FeatureStrip.jsx`
- `apiviewer/src/components/Header.jsx`
- `apiviewer/src/components/HeroFilters.jsx`
- `apiviewer/src/components/ResultsList.jsx`
- `apiviewer/src/pages/about.astro`
- `apiviewer/src/pages/index.astro`
- `apiviewer/src/pages/results.astro`
- `apiviewer/src/styles/global.css`

### `/report/`

- Add written report and video documentation files here.

## Run Commands

Run the Flask API from the API folder:

```powershell
cd apiserver
python run_api.py
```

Run the Astro/React frontend from the frontend folder:

```powershell
cd apiviewer
npm install
npm run dev
```

The frontend expects the API at `http://127.0.0.1:5001`.

## Generated Files

Generated folders such as `node_modules/`, `.astro/`, `dist/`, `.npm-cache/`, and log files are not listed above as source files. They can be recreated by running the install/build/dev commands.
