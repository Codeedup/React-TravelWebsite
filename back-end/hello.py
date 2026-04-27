from flask import Flask 

app = Flask(__name__)

# @app.route("/")
# def hello_world():
#     return "<p>Hello world!</p>"

# @app.route('/')
# def index():
#     return 'Index Page'

@app.route('/hello')
def hello():
    return 'Hello, Worlddd'

# To turn it on type flask --app hello run