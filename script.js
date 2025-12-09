// Translation data
const translations = {
    en: {
        // Navigation
        nav_home: "Home",
        nav_about: "About Us",
        nav_services: "Services",
        nav_contact: "Contact",

        // Hero Section
        hero_title_1: "SUSTAINABLE ORGANIZATION FOR CONSISTENCY",
        hero_description_1: "We empower businesses with intelligent technology solutions that drive innovation, enhance efficiency, and create sustainable value.",
        hero_title_2: "Get Bronze Certified within 24 Hours",
        hero_description_2: "Golden opportunity for MSMEs to become world-class manufacturers through Zero Defect, Zero Effect practices.",
        hero_title_3: "Expert ZED Consulting",
        hero_description_3: "Professional guidance to help your business achieve manufacturing excellence and global standards.",
        hero_cta: "Get Started",

        // About Section
        about_title: "About Us",
        about_description: "Navabharath Technologies is a leading IT solutions provider dedicated to delivering innovative and robust digital products. With a team of expert developers and designers, we transform ideas into reality. Our mission is to empower businesses with scalable, efficient technology and comprehensive end-to-end services.",
        about_feature1: "Innovative Solutions",
        about_feature2: "Digital Marketing",
        about_feature3: "Customer-Centric Approach",
        about_feature4: "Expert Team",

        // Services Section
        services_title: "Our Services",
        services_subtitle: "Comprehensive solutions for your business needs",
        service1_title: "Zed certification",
        service1_description: "Achieve Zero Defect Zero Effect certification.",
        service2_title: "ISO",
        service2_description: "International Organization for Standardization certification services.",
        service3_title: "ISI",
        service3_description: "Indian Standards Institution (ISI) mark certification.",
        service4_title: "Zed assessment",
        service4_description: "Comprehensive ZED assessment for your business.",
        service5_title: "Zed consulting",
        service5_description: "Expert consulting for ZED implementation.",
        service6_title: "Fssai",
        service6_description: "Food Safety and Standards Authority of India registration and licensing.",

        // Contact Section
        contact_title: "Contact Us",
        contact_subtitle: "Ready to start your project? Get in touch with us today.",
        form_name: "Name",
        form_email: "Email",
        form_message: "Message",
        form_submit: "Send Message",

        // Footer
        footer_tagline: "SUSTAINABLE ORGANIZATION FOR CONSISTENCY",
        footer_links_title: "Quick Links",
        footer_about: "About",
        footer_services: "Services",
        footer_contact: "Contact",
        footer_social_title: "Follow Us",
        footer_copyright: "© 2025 Navabharatha. All rights reserved."
    }
};

// Language codes mapping



