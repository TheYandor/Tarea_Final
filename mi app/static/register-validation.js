// Validación en tiempo real para el registro
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = document.querySelector('input[name="confirm_password"]');
    const usernameInput = document.querySelector('input[name="username"]');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Elementos para mostrar errores
    const passwordError = document.createElement('div');
    const confirmError = document.createElement('div');
    const usernameError = document.createElement('div');
    
    // Estilos para mensajes de error
    const errorStyle = {
        color: '#ff6b6b',
        fontSize: '0.9rem',
        marginTop: '-20px',
        marginBottom: '10px',
        textAlign: 'left',
        fontWeight: '600'
    };
    
    // Estilos para mensajes de éxito
    const successStyle = {
        color: '#4CAF50',
        fontSize: '0.9rem',
        marginTop: '-20px',
        marginBottom: '10px',
        textAlign: 'left',
        fontWeight: '600'
    };
    
    // Función para aplicar estilos
    function applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }
    
    // Validación de nombre de usuario
    usernameInput.addEventListener('input', function() {
        const username = this.value.trim();
        
        if (username.length < 3) {
            usernameError.textContent = 'El usuario debe tener al menos 3 caracteres';
            applyStyles(usernameError, errorStyle);
            this.parentNode.insertBefore(usernameError, this.nextSibling);
            submitButton.disabled = true;
        } else if (username.length > 20) {
            usernameError.textContent = 'El usuario no puede tener más de 20 caracteres';
            applyStyles(usernameError, errorStyle);
            this.parentNode.insertBefore(usernameError, this.nextSibling);
            submitButton.disabled = true;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            usernameError.textContent = 'Solo se permiten letras, números y guiones bajos';
            applyStyles(usernameError, errorStyle);
            this.parentNode.insertBefore(usernameError, this.nextSibling);
            submitButton.disabled = true;
        } else {
            usernameError.textContent = '✓ Usuario válido';
            applyStyles(usernameError, successStyle);
            this.parentNode.insertBefore(usernameError, this.nextSibling);
            checkAllValidations();
        }
    });
    
    // Validación de contraseña
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const validations = [
            { regex: /.{8,}/, message: 'Al menos 8 caracteres' },
            { regex: /[A-Z]/, message: 'Al menos una mayúscula' },
            { regex: /[a-z]/, message: 'Al menos una minúscula' },
            { regex: /\d/, message: 'Al menos un número' },
            { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'Al menos un carácter especial' }
        ];
        
        let errorMessages = [];
        
        validations.forEach(validation => {
            if (!validation.regex.test(password)) {
                errorMessages.push(validation.message);
            }
        });
        
        if (errorMessages.length > 0) {
            passwordError.innerHTML = 'Requisitos: ' + errorMessages.join(', ');
            applyStyles(passwordError, errorStyle);
            this.parentNode.insertBefore(passwordError, this.nextSibling);
            submitButton.disabled = true;
        } else {
            passwordError.textContent = '✓ Contraseña segura';
            applyStyles(passwordError, successStyle);
            this.parentNode.insertBefore(passwordError, this.nextSibling);
            checkAllValidations();
        }
        
        // Verificar también la confirmación de contraseña
        if (confirmPasswordInput.value) {
            confirmPasswordInput.dispatchEvent(new Event('input'));
        }
    });
    
    // Validación de confirmación de contraseña
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        
        if (confirmPassword !== password) {
            confirmError.textContent = 'Las contraseñas no coinciden';
            applyStyles(confirmError, errorStyle);
            this.parentNode.insertBefore(confirmError, this.nextSibling);
            submitButton.disabled = true;
        } else {
            confirmError.textContent = '✓ Contraseñas coinciden';
            applyStyles(confirmError, successStyle);
            this.parentNode.insertBefore(confirmError, this.nextSibling);
            checkAllValidations();
        }
    });
    
    // Función para verificar todas las validaciones
    function checkAllValidations() {
        const usernameValid = usernameInput.value.trim().length >= 3 && /^[a-zA-Z0-9_]+$/.test(usernameInput.value.trim());
        const passwordValid = passwordInput.value.length >= 8 && 
                              /[A-Z]/.test(passwordInput.value) && 
                              /[a-z]/.test(passwordInput.value) && 
                              /\d/.test(passwordInput.value) && 
                              /[!@#$%^&*(),.?":{}|<>]/.test(passwordInput.value);
        const confirmValid = confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value !== '';
        
        submitButton.disabled = !(usernameValid && passwordValid && confirmValid);
    }
    
    // Prevenir envío si hay errores
    form.addEventListener('submit', function(e) {
        if (submitButton.disabled) {
            e.preventDefault();
            return false;
        }
    });
    
    // Verificar disponibilidad de usuario en tiempo real
    let timeout;
    usernameInput.addEventListener('input', function() {
        clearTimeout(timeout);
        const username = this.value.trim();
        
        if (username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username)) {
            timeout = setTimeout(() => {
                fetch(`/check_username?username=${encodeURIComponent(username)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.exists) {
                            usernameError.textContent = 'Este usuario ya está en uso';
                            applyStyles(usernameError, errorStyle);
                            usernameInput.parentNode.insertBefore(usernameError, usernameInput.nextSibling);
                            submitButton.disabled = true;
                        } else {
                            usernameError.textContent = '✓ Usuario disponible';
                            applyStyles(usernameError, successStyle);
                            usernameInput.parentNode.insertBefore(usernameError, usernameInput.nextSibling);
                            checkAllValidations();
                        }
                    })
                    .catch(error => console.error('Error:', error));
            }, 500);
        }
    });
});
