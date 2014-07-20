import sqlite3
conn = sqlite3.connect("data.db")
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS records
             (date text primary key, integer milisecs)''')
conn.commit()

def insert_rec(dbcon, date, milisecs):
    c = dbcon.cursor()
    c.execute('INSERT INTO records VALUES (?, ?)', (date, milisecs))
    dbcon.commit()

insert_rec(conn, "2014-07-24", 123123)
