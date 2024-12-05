document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check and apply saved theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('dark-mode', savedTheme === 'dark');
        updateDarkModeIcon(savedTheme === 'dark');
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('dark-mode');
        updateDarkModeIcon(isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    function updateDarkModeIcon(isDarkMode) {
        const icon = darkModeToggle.querySelector('i');
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTopButton.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Lazy Loading Content (Sermons & Devotionals)
    const sectionsToLoad = [
        { id: 'sermons-placeholder', endpoint: '/api/sermons', title: 'Sermons' },
        { id: 'devotionals-placeholder', endpoint: '/api/devotionals', title: 'Devotionals' },
    ];

    sectionsToLoad.forEach((section) => {
        const placeholder = document.getElementById(section.id);
        fetch(section.endpoint)
            .then((response) => response.json())
            .then((data) => {
                placeholder.innerHTML = data
                    .map(
                        (item) => `
                        <div class="post-card">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            <a href="${item.link}" class="btn glow-on-hover">Read More</a>
                        </div>
                    `
                    )
                    .join('');
            })
            .catch(() => {
                placeholder.innerHTML = `<p>Error loading ${section.title.toLowerCase()}.</p>`;
            });
    });

    // Smooth Scroll for Navigation Links
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector(link.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Lazy Fade-In Effect for Content Sections
    const contentSections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.2 }
    );

    contentSections.forEach((section) => observer.observe(section));

    // Carousel (Upcoming Events)
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentCarouselIndex = 0;

    function updateCarousel() {
        carouselItems.forEach((item, index) => {
            item.style.display = index === currentCarouselIndex ? 'block' : 'none';
        });
    }

    setInterval(() => {
        currentCarouselIndex = (currentCarouselIndex + 1) % carouselItems.length;
        updateCarousel();
    }, 3000); // Change carousel every 

    updateCarousel();

    
    const contactForm = document.querySelector('form');
    const emailError = document.getElementById('email-error');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address.';
            return;
        } else {
            emailError.textContent = '';  
        }

       
        alert('Thank you for your message!');
        contactForm.reset();
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
