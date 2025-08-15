# crear archivo db.py
import sqlite3

conn = sqlite3.connect('database.db')
c = conn.cursor()

#Creacion de tabla de usuarios
c.execute ('''
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
''')

# Usuario administrador (user: admin password:1234)
c.execute("INSERT INTO users (username, password) VALUES (?, ?)", ('admin', '1234'))

# Guardar los cambios y cerrar la conexión
conn.commit() #guarda
conn.close() #cierra

