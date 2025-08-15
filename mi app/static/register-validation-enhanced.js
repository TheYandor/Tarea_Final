// Validación frontend mejorada con indicadores visuales claros
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = document.querySelector('input[name="confirm_password"]');
    const usernameInput = document.querySelector('input[name="username"]');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Crear contenedor para mostrar requisitos
    const requirementsDiv = document.createElement('div');
    requirementsDiv.className = 'requirements-display';
    requirementsDiv.innerHTML = `
        <h4>Requisitos de contraseña:</h4>
        <ul id="password-requirements">
            <li id="req-length" class="req-pending">✗ Mínimo 8 caracteres</li>
            <li id="req-uppercase" class="req-pending">✗ Al menos una mayúscula</li>
            <li id="req-lowercase" class="req-pending">✗ Al menos una minúscula</li>
            <li id="req-number" class="req-pending">✗ Al menos un número</li>
            <li id="req-special" class="req-pending">✗ Al menos un carácter especial</li>
            <li id="req-match" class="req-pending">✗ Las contraseñas coinciden</li>
        </ul>
    `;
    
    // Insertar después del formulario
    form.insertBefore(requirementsDiv, form.lastElementChild);
    
    // Estilos CSS para los requisitos
    const styles = document.createElement('style');
    styles.textContent = `
        .requirements-display {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px;
            margin: 15px 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .requirements-display h4 {
            color: #fff;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .requirements-display ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .requirements-display li {
            padding: 5px 0;
            font-size: 0.9rem;
            color: #ff6b6b;
            transition: all 0.3s ease;
        }
        
        .requirements-display li.valid {
            color: #4CAF50;
            text-decoration: line-through;
        }
        
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(styles);
    
    // Función para actualizar requisitos
    function updateRequirements() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const username = usernameInput.value;
        
        // Requisitos de contraseña
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            match: password === confirmPassword && password !== ''
        };
        
        // Actualizar visualización de requisitos
        document.getElementById('req-length').className = requirements.length ? 'valid' : '';
        document.getElementById('req-length').textContent = requirements.length ? '✓ Mínimo 8 caracteres' : '✗ Mínimo 8 caracteres';
        
        document.getElementById('req-uppercase').className = requirements.uppercase ? 'valid' : '';
        document.getElementById('req-uppercase').textContent = requirements.uppercase ? '✓ Al menos una mayúscula' : '✗ Al menos una mayúscula';
        
        document.getElementById('req-lowercase').className = requirements.lowercase ? 'valid' : '';
        document.getElementById('req-lowercase').textContent = requirements.lowercase ? '✓ Al menos una minúscula' : '✗ Al menos una minúscula';
        
        document.getElementById('req-number').className = requirements.number ? 'valid' : '';
        document.getElementById('req-number').textContent = requirements.number ? '✓ Al menos un número' : '✗ Al menos un número';
        
        document.getElementById('req-special').className = requirements.special ? 'valid' : '';
        document.getElementById('req-special').textContent = requirements.special ? '✓ Al menos un carácter especial' : '✗ Al menos un carácter especial';
        
        document.getElementById('req-match').className = requirements.match ? 'valid' : '';
        document.getElementById('req-match').textContent = requirements.match ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas coinciden';
        
        // Habilitar/deshabilitar botón
        const allValid = Object.values(requirements).every(Boolean);
        submitButton.disabled = !allValid;
    }
    
    // Event listeners
    passwordInput.addEventListener('input', updateRequirements);
    confirmPasswordInput.addEventListener('input', updateRequirements);
    usernameInput.addEventListener('input', updateRequirements);
    
    // Prevenir envío si hay errores
    form.addEventListener('submit', function(e) {
        if (submitButton.disabled) {
            e.preventDefault();
            return false;
        }
    });
    
    // Inicializar estado
    updateRequirements();
});
