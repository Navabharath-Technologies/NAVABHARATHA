// Translation data is loaded from translations.js

// Language codes mapping
const langCodes = {
    en: 'EN',
    kn: 'KN',
    hi: 'HI',
    ta: 'TA',
    te: 'TE',
    mr: 'MR',
    ml: 'ML'
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

    // Language Dropdown Functionality
    const langBtns = document.querySelectorAll('.lang-btn');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangSpans = document.querySelectorAll('.current-lang-text');

    // Load saved language or default to English
    let currentLang = localStorage.getItem('selectedLanguage') || 'en';
    updateLanguage(currentLang);

    // Toggle dropdowns
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const selector = btn.closest('.language-selector');
            const dropdown = selector.querySelector('.language-dropdown');

            // Close other dropdowns
            document.querySelectorAll('.language-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });

            dropdown.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        document.querySelectorAll('.language-dropdown').forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Language selection
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.getAttribute('data-lang');
            updateLanguage(selectedLang);
            localStorage.setItem('selectedLanguage', selectedLang);
            document.querySelectorAll('.language-dropdown').forEach(d => d.classList.remove('active'));
        });
    });

    // Update language function
    function updateLanguage(lang) {
        currentLang = lang;
        currentLangSpans.forEach(span => {
            span.textContent = langCodes[lang];
        });

        // Update active state in dropdown
        langOptions.forEach(option => {
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // Translate all elements with data-translate attribute
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });

        // Handle RTL if necessary (none for current supported languages)
        document.body.setAttribute('dir', 'ltr');
    }

    // Form submission handler
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const serviceInput = document.getElementById('service');
            const messageInput = document.getElementById('message');
            const submitBtn = form.querySelector('button[type="submit"]');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const service = serviceInput.value;
            const message = messageInput.value.trim();

            // Basic Validation
            if (!name || !email || !phone || !service || !message) {
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

                const response = await fetch('https://zed-backend-yt1l.onrender.com/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, service, message })
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
        // Define known pages and their corresponding section IDs
        const pageMapping = {
            'home': '#home',
            'about': '#about',
            'about us': '#about',
            'services': '#services',
            'service': '#services',
            'dashboard': '#dashboard',
            'analysis': '#dashboard',
            'analytics': '#dashboard',
            'contact': '#contact',
            'contact us': '#contact',
            // Specific Services
            'zed certification': '#service-zed-certification',
            'zed consulting': '#service-zed-consulting',
            'zed assessment': '#service-zed-assessment',
            'iso': '#service-iso',
            'isi': '#service-isi',
            'fssai': '#service-fssai',
            'business consulting': '#service-business-consulting',
            'software solutions': '#service-software-solutions',
            'software': '#service-software-solutions'
        };

        // Check if search term matches any known page or service
        let matchFound = false;

        // 1. Check direct mapping first
        for (const [key, targetId] of Object.entries(pageMapping)) {
            if (searchTerm === key || searchTerm.includes(key) || key.includes(searchTerm)) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Scroll to element
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    matchFound = true;

                    // Highlighting logic for cards
                    if (targetElement.classList.contains('service-card')) {
                        targetElement.classList.add('highlight-card');
                        setTimeout(() => {
                            targetElement.classList.remove('highlight-card');
                        }, 2000);
                    }

                    // Update hash only if it's a section
                    if (!targetId.includes('service-')) {
                        if (window.history.pushState) {
                            window.history.pushState(null, null, targetId);
                        } else {
                            window.location.hash = targetId;
                        }
                    }
                    break;
                }
            }
        }

        // 2. Search through translation values for the current language
        if (!matchFound) {
            const currentTranslations = translations[currentLang];
            let bestMatchKey = null;
            let highestScore = 0;

            for (const [key, value] of Object.entries(currentTranslations)) {
                if (typeof value === 'string') {
                    const textValue = value.toLowerCase();
                    if (textValue.includes(searchTerm)) {
                        const score = searchTerm.length / textValue.length;
                        if (score > highestScore) {
                            highestScore = score;
                            bestMatchKey = key;
                        }
                    }
                }
            }

            if (bestMatchKey) {
                // Find element with this translation key
                const element = document.querySelector(`[data-translate="${bestMatchKey}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight-card');
                    setTimeout(() => element.classList.remove('highlight-card'), 2000);
                    matchFound = true;
                } else if (bestMatchKey.startsWith('service')) {
                    // Try to find the service section if it's a service key but element not found
                    const serviceId = bestMatchKey.split('_')[0].replace('service', 'service-');
                    const serviceElement = document.getElementById(serviceId);
                    if (serviceElement) {
                        serviceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        matchFound = true;
                    }
                }
            }
        }

        // 3. Fallback: Search across separate pages
        if (!matchFound) {
            const externalPages = {
                'terms': 'terms.html',
                'privacy': 'privacy.html',
                'policy': 'privacy.html',
                'condition': 'terms.html',
                'assessment': 'assessment.html',
                'consulting': 'consulting.html',
                'support': 'index.html#contact'
            };

            for (const [key, url] of Object.entries(externalPages)) {
                if (searchTerm.includes(key)) {
                    window.location.href = url;
                    matchFound = true;
                    break;
                }
            }
        }

        // If no match found, show message
        if (!matchFound) {
            showNotification('No matching content found. Try searching for "About", "Services", "ZED", etc.', 'error');
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
            const speechLangMapping = {
                'en': 'en-IN',
                'hi': 'hi-IN',
                'kn': 'kn-IN',
                'ta': 'ta-IN',
                'te': 'te-IN',
                'mr': 'mr-IN',
                'ml': 'ml-IN'
            };
            recognition.lang = speechLangMapping[currentLang] || 'en-IN';
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
    const navMenu = document.querySelector('.main-nav nav') || document.querySelector('.mobile-nav');
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

    // Read More / Read Less Functionality for Services
    // Service Details Toggle Functionality
    const toggleBtns = document.querySelectorAll('.service-toggle');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card hover effects if any
            const card = btn.closest('.service-card');
            const details = card.querySelector('.service-details');

            if (details) {
                // Toggle active class on button (for rotation)
                btn.classList.toggle('active');

                // Toggle hidden class on details
                const isHidden = details.classList.contains('hidden');

                if (isHidden) {
                    details.classList.remove('hidden');
                } else {
                    details.classList.add('hidden');
                }
            }
        });
    });

    // Services Slider Functionality
    const servicesGrid = document.querySelector('.services-grid');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (servicesGrid && prevBtn && nextBtn) {

        const getScrollAmount = () => {
            const card = servicesGrid.querySelector('.service-card');
            if (!card) return 350; // Default fallback
            const style = window.getComputedStyle(card);
            const gap = 32; // Default desktop gap
            // Try to measure actual gap or use estimation
            return card.offsetWidth + gap;
        };

        prevBtn.addEventListener('click', () => {
            servicesGrid.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            servicesGrid.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });

        const updateScrollButtons = () => {
            // Left button (start)
            if (servicesGrid.scrollLeft <= 5) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
            }

            // Right button (end)
            if (Math.ceil(servicesGrid.scrollLeft + servicesGrid.clientWidth) >= servicesGrid.scrollWidth - 5) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'flex';
            }
        };

        servicesGrid.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);
        // Initial check
        updateScrollButtons();
    }

    // Dashboard Charts Initialization
    let perfChart, serviceChart; // Expose charts for updates

    const initCharts = () => {
        const perfCtx = document.getElementById('performanceChart');
        const serviceCtx = document.getElementById('serviceChart');

        if (perfCtx) {
            perfChart = new Chart(perfCtx, {
                type: 'bar',
                data: {
                    labels: ['2023-24', '2024-25', '2025-26'],
                    datasets: [{
                        label: 'Operational Excellence Score',
                        data: [0, 0, 0], // Initial empty data, to be filled by fetch
                        backgroundColor: '#0E5E72',
                        borderColor: '#0E5E72',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return 'Score: ' + context.parsed.y + '%';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }

        if (serviceCtx) {
            // Plugin to draw text inside segments
            const insideLabelPlugin = {
                id: 'insideLabel',
                afterDatasetsDraw(chart, args, options) {
                    const { ctx } = chart;
                    ctx.save();
                    chart.data.datasets.forEach((dataset, i) => {
                        chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
                            const { x, y } = datapoint.tooltipPosition();

                            ctx.font = 'bold 11px sans-serif';
                            ctx.fillStyle = '#ffffff';
                            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                            ctx.shadowBlur = 3;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            const model = datapoint;
                            const midAngle = (model.startAngle + model.endAngle) / 2;
                            const radius = (model.outerRadius + model.innerRadius) / 2;
                            const cx = model.x + Math.cos(midAngle) * radius;
                            const cy = model.y + Math.sin(midAngle) * radius;

                            const text = chart.data.labels[index];
                            if (dataset.data[index] > 0) {
                                ctx.fillText(text, cx, cy);
                            }
                        });
                    });
                    ctx.restore();
                }
            };

            serviceChart = new Chart(serviceCtx, {
                type: 'doughnut',
                data: {
                    labels: ['2023', '2024', '2025'],
                    datasets: [{
                        data: [0, 0, 0], // Initial empty data
                        backgroundColor: [
                            '#7f8c8d', // 2023
                            '#16a085', // 2024
                            '#2ecc71'  // 2025
                        ],
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        hoverOffset: 12
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.label + ': ' + context.parsed;
                                }
                            }
                        }
                    },
                    cutout: '60%',
                    layout: {
                        padding: 20
                    }
                },
                plugins: [insideLabelPlugin]
            });
        }
    };

    // Counter Animation
    const initCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;

                    if (target > 0) { // Only animate if target is set
                        const increment = target / speed;
                        const updateCount = () => {
                            const current = +counter.innerText;
                            if (current < target) {
                                counter.innerText = Math.ceil(current + increment);
                                setTimeout(updateCount, 1);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    }
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    };

    // Scroll Animations (AOS Style) - Modern Approach
    const initScrollAnimations = () => {
        const observerOptions = {
            threshold: 0.15, // Trigger when 15% visible
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-animate');
                } else {
                    entry.target.classList.remove('show-animate');
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    };

    // --- Google Sheets Integration ---
    const fetchDashboardData = async () => {
        const sheetId = '1DLFMmLy27R5Pt7iEnjFPN8Jf3hhEqkMe';
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

        try {
            console.log('Fetching dashboard data...');
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch data');
            const csvText = await response.text();

            // Parse CSV
            const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim()));

            const dataMap = {};
            rows.slice(1).forEach(row => {
                // Metric, Percentage, 2023, 2024, 2025
                if (row.length >= 5) {
                    dataMap[row[0]] = {
                        'pct': row[1],
                        '2023': parseInt(row[2]) || 0,
                        '2024': parseInt(row[3]) || 0,
                        '2025': parseInt(row[4]) || 0
                    };
                }
            });

            console.log('Parsed Dashboard Data:', dataMap);

            // Update Counters (Using 2025 Data)
            const updateMetric = (translateKey, value, pct) => {
                // Find container by translation key of its label
                const label = document.querySelector(`[data-translate="${translateKey}"]`);
                if (label) {
                    const counter = label.nextElementSibling; // Assuming structure: h4, span.counter
                    if (counter && counter.classList.contains('counter')) {
                        counter.setAttribute('data-target', value);
                        counter.innerText = value; // Direct update
                    }

                    // Update Percentage if available
                    if (pct && pct !== '-' && pct !== '') {
                        const trend = label.parentNode.querySelector('.metric-trend');
                        if (trend) {
                            const isNegative = pct.includes('-');
                            const cleanPct = pct.replace('%', '');
                            const icon = isNegative ? 'fa-arrow-down' : 'fa-arrow-up';
                            const colorClass = isNegative ? 'danger' : 'success';

                            // Remove existing classes
                            trend.classList.remove('success', 'danger', 'warning');
                            trend.classList.add(colorClass); // Add new color class

                            // Standardize text
                            trend.innerHTML = `<i class="fas ${icon}"></i> ${pct}`;
                            // Add inline style for danger if class missing
                            if (isNegative) trend.style.color = '#ef4444';
                            else trend.style.color = ''; // Reset to class style
                        }
                    }
                }
            };

            // Flexible matching for keys
            const getRowData = (key) => dataMap[key] || dataMap[key + ' FY'] || dataMap['Total ' + key];

            if (dataMap['Business Partners FY'])
                updateMetric('metric_partners', dataMap['Business Partners FY']['2025'], dataMap['Business Partners FY']['pct']);
            else if (dataMap['Business Partners'])
                updateMetric('metric_partners', dataMap['Business Partners']['2025'], dataMap['Business Partners']['pct']);

            const projData = dataMap['Total Projects'] || dataMap['Projects'];
            if (projData) {
                updateMetric('metric_projects', projData['2025'], projData['pct']);
            }

            // Update Performance Chart (Operational Excellence Index)
            const oeiData = dataMap['Operational Excellence Index'] || dataMap['OEI'];
            if (oeiData && perfChart) {
                perfChart.data.datasets[0].data = [oeiData['2023'], oeiData['2024'], oeiData['2025']];
                perfChart.update();
            }

            const zedData = dataMap['ZED Certifications FY'] || dataMap['ZED Certifications'];
            if (zedData) {
                updateMetric('metric_certifications', zedData['2025'], zedData['pct']);
                // Update Chart (ZED Certifications)
                if (serviceChart) {
                    serviceChart.data.datasets[0].data = [zedData['2023'], zedData['2024'], zedData['2025']];
                    serviceChart.update();
                }
            }

            if (dataMap['Happy Clients'])
                updateMetric('metric_clients', dataMap['Happy Clients']['2025'], dataMap['Happy Clients']['pct']);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    // Initialize Dashboard Features
    initCharts();
    initCounters();
    initScrollAnimations();
    fetchDashboardData();
});

// Global Back Function
function goBack() {
    if (window.history.length > 1 && document.referrer.includes(window.location.hostname)) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}
