
from flask import Flask, request, jsonify, render_template, redirect, url_for
import psycopg2

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(
        host='db',
        database='addrbook',
        user='myuser',
        password='mypassword'
    )
    return conn

@app.route('/')
def index():
    return '<h1>Hello from Flask!</h1>'

@app.route('/users', methods=['GET', 'POST'])
def users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM users')
    rows = cur.fetchall()
    return render_template('users.html', users=rows)

@app.route('/contact')
def contact():
    return render_template("contact.html")

@app.route('/contact/complete', methods=['GET', 'POST'])
def contact_complete():
    if request.method =='POST':
        username = request.form["username"]
        email = request.form["email"]

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO users (username, email) VALUES (%s, %s)', (username, email))
        conn.commit()

        return redirect(url_for("contact_complete"))
    
    return render_template("contact_complete.html")


if __name__ == '__main__':
    app.run(host='0.0.0.0')