document.addEventListener('DOMContentLoaded', () => {
    console.log('Navabharath Technologies website loaded');





    // Custom Notification Function
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('customNotification');
        notification.textContent = message;
        notification.className = `custom-notification ${type} show`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Form submission handler
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitBtn = form.querySelector('button[type="submit"]');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            // Basic Validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            // Email Validation Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Disable button and show loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                console.log('Sending email...');

                const response = await fetch('https://company-website-backend-91ia.onrender.com/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                console.log('Response received:', response.status, response.ok);

                let data;
                try {
                    data = await response.json();
                    console.log('Response data:', data);
                } catch (jsonError) {
                    console.error('JSON parse error:', jsonError);
                    throw new Error('Invalid server response');
                }

                if (response.ok) {
                    // Success!
                    console.log('Email sent successfully!');
                    showNotification(' Your message has been sent successfully. We will be in touch soon!', 'success');
                    form.reset();
                } else {
                    // Server returned an error
                    console.error('Server error:', data);
                    throw new Error(data.message || 'Server error occurred');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                showNotification(' Message failed to send. Please try again later or contact us directly.', 'error');
            } finally {
                // Always restore button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                console.log('Form submission complete');
            }
        });
    }

    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');

    // Search function with page navigation
    function performSearch(query) {
        const searchTerm = query.toLowerCase().trim();

        // Always keep all service cards visible
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.style.display = 'block';
        });

        // If no search term, do nothing
        if (!searchTerm) {
            return;
        }

        // Define known pages and their corresponding section IDs
        const pageMapping = {
            'home': '#home',
            'about': '#about',
            'about us': '#about',
            'services': '#services',
            'service': '#services',
            'contact': '#contact',
            'contact us': '#contact'
        };

        // Check if search term matches any known page
        let matchFound = false;
        for (const [pageName, sectionId] of Object.entries(pageMapping)) {
            if (searchTerm === pageName || searchTerm.includes(pageName)) {
                // Navigate to the matching page section
                const targetSection = document.querySelector(sectionId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    matchFound = true;

                    // Update URL hash without triggering page reload
                    if (window.history.pushState) {
                        window.history.pushState(null, null, sectionId);
                    } else {
                        window.location.hash = sectionId;
                    }
                    break;
                }
            }
        }

        // If no match found, show message
        if (!matchFound) {
            alert('No matching page found. Please try searching for: Home, About, Services, or Contact.');
        }

        // Clear search input after search
        if (searchInput) {
            searchInput.value = '';
        }
    }

    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
    }

    // Search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }

    // Voice Search Functionality
    if (voiceSearchBtn) {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = currentLang === 'en' ? 'en-US' :
                currentLang === 'es' ? 'es-ES' :
                    currentLang === 'fr' ? 'fr-FR' :
                        currentLang === 'de' ? 'de-DE' :
                            currentLang === 'it' ? 'it-IT' :
                                currentLang === 'pt' ? 'pt-PT' :
                                    currentLang === 'ar' ? 'ar-SA' : 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            voiceSearchBtn.addEventListener('click', () => {
                voiceSearchBtn.classList.add('listening');
                recognition.start();
            });

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                searchInput.value = transcript;
                performSearch(transcript);
                voiceSearchBtn.classList.remove('listening');
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                voiceSearchBtn.classList.remove('listening');
                if (event.error === 'no-speech') {
                    alert('No speech detected. Please try again.');
                } else if (event.error === 'not-allowed') {
                    alert('Microphone access denied. Please enable microphone permissions.');
                }
            };

            recognition.onend = () => {
                voiceSearchBtn.classList.remove('listening');
            };
        } else {
            // Hide voice search button if not supported
            voiceSearchBtn.style.display = 'none';
            console.warn('Speech recognition not supported in this browser');
        }
    }

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.main-nav nav');
    const navLinks = document.querySelectorAll('.nav-menu a');

    console.log('Hamburger:', hamburger);
    console.log('Nav Menu:', navMenu);

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            console.log('Menu active:', navMenu.classList.contains('active'));

            // Toggle icon between bars and times (close)
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Carousel Logic
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button--right');
        const prevButton = document.querySelector('.carousel-button--left');
        const dotsNav = document.querySelector('.carousel-dots');
        const dots = Array.from(dotsNav.children);

        let currentIndex = 0;

        const moveToSlide = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;

            // Update slide classes
            slides.forEach((slide, i) => {
                slide.classList.toggle('current-slide', i === index);
            });

            // Update dot classes
            dots.forEach((dot, i) => {
                dot.classList.toggle('current-slide', i === index);
            });

            currentIndex = index;
        };

        // Auto-play functionality
        let autoPlayInterval;
        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            }, 5000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        // Event listeners
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                stopAutoPlay();
                const nextIndex = (currentIndex + 1) % slides.length;
                moveToSlide(nextIndex);
                startAutoPlay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                stopAutoPlay();
                const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                moveToSlide(prevIndex);
                startAutoPlay();
            });
        }

        if (dotsNav) {
            dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('button');
                if (!targetDot) return;

                stopAutoPlay();
                const targetIndex = dots.findIndex(dot => dot === targetDot);
                moveToSlide(targetIndex);
                startAutoPlay();
            });
        }

        // Start auto-play on load
        startAutoPlay();
    }
});
