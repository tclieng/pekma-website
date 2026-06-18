// PEKMA Website JavaScript

// ==================== LANGUAGE SWITCHER ====================

let currentLang = localStorage.getItem('pekma_lang') || 'ms';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    initLangSwitcher();
    initMobileMenu();
    initContactForm();
});

// Language Switcher Functions
function initLangSwitcher() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // Toggle dropdown
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langDropdown.classList.remove('active');
    });
    
    // Handle language selection
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
            langDropdown.classList.remove('active');
        });
    });
    
    // Update button text
    updateLangButton();
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('pekma_lang', lang);
    
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslation(key, lang);
        
        if (translation) {
            // Check if it's an HTML content or plain text
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update button text
    updateLangButton();
    
    // Trigger custom event for any additional language change handlers
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function getTranslation(key, lang) {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return null;
        }
    }
    
    return value[lang] || value['ms']; // Fallback to MS
}

function updateLangButton() {
    const currentLangSpan = document.getElementById('currentLang');
    if (!currentLangSpan) return;
    
    const langLabels = {
        'ms': 'BM',
        'en': 'EN',
        'zh': '中文'
    };
    
    currentLangSpan.textContent = langLabels[currentLang] || 'BM';
}

// ==================== MOBILE MENU ====================

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ==================== SMOOTH SCROLLING ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== CONTACT FORM ====================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Here you would normally send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // In production, you would integrate with:
            // - EmailJS for email sending
            // - A backend API
            // - Google Forms
            // - Formspree
            
            // Example: Send to EmailJS (you need to set up an account)
            // emailjs.send('service_id', 'template_id', data)
            //     .then(() => {
            //         contactForm.style.display = 'none';
            //         formSuccess.style.display = 'block';
            //     })
            //     .catch((error) => {
            //         console.error('Error:', error);
            //         alert('Ralat menghantar mesej. Sila cuba lagi.');
            //     });
        });
    }
}

// ==================== NAVBAR SCROLL EFFECT ====================

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// ==================== ANIMATION ON SCROLL ====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.mv-card, .link-card, .objective-card, .committee-item').forEach(el => {
    observer.observe(el);
});

// ==================== LAZY LOADING ====================

if ('loading' in HTMLImageElement.prototype) {
    // Browser supports lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    // You could integrate a library like lozad.js here
}

// ==================== GALLERY FILTER ====================

const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ==================== CONSOLE MESSAGE ====================

console.log('%c PEKMA Website ', 'background: #2E7D32; color: white; font-size: 20px; padding: 10px 20px;');
console.log('%c Developed with care for community welfare ', 'background: #4CAF50; color: white; font-size: 14px; padding: 5px 10px;');
