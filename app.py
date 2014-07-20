from flask import Flask
from flask import render_template
from flask import Response
import sqlite3
import json

from utils import toMilisecs

# HACK

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

# end HACK






app = Flask(__name__)

@app.route("/")
@crossdomain(origin='*')
def hello():
    return app.send_static_file("index.html")

@app.route("/data", methods=['POST', 'GET'])
@crossdomain(origin='*')
def data():
    if request.method == "GET":
        conn = sqlite3.connect("data.db")
        c = conn.cursor()
        data = []
        for row in c.execute('SELECT * from records ORDER BY date ASC'):
            data.append({"date": row[0], "value": row[1]})

        return Response(json.dumps(data), content_type="application/json")

    if request.method == "POST":
        conn = sqlite3.connect("data.db")
        c = conn.cursor()
        data = request.json
        c.execute("INSERT INTO records VALUES (?, ?)", (data['date'], toMilisecs(seconds=data['value'])))
        conn.commit()
        return "Done"


if __name__ == "__main__":
    app.debug = True
    app.run()
