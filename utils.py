def toMilisecs(minutes=0, seconds=0):
    return ( minutes * 60 + seconds ) * 1000

def insert_rec(dbcon, date, milisecs, commit=True):
    c = dbcon.cursor()
    c.execute('INSERT INTO records VALUES (?, ?)', (date, milisecs))
    if commit:
        dbcon.commit()

def delete_rec(dbcon, date, commit=True):
    c = dbcon.cursor()
    c.execute('DELETE from records WHERE date=?', (date,))
    if commit:
        dbcon.commit()
