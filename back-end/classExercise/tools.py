import pandas as pd
import sqlite3

def df_from_query(table, query, params={ }):
    try:
        con = sqlite3.connect(table)
        df = pd.read_sql_query(query, con, params=params)
        return df
    
    finally:
        con.close()

# Let's get fancy: have a class we can instantiate with the database
# name, and then use repeatedly.

class DB:
    def __init__(self, name):
        self._dbname = f"./{name}.db"   # Sanitise the filename

    def load_from_dataframe(self, df, table_name):
        con = None
        try:
            con = sqlite3.connect(self._dbname)
            df.to_sql(table_name, con, if_exists="replace")
        finally:
            if con is not None: con.close()

    def query(self, q, params={ }):     # Return DataFrame
        return df_from_query(self._dbname, q, params=params)
    
    def execute(self, q):
        con = None
        try:
            con = sqlite3.connect(self._dbname)
            cur = con.cursor()
            cur.execute(q)
            con.commit()
        finally:
            if con is not None:
                con.close()
