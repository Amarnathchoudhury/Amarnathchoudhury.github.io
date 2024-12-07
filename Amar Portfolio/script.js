// DOM Elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
const themeToggle = document.querySelector('.theme-toggle');
const contactForm = document.getElementById('contact-form');
const body = document.body;

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

const themes = {
    light: {
        icon: 'fa-moon',
        next: 'dark'
    },
    dark: {
        icon: 'fa-sun',
        next: 'light'
    }
};

function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    currentTheme = theme;
    
    // Update theme toggle icon
    themeToggle.innerHTML = `<i class="fas ${themes[theme].icon}"></i>`;
}

// Initialize theme
setTheme(currentTheme);

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const nextTheme = themes[currentTheme].next;
    setTheme(nextTheme);
});

// Navigation
function setActiveSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show active section
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');
    
    // Update navigation links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Update URL without scrolling
    history.pushState(null, '', `#${sectionId}`);
}

// Navigation click handler
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        setActiveSection(sectionId);
    });
});

// Initialize active section from URL or default to home
function initializeSection() {
    const hash = window.location.hash.substring(1) || 'home';
    setActiveSection(hash);
}

// Handle browser back/forward
window.addEventListener('popstate', initializeSection);

// Initialize section on load
document.addEventListener('DOMContentLoaded', initializeSection);

// 3D Tilt Effect for Cards
const tiltElements = document.querySelectorAll('.profile-card, .project-card');
VanillaTilt.init(tiltElements, {
    max: 15,
    speed: 400,
    glare: true,
    'max-glare': 0.3
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.timeline-item, .project-card, .profile-card, .bio-card').forEach(element => {
    animateOnScroll.observe(element);
});

// Contact Form Handling
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formProps = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = contactForm.querySelector('button');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Email service configuration
        const emailData = {
            to: 'amarnathchoudhury2@gmail.com',
            subject: `Portfolio Contact: ${formProps.name}`,
            text: `
                Name: ${formProps.name}
                Email: ${formProps.email}
                Message: ${formProps.message}
            `
        };

        // You'll need to set up an email service (e.g., EmailJS, AWS SES, or your own backend)
        // This is a placeholder for the email sending logic
        await sendEmail(emailData);
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Helper function to send email (implement based on your chosen email service)
async function sendEmail(data) {
    // Example using EmailJS
    // You'll need to sign up for EmailJS and include their SDK
    // return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data);
    
    // For now, we'll simulate the email sending
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
}

// Mobile Navigation
const navToggle = document.createElement('button');
navToggle.className = 'nav-toggle';
navToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('.navbar').appendChild(navToggle);

navToggle.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        document.querySelector('.nav-links').classList.remove('active');
    }
});

// Smooth scroll for mobile
if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
} else {
    import('smoothscroll-polyfill').then(smoothScroll => {
        smoothScroll.polyfill();
    });
}