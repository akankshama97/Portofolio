/**
 * Akanksha Maurya - Portfolio Interactive Scripts
 * Handles Theme Toggling, Mobile Navigation, Scrollspy, Typing Effect, 
 * Clipboard copy, Contact Form, and UX Micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Current Year in Footer
    // -------------------------------------------------------------
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // -------------------------------------------------------------
    // 2. Dark / Light Theme Toggle with LocalStorage
    // -------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved theme in localStorage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    }

    // -------------------------------------------------------------
    // 3. Mobile Navigation Menu Toggle
    // -------------------------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });

        // Close mobile menu on clicking any navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // -------------------------------------------------------------
    // 4. Scroll Progress Indicator & Back to Top Button
    // -------------------------------------------------------------
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercentage = (scrollTop / scrollHeight) * 100;

        if (scrollProgress) {
            scrollProgress.style.width = `${scrolledPercentage}%`;
        }

        // Back to top button visibility
        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // -------------------------------------------------------------
    // 5. Active Navbar Link on Scroll (Scrollspy)
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveNavLink() {
        const scrollPosition = window.scrollY + 160;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNavLink);
    highlightActiveNavLink();

    // -------------------------------------------------------------
    // 6. Interactive Typing Effect for Roles
    // -------------------------------------------------------------
    const roleTextEl = document.getElementById('dynamic-role') || document.getElementById('role-text');
    if (roleTextEl) {
        const roles = [
            "Full Stack Developer",
            "Frontend & React Specialist",
            "Next.js & MERN Builder",
            "Java & DSA Problem Solver",
            "GenAI Application Creator"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                roleTextEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                roleTextEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 110;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2000; // Pause after completing word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400; // Pause before typing next word
            }

            setTimeout(typeEffect, typingSpeed);
        }

        setTimeout(typeEffect, 600);
    }

    // -------------------------------------------------------------
    // 7. Toast Notification Utility
    // -------------------------------------------------------------
    const toast = document.getElementById('toast');
    let toastTimeout;

    function showToast(message, isError = false) {
        if (!toast) return;
        toast.textContent = message;
        toast.style.background = isError ? '#ef4444' : '#10b981';
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // -------------------------------------------------------------
    // 8. Copy Email to Clipboard
    // -------------------------------------------------------------
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailAddress = "akankshama97@gmail.com";

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(emailAddress);
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = emailAddress;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-9999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }
                showToast("Email copied to clipboard!");
            } catch (err) {
                showToast("Could not copy automatically. Email: " + emailAddress);
            }
        });
    }

    // -------------------------------------------------------------
    // 9. Direct Contact Form Submission (Mailto Integration)
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showToast("Please fill in all required fields.", true);
                return;
            }

            // Construct mailto link
            const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject} - from ${name}`);
            const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:akankshama97@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

            window.location.href = mailtoLink;
            showToast("Opening email client to send your message...");
            contactForm.reset();
        });
    }

    // -------------------------------------------------------------
    // 10. Resume Download Handling
    // -------------------------------------------------------------
    const resumeButtons = document.querySelectorAll('a[href="resume.pdf"]');
    resumeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            fetch('resume.pdf', { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        showToast("Downloading Akanksha's resume...");
                    } else {
                        e.preventDefault();
                        showToast("Tip: Put your 'resume.pdf' in the website folder or link your Google Drive!");
                    }
                })
                .catch(() => {
                    // Direct browser download
                });
        });
    });
});
