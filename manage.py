import sqlite3
conn = sqlite3.connect("data.db")
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS records
             (date text primary key on conflict replace, milisecs integer)''')
conn.commit()

import utils

def print_table(dbcon, column_name):
    c = dbcon.cursor()
    for row in c.execute("SELECT * from records ORDER BY {0} ASC".format(column_name)):
        print row


jul17data = {
    "2014-06-25" : (28,0),
    "2014-06-27" : (11,20),
    "2014-07-02" : (27,0),
    "2014-07-03" : (34,0),
    "2014-07-04" : (11,30),
    "2014-07-07" : (21,0),
    "2014-07-08" : (10,30),
    "2014-07-09" : (17,30),
    "2014-07-11" : (29,0),
    "2014-07-16" : (17,0),
    "2014-07-17" : (20,03)
}

def addAll(data_dict):
    for (key, value) in data_dict.iteritems():
        utils.insert_rec(conn, key, utils.toMilisecs(*value), commit=False)
        conn.commit()


from IPython import embed
embed()
