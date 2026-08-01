/**
 * ==========================================================================
 * PORTAFOLIO PREMIUM MONOCROMÁTICO
 * Interactividad, Animaciones y Filtros Dinámicos (PC & Android)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENÚ MÓVIL Y DRAWER RESPONSIVO ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const body = document.body;

    function openMenu() {
        menuToggle.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('visible');
        body.style.overflow = 'hidden'; // Evita scroll de fondo en móviles Android
    }

    function closeMenu() {
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('visible');
        body.style.overflow = '';
    }

    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    drawerOverlay.addEventListener('click', closeMenu);

    // Cerrar el drawer al presionar un link de navegación
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });


    // --- 2. HEADER DINÁMICO AL HACER SCROLL ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- 3. FILTRO INTERACTIVO DE PROYECTOS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Cambiar clase activa en botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Animación de salida (Fade-out)
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden');
                        // Forzar reflujo de renderizado para activar la animación de entrada
                        void card.offsetWidth; 
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300); // Duración que coincide con CSS transition
            });
        });
    });


    // --- 4. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Dejamos de observar el elemento una vez revelado
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Se revela cuando el 15% del elemento es visible
        rootMargin: '0px 0px -50px 0px' // Margen inferior para que aparezca un poco antes
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // --- 5. VALIDACIÓN DEL FORMULARIO DE CONTACTO ---
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const submitBtn = document.getElementById('btn-submit-form');

    // Validación interactiva al perder el foco
    nameInput.addEventListener('blur', () => validateField(nameInput, 'error-name'));
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    messageInput.addEventListener('blur', () => validateField(messageInput, 'error-message'));

    // Eliminar estado inválido al escribir
    nameInput.addEventListener('input', () => removeInvalidState(nameInput));
    emailInput.addEventListener('input', () => removeInvalidState(emailInput));
    messageInput.addEventListener('input', () => removeInvalidState(messageInput));

    function validateField(input, errorId) {
        if (input.value.trim() === '') {
            input.parentElement.classList.add('invalid');
            return false;
        }
        removeInvalidState(input);
        return true;
    }

    function validateEmail(input) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (input.value.trim() === '' || !emailPattern.test(input.value.trim())) {
            input.parentElement.classList.add('invalid');
            return false;
        }
        removeInvalidState(input);
        return true;
    }

    function removeInvalidState(input) {
        input.parentElement.classList.remove('invalid');
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar todos los campos
        const isNameValid = validateField(nameInput, 'error-name');
        const isEmailValid = validateEmail(emailInput);
        const isMessageValid = validateField(messageInput, 'error-message');

        if (isNameValid && isEmailValid && isMessageValid) {
            // Deshabilitar botón durante el proceso
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando Mensaje...';

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Preparar los datos para Web3Forms
            const formData = {
                access_key: 'e1dd2ddb-ec1f-4eda-9772-8c1a9b1b52bf',
                name: name,
                email: email,
                message: message,
                subject: `Nuevo mensaje de ${name} - Portafolio`,
                from_name: 'Portafolio Flavio Morales'
            };

            // Enviar la petición a la API
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200 && json.success) {
                    // Éxito de envío
                    submitBtn.classList.remove('btn-primary');
                    submitBtn.style.backgroundColor = '#30d158'; // Verde Apple/iOS
                    submitBtn.style.color = '#ffffff';
                    submitBtn.textContent = '¡Mensaje Enviado con Éxito!';
                    
                    // Limpiar formulario
                    contactForm.reset();
                } else {
                    // Error devuelto por la API
                    console.error('Error Web3Forms:', json);
                    submitBtn.classList.remove('btn-primary');
                    submitBtn.style.backgroundColor = '#ff3b30'; // Rojo Apple/iOS
                    submitBtn.style.color = '#ffffff';
                    submitBtn.textContent = 'Error al enviar. Intenta de nuevo.';
                }
            })
            .catch(error => {
                console.error('Error de Red:', error);
                submitBtn.classList.remove('btn-primary');
                submitBtn.style.backgroundColor = '#ff3b30'; // Rojo Apple/iOS
                submitBtn.style.color = '#ffffff';
                submitBtn.textContent = 'Error de conexión. Intenta de nuevo.';
            })
            .then(() => {
                // Restaurar botón después de unos segundos
                setTimeout(() => {
                    submitBtn.classList.add('btn-primary');
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.textContent = 'Enviar Mensaje';
                    submitBtn.disabled = false;
                }, 3500);
            });
        }
    });


    // --- 6. NAVEGACIÓN ACTIVA DINÁMICA (SPY SCROLL) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.menu-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Si el scroll está en la mitad de la sección
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 7. MODAL DE VIDEO DE DEMOSTRACIÓN ---
    const playDemoBtns = document.querySelectorAll('.play-demo-btn');
    const videoModal = document.getElementById('video-modal');
    const videoModalClose = document.getElementById('video-modal-close');
    const modalVideoPlayer = document.getElementById('modal-video-player');

    if (videoModal && videoModalClose && modalVideoPlayer) {
        playDemoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const videoSrc = btn.getAttribute('data-video');
                if (videoSrc) {
                    modalVideoPlayer.src = videoSrc;
                    videoModal.classList.add('open');
                    modalVideoPlayer.play().catch(err => {
                        console.log("Autoplay bloqueado o error al reproducir:", err);
                    });
                }
            });
        });

        function closeModal() {
            videoModal.classList.remove('open');
            modalVideoPlayer.pause();
            modalVideoPlayer.src = ""; // Detener carga de video
        }

        videoModalClose.addEventListener('click', closeModal);

        // Cerrar al hacer clic en el fondo oscuro
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('open')) {
                closeModal();
            }
        });
    }
    // --- 8. EFECTO DE BRILLO MAGNÉTICO (SPOTLIGHT HOVER) EN TARJETAS ---
    const interactiveCards = document.querySelectorAll('.skill-card, .project-card, .about-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- 9. SOPORTE TÁCTIL PARA EFECTOS HOVER EN MÓVILES ---
    const touchElements = document.querySelectorAll('.skill-card, .project-card, .about-card, .hero-image-card, .skill-tag, .principle-item');
    let isScrolling = false;

    // Detectar si el usuario está haciendo scroll para cancelar los hovers táctiles
    window.addEventListener('scroll', () => {
        isScrolling = true;
        document.querySelectorAll('.touch-hover').forEach(el => {
            el.classList.remove('touch-hover');
        });
    }, { passive: true });

    touchElements.forEach(el => {
        el.addEventListener('touchstart', () => {
            isScrolling = false;
            // Limpiar otros elementos activos antes de encender este
            document.querySelectorAll('.touch-hover').forEach(otherEl => {
                if (otherEl !== el) otherEl.classList.remove('touch-hover');
            });
            el.classList.add('touch-hover');
        }, { passive: true });

        el.addEventListener('touchmove', () => {
            // Si el dedo se mueve, interpretamos que el usuario está desplazándose y quitamos el hover
            el.classList.remove('touch-hover');
        }, { passive: true });

        el.addEventListener('touchend', () => {
            // Un pequeño retraso para percibir el cambio de color al hacer tap
            setTimeout(() => {
                if (!isScrolling) {
                    el.classList.remove('touch-hover');
                }
            }, 300);
        }, { passive: true });

        el.addEventListener('touchcancel', () => {
            el.classList.remove('touch-hover');
        }, { passive: true });
    });
});

