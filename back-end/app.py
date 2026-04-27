# To install the requirements -> pip install -r requirements.txt
# To run the server: python3 app.py

from flask import Flask, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore

app = Flask(__name__)
CORS(app)

@app.route('/api/data')
def get_data():
    return jsonify({
        "name": "Testing the python API pipe whatever",
        "menu_items": ["Home", "About", "Gallery", "Contact"],
        "version" : "the First",
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
