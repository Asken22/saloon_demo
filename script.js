document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const blob = document.querySelector('.cursor-blob');
    const blobFollower = document.querySelector('.cursor-blob-follower');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            blob.style.left = e.clientX + 'px';
            blob.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                blobFollower.style.left = e.clientX + 'px';
                blobFollower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Add hover effect for links and buttons
        const interactables = document.querySelectorAll('a, button, .glass-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                blob.style.width = '30px';
                blob.style.height = '30px';
                blob.style.backgroundColor = 'var(--primary)';
                blobFollower.style.width = '60px';
                blobFollower.style.height = '60px';
            });
            el.addEventListener('mouseleave', () => {
                blob.style.width = '20px';
                blob.style.height = '20px';
                blob.style.backgroundColor = 'var(--accent)';
                blobFollower.style.width = '40px';
                blobFollower.style.height = '40px';
            });
        });
    } else {
        blob.style.display = 'none';
        blobFollower.style.display = 'none';
    }

    // 2. Scroll Progress
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight * 100}%`;
        scrollProgress.style.width = scroll;
    });

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 5. Mouse Parallax Effect for Floating Elements
    const parallaxElements = document.querySelectorAll('.mouse-parallax');
    const heroSection = document.querySelector('.hero');

    if (window.matchMedia("(pointer: fine)").matches) {
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

            parallaxElements.forEach(el => {
                const speed = el.getAttribute('data-speed') || 1;
                el.style.transform = `translate(${xAxis * speed}px, ${yAxis * speed}px)`;
            });
        });
        
        // Reset transform on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            parallaxElements.forEach(el => {
                el.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    // 6. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Preloader Logic
    const hidePreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 800);
        }
    };
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }

    // 8. Staggered Text Reveal
    const revealHeadings = document.querySelectorAll('h1, .section-header h2');
    
    revealHeadings.forEach(heading => {
        const text = heading.innerText;
        heading.innerHTML = '';
        
        const words = text.split(' ');
        words.forEach((word, index) => {
            const container = document.createElement('span');
            container.className = 'reveal-text-container';
            
            const inner = document.createElement('span');
            inner.className = 'reveal-text-inner';
            inner.innerText = word;
            inner.style.transitionDelay = `${index * 0.08}s`;
            
            container.appendChild(inner);
            heading.appendChild(container);
            
            if (index < words.length - 1) {
                heading.appendChild(document.createTextNode(' '));
            }
        });
    });

    const textObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const inners = entry.target.querySelectorAll('.reveal-text-inner');
                inners.forEach(inner => inner.classList.add('revealed'));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealHeadings.forEach(el => textObserver.observe(el));

    // 9. Scroll Parallax for Images
    const parallaxImages = document.querySelectorAll('.gallery-item img, .about-image img, .why-us-image img');
    parallaxImages.forEach(img => {
        img.classList.add('img-parallax');
        // Prevent default transition from fighting parallax transform
        img.style.transition = 'transform 0.1s linear';
    });

    window.addEventListener('scroll', () => {
        parallaxImages.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const centerOffset = (rect.top + rect.height / 2) - (window.innerHeight / 2);
                const parallaxSpeed = 0.1;
                const yPos = centerOffset * parallaxSpeed;
                img.style.transform = `translateY(${yPos}px) scale(1.15)`;
            }
        });
    });

    // 10. Portfolio Contact Form Simulation
    const contactForm = document.getElementById('portfolio-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const statusMsg = document.getElementById('form-status');
            
            // Simulate loading state
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;
            statusMsg.classList.remove('visible');
            
            setTimeout(() => {
                // Success state
                submitBtn.innerText = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
                
                statusMsg.innerText = 'Thank you! Your message has been sent successfully.';
                statusMsg.classList.add('visible');
                
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    statusMsg.classList.remove('visible');
                }, 5000);
            }, 1500);
        });
    }
});
