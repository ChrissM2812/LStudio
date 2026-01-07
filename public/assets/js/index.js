document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Header Sticky & Mobile Menu (Código previo mantenido)
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            mainNav.classList.contains('active') ? 
                (icon.classList.remove('fa-bars'), icon.classList.add('fa-times')) : 
                (icon.classList.remove('fa-times'), icon.classList.add('fa-bars'));
        });
    }

    // Scroll suave para anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if(this.getAttribute('href').length > 1) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    if(mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        menuToggle.querySelector('i').classList.remove('fa-times');
                        menuToggle.querySelector('i').classList.add('fa-bars');
                    }
                    window.scrollTo({ top: targetElement.offsetTop - 70, behavior: 'smooth' });
                }
            }
        });
    });

    // ---------------------------------------------------------
    // 2. LÓGICA PROFESIONAL DE FORMULARIOS
    // ---------------------------------------------------------

    const contactForm = document.getElementById('contactForm');
    const subscribeForm = document.getElementById('subscribeForm');

    // Función para validar campos
    function validateInput(input) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        const errorSpan = formGroup.querySelector('.error-msg');
        
        // Resetear estilos previos
        input.classList.remove('input-error');
        if(formGroup) formGroup.classList.remove('error');
        
        // Validación básica: campo vacío
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('input-error');
            if(formGroup) formGroup.classList.add('error');
            if(errorSpan) errorSpan.textContent = 'Este campo es obligatorio';
            return false;
        }

        // Validación de Email (Regex simple)
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('input-error');
                if(formGroup) formGroup.classList.add('error');
                if(errorSpan) errorSpan.textContent = 'Ingresa un email válido';
                return false;
            }
        }

        return true;
    }

    // Función para mostrar Toast Notification
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
        // Icono según el tipo
        const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const title = type === 'success' ? '¡Éxito!' : 'Atención';

        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${iconClass}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        container.appendChild(toast);

        // Activar animación de entrada
        setTimeout(() => toast.classList.add('show'), 100);

        // Eliminar después de 4 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // MANEJO DEL ENVÍO (Submit Handler)
    function handleFormSubmit(e) {
        e.preventDefault(); // Evita que la página se recargue
        const form = e.target;
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;

        // 1. Validar todos los campos
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
            // Agregar listener para limpiar error cuando el usuario escriba
            input.addEventListener('input', () => validateInput(input));
        });

        if (!isValid) {
            showToast('Por favor, completa los campos marcados.', 'error');
            return;
        }

        // 2. Simular Envío a Base de Datos (Backend Readiness)
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text') || submitBtn;
        const loadingIcon = submitBtn.querySelector('.loading-icon');
        
        // Estado de carga visual
        const originalText = btnText.textContent || submitBtn.textContent;
        if(btnText.textContent) btnText.textContent = 'Enviando...';
        else submitBtn.textContent = 'Enviando...';
        
        if(loadingIcon) loadingIcon.style.display = 'inline-block';
        submitBtn.disabled = true;

        // Recopilar datos (Aquí es donde conectarías tu backend)
        const formData = new FormData(form);
        const dataObject = Object.fromEntries(formData.entries());

        console.log("Datos listos para enviar al backend:", dataObject);

        // --- SIMULACIÓN DE FETCH (Aquí iría tu fetch real) ---
        setTimeout(() => {
            // Simulamos éxito
            console.log("¡Datos enviados exitosamente!");
            
            // Restaurar botón
            if(btnText.textContent) btnText.textContent = originalText;
            else submitBtn.textContent = originalText;
            
            if(loadingIcon) loadingIcon.style.display = 'none';
            submitBtn.disabled = false;

            // Mostrar notificación de éxito
            showToast('Mensaje enviado correctamente. Nos pondremos en contacto.', 'success');
            
            // Limpiar formulario
            form.reset();

        }, 2000); // Retraso de 2 segundos simulando red
    }

    if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
    if (subscribeForm) subscribeForm.addEventListener('submit', handleFormSubmit);
});