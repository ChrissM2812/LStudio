document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. FUNCIONALIDAD UI BÁSICA
    // ==========================================
    const header = document.getElementById('main-header');
    
    // Header Sticky
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // Menú Hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Scroll Suave
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
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, 
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================
    // 2. ANIMACIONES FUTURISTAS (ANIME.JS)
    // ==========================================

    // A. HERO ENTRANCE
    const tl = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    });

    tl.add({
        targets: '.hero-logo',
        opacity: [0, 1],
        translateY: [50, 0],
        scale: [0.8, 1],
        duration: 1200
    })
    .add({
        targets: '.hero-text h2',
        opacity: [0, 1],
        translateX: [-50, 0],
        offset: '-=800'
    })
    .add({
        targets: '.hero-text p',
        opacity: [0, 1],
        translateX: [-30, 0],
        offset: '-=800'
    });

    // B. SCROLL REVEAL (Intersection Observer)
    const observerOptions = { threshold: 0.2 };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                // Títulos
                if(entry.target.classList.contains('section-title') || entry.target.classList.contains('section-subtitle')) {
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        easing: 'easeOutQuad',
                        duration: 800
                    });
                }

                // Grid Productos (Stagger)
                if(entry.target.classList.contains('products-grid')) {
                    anime({
                        targets: '.product-card',
                        opacity: [0, 1],
                        translateY: [50, 0],
                        delay: anime.stagger(150),
                        easing: 'spring(1, 80, 10, 0)'
                    });
                }

                // Acerca de
                if(entry.target.classList.contains('about-content')) {
                    anime({
                        targets: '.about-content > *',
                        opacity: [0, 1],
                        translateY: [30, 0],
                        delay: anime.stagger(100),
                        easing: 'easeOutExpo'
                    });
                }

                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.products-grid, .about-content').forEach(el => scrollObserver.observe(el));

    // C. HOVER TECH EFFECT
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const lineTop = card.querySelector('.line-top');
        const lineBottom = card.querySelector('.line-bottom');
        const corner = card.querySelector('.corner-flash');

        card.addEventListener('mouseenter', () => {
            anime({ targets: lineTop, width: '100%', easing: 'easeInOutQuad', duration: 400 });
            anime({ targets: lineBottom, width: '100%', easing: 'easeInOutQuad', duration: 400, delay: 100 });
            anime({ targets: corner, opacity: 1, duration: 200 });
            anime({ 
                targets: card, 
                translateY: -10, 
                boxShadow: '0 20px 40px rgba(90, 10, 127, 0.4)', 
                easing: 'easeOutExpo', 
                duration: 400 
            });
        });

        card.addEventListener('mouseleave', () => {
            anime({ targets: [lineTop, lineBottom], width: '0%', easing: 'easeOutQuad', duration: 300 });
            anime({ targets: corner, opacity: 0, duration: 200 });
            anime({ 
                targets: card, 
                translateY: 0, 
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
                easing: 'easeOutExpo', 
                duration: 400 
            });
        });
    });

    // ==========================================
    // 3. GESTIÓN DE FORMULARIOS Y ALERTAS
    // ==========================================

    const contactForm = document.getElementById('contactForm');
    const subscribeForm = document.getElementById('subscribeForm');

    // Validar Input Individual
    function validateInput(input) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        const errorSpan = formGroup.querySelector('.error-msg');
        
        input.classList.remove('input-error');
        if(formGroup) formGroup.classList.remove('error');
        
        // Campo vacío
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('input-error');
            if(formGroup) formGroup.classList.add('error');
            if(errorSpan) errorSpan.textContent = 'Este campo es obligatorio';
            return false;
        }

        // Email formato
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

    // Mostrar Toast
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
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

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // Manejar Envío
    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateInput(input)) isValid = false;
            input.addEventListener('input', () => validateInput(input));
        });

        if (!isValid) {
            showToast('Por favor, completa los campos marcados.', 'error');
            return;
        }

        // Simulación Backend
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text') || submitBtn;
        const loadingIcon = submitBtn.querySelector('.loading-icon');
        
        const originalText = btnText.textContent || submitBtn.textContent;
        if(btnText.textContent) btnText.textContent = 'Enviando...';
        else submitBtn.textContent = 'Enviando...';
        
        if(loadingIcon) loadingIcon.style.display = 'inline-block';
        submitBtn.disabled = true;

        // Datos del form
        const formData = new FormData(form);
        const dataObject = Object.fromEntries(formData.entries());
        console.log("Datos para Backend:", dataObject);

        setTimeout(() => {
            console.log("¡Enviado!");
            
            if(btnText.textContent) btnText.textContent = originalText;
            else submitBtn.textContent = originalText;
            
            if(loadingIcon) loadingIcon.style.display = 'none';
            submitBtn.disabled = false;

            showToast('Mensaje enviado correctamente. Nos pondremos en contacto.', 'success');
            form.reset();
            
            // Limpiar estilos de error residuales
            inputs.forEach(input => {
                input.classList.remove('input-error');
                const fg = input.closest('.form-group');
                if(fg) fg.classList.remove('error');
            });

        }, 2000);
    }

    if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
    if (subscribeForm) subscribeForm.addEventListener('submit', handleFormSubmit);
});