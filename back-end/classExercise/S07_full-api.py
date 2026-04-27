# /// script
# dependencies = [
#     "flask==3.1.3",
#     "flask-cors==6.0.2",
#     "marimo",
#     "pandas==3.0.2",
#     "requests==2.33.1",
# ]
# requires-python = ">=3.14"
# ///

import marimo

__generated_with = "0.23.1"
app = marimo.App(width="medium", css_file="../../css/marimo.css")


@app.cell
def _():
    import marimo as mo

    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # Full Working API
    ## Nick Rothwell, 2026

    Let's build this example out end-to-end. We'll re-run from scratch. Keep it idempotent! (Can we always run this notebook from the top and rebuild everything?)
    """)
    return


@app.cell
def _():
    # Scorched earth: remove the DB file completely.
    # (Not so easy with "real" networked databases.)

    import os
    FILE = "./objects.db"

    if os.path.exists(FILE):
        os.remove(FILE)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ### Database Rebuild

    Do a V&A search, dump results from CSV data frame into a new table.
    """)
    return


@app.cell
def _():
    import requests, io, tools, pandas as pd

    r = requests.get("https://api.vam.ac.uk/v2/objects/search",
                     {'q': 'India',
                      'page_size': 99,
                      'response_format': 'csv'
                     }
                    )
    frame = pd.read_csv(io.StringIO(r.content.decode('utf-8')))

    db = tools.DB("objects")
    db.load_from_dataframe(frame, "objects")

    #db.query("SELECT * FROM pragma_table_info('objects')")
    db.query("SELECT * FROM objects")
    return (db,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ### Normalisation

    The same AI-generated code as last time, but with the spurious `GROUP BY` removed.
    """)
    return


@app.cell
def _(db):
    db.execute("""
        CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            display_name TEXT NOT NULL UNIQUE
        )
    """)

    db.execute("""
        -- Insert standardized locations
        INSERT INTO locations (display_name)
        SELECT DISTINCT
            CASE
                WHEN lower(_currentLocation__displayName) IN ('in store', 'in storage') THEN 'In Storage'
                ELSE _currentLocation__displayName
            END
        FROM objects
        WHERE _currentLocation__displayName IS NOT NULL
    """)

    db.execute("""
        -- Add location_id column to main table
        ALTER TABLE objects ADD COLUMN location_id INTEGER REFERENCES locations(id)
    """)

    db.execute("""
        -- Update the main table with location references
        UPDATE objects
        SET location_id = (
            SELECT id FROM locations
            WHERE display_name =
                CASE
                    WHEN lower(objects._currentLocation__displayName) IN ('in store', 'in storage') THEN 'In Storage'
                    ELSE objects._currentLocation__displayName
                END
        )
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ### Quick Test

    A quick query to test that we can extract objects joined to a specific location (the sanitised form
    `In Storage` - compare it with the actual locations in the results we get back).
    """)
    return


@app.cell
def _(db):
    # Examine all locations:

    db.query("""
        SELECT * FROM locations
    """)
    return


@app.cell
def _(db):
    # Select all objects at the "In Storage" location:

    db.query("""
        SELECT obj.* FROM objects obj, locations loc
         WHERE loc.id = obj.location_id
           AND loc.display_name = "In Storage"
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Flask API
    """)
    return


@app.cell
def _(db):
    from flask import Flask
    from flask_cors import CORS, cross_origin

    _app = Flask(__name__)

    @_app.route("/locations")           # Root API: get all locations
    @cross_origin(origin="*")
    def _get_locations():
        locations_frame = db.query("SELECT id, display_name FROM locations")
        records = locations_frame.to_records(index=False)
        # We can't just return the NumPy array: it can't be serialised
        # into JSON. So we have to iterate (and watch those int64s!):
        return { "data" : [{"id" : int(r['id']), "name" : r['display_name']} for r in records] }

    @_app.route("/objects_at_location/<loc_id>")     # Note the parameter here!
    @cross_origin(origin="*")
    def _get_objects(loc_id):
        locations_frame = db.query("SELECT COALESCE(_primaryTitle, 'Untitled') AS _primaryTitle FROM objects WHERE location_id = $loc_id", {"loc_id" : loc_id})
        records = locations_frame.to_records(index=False)
        return { "data" : [{"title" : r['_primaryTitle']} for r in records] }

    _app.run(port=5050)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Testing

    Test the endpoints first, manually from the browser.

    (We're doing `GET` requests, not `POST`, so we can just enter the URLs. If we wanted to debug `POST`, we could [use curl](https://www.warp.dev/terminus/curl-post-request).)
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Issues

    - Location `1` is going to cause us problems later. Can you work out why?
    """)
    return


if __name__ == "__main__":
    app.run()
