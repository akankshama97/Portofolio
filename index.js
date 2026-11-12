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
    // 2. Permanent Modern Dark Slate Theme Lock
    // -------------------------------------------------------------
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', 'dark');
    try {
        localStorage.removeItem('portfolio-theme');
    } catch (e) {
        // Storage access fallback
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
        toast.style.background = isError ? '#DC2626' : '#1C1917';
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

    // -------------------------------------------------------------
    // 11. Interactive Constellation Canvas Background
    // -------------------------------------------------------------
    const canvas = document.getElementById('interactive-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 22 : 48;
        const maxDistance = isMobile ? 85 : 125;
        const mouseRadius = isMobile ? 90 : 150;

        const particles = [];
        const colors = [
            'rgba(16, 185, 129, ',   // Emerald Tech
            'rgba(6, 182, 212, ',    // Cyan
            'rgba(52, 211, 153, ',   // Mint
            'rgba(56, 189, 248, '    // Sky Blue
        ];

        const mouse = {
            x: -1000,
            y: -1000,
            isActive: false
        };

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : height + 10;
                this.radius = Math.random() * 2 + 1.2;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = -Math.random() * 0.55 - 0.25; // Slow upward drift
                this.baseColor = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.38 + 0.22;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction (gentle repulsion / attraction)
                if (mouse.isActive) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < mouseRadius) {
                        const force = (1 - dist / mouseRadius) * 1.4;
                        this.x -= (dx / dist) * force;
                        this.y -= (dy / dist) * force;
                    }
                }

                // Wrap or reset
                if (this.y < -10) this.reset();
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.baseColor + this.alpha + ')';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxDistance) {
                        const lineAlpha = (1 - dist / maxDistance) * 0.16;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Connect to mouse cursor
                if (mouse.isActive) {
                    const mdx = particles[i].x - mouse.x;
                    const mdy = particles[i].y - mouse.y;
                    const mdist = Math.hypot(mdx, mdy);
                    if (mdist < mouseRadius) {
                        const mAlpha = (1 - mdist / mouseRadius) * 0.24;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(52, 211, 153, ${mAlpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        let animationFrameId;
        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            drawLines();
            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        // Track mouse / touch
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.isActive = true;
        });

        window.addEventListener('mouseleave', () => {
            mouse.isActive = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
                mouse.isActive = true;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouse.isActive = false;
        });

        // Resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }, 150);
        });

        // Pause animation when tab is inactive to save battery
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animationFrameId = requestAnimationFrame(animate);
            }
        });
    }
});
