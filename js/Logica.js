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

    // --- 10. SISTEMA MULTILENGUAJE (ESPAÑOL / INGLÉS) ---
    const translations = {
        es: {
            "nav-home": "Inicio",
            "nav-about": "Sobre Mí",
            "nav-skills": "Habilidades",
            "nav-projects": "Proyectos",
            "nav-contact": "Contacto",
            "hero-badge": "Disponible para nuevos proyectos",
            "hero-title-prefix": "Hola, soy",
            "hero-title-name": "Flavio Josueph Morales",
            "hero-subtitle": "Desarrollador de Software enfocado en el diseño de software para PC, aplicaciones móviles y arquitecturas de Inteligencia Artificial, impulsado por flujos de trabajo modernos de vibe coding.",
            "hero-btn-projects": "Ver Proyectos",
            "hero-btn-contact": "Contactar",
            "about-title": "Sobre Mí",
            "about-principles-title": "Principios",
            "about-principle1-title": "IA Colaborativa",
            "about-principle1-desc": "Maximizar el potencial de desarrollo mediante flujos ágiles y vibe coding.",
            "about-principle2-title": "Código Limpio",
            "about-principle2-desc": "Lógica estructurada y código legible basado en principios SOLID.",
            "about-principle3-title": "Multiplataforma",
            "about-principle3-desc": "Aplicaciones eficientes adaptadas tanto a PC como a dispositivos móviles.",
            "about-approach-title": "Mi Enfoque",
            "about-approach-desc1": "Como estudiante universitario actualmente cursando el 5to semestre de Ingeniería de Software, combino las bases académicas y el rigor técnico con las últimas herramientas de desarrollo rápido.",
            "about-approach-desc2": "Me apasiona llevar la teoría de algoritmos y lógica a la práctica real mediante la creación de aplicaciones funcionales para PC y móviles. Mi enfoque está en el aprendizaje continuo, experimentando con arquitecturas de IA y adoptando flujos de vibe coding para transformar proyectos académicos en soluciones de impacto.",
            "about-stat1-lbl": "Años de código",
            "about-stat2-lbl": "Proyectos terminados",
            "about-stat3-lbl": "Código limpio y probado",
            "skills-title": "Habilidades",
            "skills-subtitle": "Las tecnologías que utilizo para dar vida a los proyectos.",
            "skills-android-title": "Desarrollo Android",
            "skills-android-desc": "Creación de aplicaciones nativas en Kotlin, uso de Jetpack Compose, viewmodels y manejo seguro de almacenamiento local.",
            "skills-ai-title": "Inteligencia Artificial",
            "skills-ai-desc": "Integración de APIs de Modelos de Lenguaje (LLMs) como Gemini, análisis semántico de datos y automatización inteligente.",
            "skills-db-title": "Bases de Datos & Backend",
            "skills-db-desc": "Diseño y administración de bases de datos relacionales, optimización de consultas SQL complejas y lógica de almacenamiento estructurado.",
            "skills-tools-title": "Entornos & Herramientas",
            "skills-tools-desc": "Desarrollo ágil asistido por agentes inteligentes y entornos modernos que optimizan la productividad en el ciclo de vida del software.",
            "projects-title": "Proyectos destacados",
            "projects-subtitle": "Una selección de las aplicaciones que he diseñado y programado.",
            "projects-filter-all": "Todos",
            "projects-filter-android": "Android",
            "projects-filter-ai": "IA",
            "projects-filter-web": "Web",
            "project1-tag": "Android / Kotlin",
            "project1-title": "DupCleaner",
            "project1-desc": "Aplicación Android nativa en Kotlin y Jetpack Compose (MVVM). Escanea la agenda del dispositivo para agrupar y depurar de forma inteligente contactos duplicados, permitiendo un borrado masivo y seguro que protege el registro original.",
            "project1-demo": " Demo",
            "project1-soon": " Próximamente",
            "project2-tag": "Inteligencia Artificial",
            "project2-title": "AI Semantic Assistant",
            "project2-desc": "Asistente inteligente capaz de analizar, estructurar y clasificar grandes volúmenes de texto de manera semántica. Integra APIs de procesamiento de lenguaje natural y automatiza reportes.",
            "project2-code": " Código",
            "project3-tag": "Desarrollo Web",
            "project3-title": "TaskFlow Dashboard",
            "project3-desc": "Panel web de productividad con interfaz de cristal (glassmorphism) de alto rendimiento. Totalmente interactivo, responsivo y construido sin dependencias externas pesadas.",
            "project3-code": " Código",
            "contact-title": "Hablemos",
            "contact-subtitle": "¿Tienes un proyecto en mente o una propuesta laboral? Escríbeme.",
            "contact-info-title": "Información de Contacto",
            "contact-info-desc": "Escríbeme directamente o encuéntrame en mis redes profesionales.",
            "contact-info-email": "Correo",
            "contact-info-location": "Ubicación",
            "contact-info-location-val": "Ecuador",
            "form-placeholder-name": "Nombre",
            "form-placeholder-email": "Email",
            "form-placeholder-message": "Mensaje",
            "form-btn-submit": "Enviar Mensaje",
            "footer-copyright": "© 2026 Flavio Morales. Todos los derechos reservados."
        },
        en: {
            "nav-home": "Home",
            "nav-about": "About Me",
            "nav-skills": "Skills",
            "nav-projects": "Projects",
            "nav-contact": "Contact",
            "hero-badge": "Available for new projects",
            "hero-title-prefix": "Hi, I'm",
            "hero-title-name": "Flavio Josueph Morales",
            "hero-subtitle": "Software Developer focused on PC software design, mobile applications, and AI architectures, driven by modern vibe coding workflows.",
            "hero-btn-projects": "View Projects",
            "hero-btn-contact": "Contact",
            "about-title": "About Me",
            "about-principles-title": "Principles",
            "about-principle1-title": "Collaborative AI",
            "about-principle1-desc": "Maximize development potential through agile workflows and vibe coding.",
            "about-principle2-title": "Clean Code",
            "about-principle2-desc": "Structured logic and readable code based on SOLID principles.",
            "about-principle3-title": "Multiplatform",
            "about-principle3-desc": "Efficient applications tailored for both PC and mobile devices.",
            "about-approach-title": "My Approach",
            "about-approach-desc1": "As a university student currently in the 5th semester of Software Engineering, I combine academic foundations and technical rigor with the latest rapid development tools.",
            "about-approach-desc2": "I am passionate about bringing algorithm theory and logic into real practice by creating functional applications for PC and mobile. My focus is on continuous learning, experimenting with AI architectures, and adopting vibe coding workflows to transform academic projects into high-impact solutions.",
            "about-stat1-lbl": "Years of coding",
            "about-stat2-lbl": "Projects completed",
            "about-stat3-lbl": "Clean & tested code",
            "skills-title": "Skills",
            "skills-subtitle": "The technologies I use to bring projects to life.",
            "skills-android-title": "Android Development",
            "skills-android-desc": "Creation of native apps in Kotlin, using Jetpack Compose, viewmodels, and secure local storage management.",
            "skills-ai-title": "Artificial Intelligence",
            "skills-ai-desc": "Integration of Language Model (LLM) APIs like Gemini, semantic data analysis, and intelligent automation.",
            "skills-db-title": "Databases & Backend",
            "skills-db-desc": "Design and management of relational databases, optimization of complex SQL queries, and structured storage logic.",
            "skills-tools-title": "Environments & Tools",
            "skills-tools-desc": "Agile development assisted by intelligent agents and modern environments that optimize productivity in the software lifecycle.",
            "projects-title": "Featured Projects",
            "projects-subtitle": "A selection of applications I have designed and programmed.",
            "projects-filter-all": "All",
            "projects-filter-android": "Android",
            "projects-filter-ai": "AI",
            "projects-filter-web": "Web",
            "project1-tag": "Android / Kotlin",
            "project1-title": "DupCleaner",
            "project1-desc": "Native Android app in Kotlin and Jetpack Compose (MVVM). Scans the device agenda to intelligently group and clean duplicate contacts, allowing secure bulk deletion that protects the original registry.",
            "project1-demo": " Demo",
            "project1-soon": " Coming Soon",
            "project2-tag": "Artificial Intelligence",
            "project2-title": "AI Semantic Assistant",
            "project2-desc": "Intelligent assistant capable of analyzing, structuring, and classifying large volumes of text semantically. Integrates natural language processing APIs and automates reports.",
            "project2-code": " Code",
            "project3-tag": "Web Development",
            "project3-title": "TaskFlow Dashboard",
            "project3-desc": "Productivity web dashboard with high-performance glassmorphism interface. Fully interactive, responsive, and built without heavy external dependencies.",
            "project3-code": " Code",
            "contact-title": "Let's Talk",
            "contact-subtitle": "Have a project in mind or a job proposal? Write to me.",
            "contact-info-title": "Contact Information",
            "contact-info-desc": "Write to me directly or find me on my professional networks.",
            "contact-info-email": "Email",
            "contact-info-location": "Location",
            "contact-info-location-val": "Ecuador",
            "form-placeholder-name": "Name",
            "form-placeholder-email": "Email",
            "form-placeholder-message": "Message",
            "form-btn-submit": "Send Message",
            "footer-copyright": "© 2026 Flavio Morales. All rights reserved."
        }
    };

    let currentLang = localStorage.getItem('lang') || 'es';
    const langToggles = document.querySelectorAll('#lang-toggle, #lang-toggle-mobile');

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        // Traducir todos los elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                const icon = el.querySelector('i, svg');
                if (icon) {
                    el.innerHTML = '';
                    el.appendChild(icon);
                    el.appendChild(document.createTextNode(translations[lang][key]));
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Cambiar el texto de los botones del toggle
        langToggles.forEach(toggle => {
            toggle.textContent = lang === 'es' ? 'EN' : 'ES';
            toggle.setAttribute('aria-label', lang === 'es' ? 'Cambiar idioma a Inglés' : 'Switch language to Spanish');
        });
    }

    // Configurar los botones para cambiar idioma
    langToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const nextLang = currentLang === 'es' ? 'en' : 'es';
            document.body.style.opacity = '0.92';
            document.body.style.transition = 'opacity 0.25s ease';
            
            setTimeout(() => {
                setLanguage(nextLang);
                document.body.style.opacity = '1';
            }, 250);
        });
    });

    // Cargar idioma inicial
    setLanguage(currentLang);
});

