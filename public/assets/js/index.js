document.addEventListener('DOMContentLoaded', function() {
    
    // Header Toggle & Sync
    const headerToggle = document.getElementById('header-toggle');
    const headerCollapsible = document.querySelector('.header-collapsible');
    const mainHeader = document.getElementById('main-header');

    if (headerToggle && headerCollapsible) {
        headerToggle.addEventListener('click', function() {
            headerCollapsible.classList.toggle('expanded');
            headerToggle.classList.toggle('rotate');
            
            // Si abrimos el menú, usamos color sólido para el header
            if (headerCollapsible.classList.contains('expanded')) {
                mainHeader.style.backgroundColor = '#5a0a7f'; // SÓLIDO
            } else {
                // Si cerramos
                if (window.scrollY <= 50) {
                    mainHeader.style.backgroundColor = 'transparent';
                } else {
                    mainHeader.style.backgroundColor = ''; // Volver al estilo del CSS (scrolled)
                }
            }
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            headerCollapsible.classList.remove('expanded');
            headerToggle.classList.remove('rotate');
            if (window.scrollY <= 50) mainHeader.style.backgroundColor = 'transparent';
        });
    });

    // Header Sticky
    window.addEventListener('scroll', () => {
        if (!headerCollapsible.classList.contains('expanded')) {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
                mainHeader.style.backgroundColor = ''; 
            } else {
                mainHeader.classList.remove('scrolled');
                mainHeader.style.backgroundColor = 'transparent';
            }
        }
    });

    // Scroll Suave Manual
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if(headerCollapsible.classList.contains('expanded')) {
                headerCollapsible.classList.remove('expanded');
                headerToggle.classList.remove('rotate');
                if (window.scrollY <= 50) mainHeader.style.backgroundColor = 'transparent';
            }

            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 90; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Animaciones
    const tl = anime.timeline({ easing: 'easeOutExpo', duration: 1000 });
    tl.add({ targets: '.hero-logo', opacity: [0, 1], translateY: [50, 0], scale: [0.8, 1], duration: 1200 })
      .add({ targets: '.hero-text h2', opacity: [0, 1], translateX: [-50, 0], offset: '-=800' })
      .add({ targets: '.hero-text p', opacity: [0, 1], translateX: [-30, 0], offset: '-=800' });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if(entry.target.classList.contains('products-grid')) {
                    anime({ targets: '.product-card', opacity: [0, 1], translateY: [50, 0], delay: anime.stagger(150), easing: 'spring(1, 80, 10, 0)' });
                }
                if(entry.target.classList.contains('about-content')) {
                    anime({ targets: '.about-content', opacity: [0, 1], translateY: [30, 0], easing: 'easeOutExpo' });
                }
                observer.unobserve(entry.target);
            }
        });
    });
    document.querySelectorAll('.products-grid, .about-content').forEach(el => observer.observe(el));

    // Hover Tech
    document.querySelectorAll('.product-card').forEach(card => {
        const lineTop = card.querySelector('.line-top');
        const lineBottom = card.querySelector('.line-bottom');
        card.addEventListener('mouseenter', () => {
            anime({ targets: lineTop, width: '100%', easing: 'easeInOutQuad', duration: 300 });
            anime({ targets: lineBottom, width: '100%', easing: 'easeInOutQuad', duration: 300 });
        });
        card.addEventListener('mouseleave', () => {
            anime({ targets: [lineTop, lineBottom], width: '0%', easing: 'easeOutQuad', duration: 300 });
        });
    });

    // Modales
    const openButtons = document.querySelectorAll('.open-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const overlays = document.querySelectorAll('.modal-overlay');

    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalID = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalID);
            if(modal) {
                modal.classList.add('active');
                anime({ targets: modal.querySelector('.modal-content'), scale: [0.9, 1], opacity: [0, 1], duration: 400, easing: 'easeOutExpo' });
            }
        });
    });
    closeButtons.forEach(btn => btn.addEventListener('click', () => btn.closest('.modal-overlay').classList.remove('active')));
    overlays.forEach(overlay => overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); }));

    // Validacion y Toast
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const title = type === 'success' ? '¡Éxito!' : 'Atención';
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${iconClass}"></i><div><div class="toast-title">${title}</div><div class="toast-message">${message}</div></div>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 4000);
    }

    function validateInput(input) {
        const formGroup = input.parentElement;
        const errorSpan = formGroup.querySelector('.error-msg') || document.createElement('span'); 
        input.classList.remove('input-error');
        errorSpan.textContent = '';
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('input-error');
            return false;
        }
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('input-error');
                return false;
            }
        }
        return true;
    }

    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = contactForm.querySelectorAll('input, textarea');
            let isValid = true;
            inputs.forEach(input => { if (!validateInput(input)) isValid = false; });
            if (!isValid) { showToast('Por favor, completa los campos marcados', 'error'); return; }

            const btn = contactForm.querySelector('button');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                showToast('Mensaje enviado correctamente', 'success');
                contactForm.reset();
            }, 2000);
        });
    }

    const subscribeForm = document.getElementById('subscribeForm');
    if(subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = subscribeForm.querySelector('input');
            if (!validateInput(input)) { showToast('Email inválido', 'error'); return; }
            showToast('¡Gracias por suscribirte!', 'success');
            subscribeForm.reset();
        });
    }
});