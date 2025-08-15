from flask import Flask, render_template, request, redirect, session
import sqlite3
from functools import wraps

app = Flask(__name__)
app.secret_key = 'clave_secreta_segura'

# Decorador para proteger rutas que requieren login
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'usuario' not in session:
            return redirect('/')
        return f(*args, **kwargs)
    return decorated_function

# Función para validar usuario y contraseña
def validar_usuario(username, password):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    contraseña_hash = hash_password(password)
    c.execute("SELECT * FROM users WHERE username=? AND password=?", (username, contraseña_hash))
    result = c.fetchone()
    conn.close()
    return result is not None

# Ruta principal (login)
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['username']
        contraseña = request.form['password']
        if validar_usuario(usuario, contraseña):
            session['usuario'] = usuario
            return redirect('/calculadora')
        else:
            return render_template('login.html', error='Credenciales incorrectas')
    return render_template('login.html')

import re
import hashlib

# Función para validar contraseña
def validar_contraseña(password):
    """Valida que la contraseña cumpla con los requisitos de seguridad"""
    if len(password) < 8:
        return "La contraseña debe tener al menos 8 caracteres"
    
    if not re.search(r'[A-Z]', password):
        return "La contraseña debe contener al menos una mayúscula"
    
    if not re.search(r'[a-z]', password):
        return "La contraseña debe contener al menos una minúscula"
    
    if not re.search(r'\d', password):
        return "La contraseña debe contener al menos un número"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return "La contraseña debe contener al menos un carácter especial"
    
    return None

# Función para hashear contraseña
def hash_password(password):
    """Hashea la contraseña usando SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

# Registro con validación mejorada
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        usuario = request.form['username']
        contraseña = request.form['password']
        confirmar_contraseña = request.form['confirm_password']
        
        # Validar que las contraseñas coincidan
        if contraseña != confirmar_contraseña:
            return render_template('register.html', error='Las contraseñas no coinciden')
        
        # Validar contraseña
        error_contraseña = validar_contraseña(contraseña)
        if error_contraseña:
            return render_template('register.html', error=error_contraseña)
        
        try:
            with sqlite3.connect('database.db', timeout=10) as conn:
                c = conn.cursor()
                
                # Verificar si el usuario ya existe
                c.execute("SELECT * FROM users WHERE username = ?", (usuario,))
                if c.fetchone():
                    return render_template('register.html', error='El nombre de usuario ya está en uso')

                # Insertar nuevo usuario con contraseña hasheada
                contraseña_hash = hash_password(contraseña)
                c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (usuario, contraseña_hash))
                conn.commit()

            return redirect('/')

        except Exception as e:
            return render_template('register.html', error=f'Error al registrar usuario: {str(e)}')

    return render_template('register.html')


# Calculadora protegida por login
@app.route('/calculadora', methods=['GET', 'POST'])
@login_required
def calculadora():
    resultado = None
    if request.method == 'POST':
        resultado = request.form.get('resultado')
    return render_template('calculator.html', resultado=resultado)

# Ruleta protegida por login
@app.route('/roulette')
@login_required
def roulette():
    return render_template('roulette.html')

# Ruta para verificar disponibilidad de usuario
@app.route('/check_username')
def check_username():
    username = request.args.get('username', '')
    
    if not username or len(username) < 3:
        return {'exists': False}
    
    try:
        with sqlite3.connect('database.db') as conn:
            c = conn.cursor()
            c.execute("SELECT * FROM users WHERE username = ?", (username,))
            exists = c.fetchone() is not None
            return {'exists': exists}
    except:
        return {'exists': False}

# Ruta para cerrar sesión
@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect('/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
