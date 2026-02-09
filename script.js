document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Smooth scrolling for anchor links (fallback/enhancement)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70; // Header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Intersection Observer for active nav highlighting
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${currentId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Typewriter Effect
    const texts = ["Bioinformatician", "Genomic Science Researcher", "DVM Graduate"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    let isDeleting = false;
    let typeSpeed = 100;

    (function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
            typeSpeed = 50;
        } else {
            letter = currentText.slice(0, ++index);
            typeSpeed = 100;
        }

        const typeWriterText = document.getElementById('typewriter-text');
        if (typeWriterText) {
            typeWriterText.textContent = letter;
        }

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    })();

    // Image Modal Logic
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.querySelector(".close-modal");

    // Zoom & Pan Logic
    const zoomInBtn = document.getElementById("zoomIn");
    const zoomOutBtn = document.getElementById("zoomOut");
    let currentZoom = 1;

    // Pan (Drag) Logic
    let isDragging = false;
    let startX, startY;
    let translateX = 0, translateY = 0;

    function updateTransform() {
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    }

    // Reset zoom and position when opening modal
    function resetView() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
        modalImg.style.cursor = 'grab';
    }

    if (modal) {
        // ... (existing click logic) ...
    }

    // Add click event to all certification cards
    const certCards = document.querySelectorAll("#certifications .card");
    certCards.forEach(card => {
        card.addEventListener("click", function () {
            const img = this.querySelector(".card-img-wrapper img");
            if (img && modal) {
                modal.style.display = "flex";
                modal.style.alignItems = "center";
                modal.style.justifyContent = "center";
                modalImg.src = img.src;
                resetView(); // Reset zoom and pan on open
            }
        });
    });

    // Panning Event Listeners
    modalImg.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) { // Only allow drag if zoomed in
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImg.style.cursor = 'grabbing';
            e.preventDefault(); // Prevent default image drag
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            modalImg.style.cursor = 'grab';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    if (zoomInBtn && modalImg) {
        zoomInBtn.onclick = function (e) {
            e.stopPropagation(); // Prevent closing modal
            currentZoom += 0.2;
            updateTransform();
        }
    }

    if (zoomOutBtn && modalImg) {
        zoomOutBtn.onclick = function (e) {
            e.stopPropagation(); // Prevent closing modal
            if (currentZoom > 0.4) {
                currentZoom -= 0.2;
                updateTransform();
            }
        }
    }

    // Close logic
    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = "none";
        }
    }

    if (modal) {
        modal.onclick = function (e) {
            // Only close if clicking the background (modal) strictly, not children
            if (e.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    // Contact Form Handling
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const data = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = "Thank you! I will give reply as soon as possible.";
                    formStatus.className = "success"; // Add class for styling
                    contactForm.reset(); // Clear the form
                } else {
                    const jsonData = await response.json();
                    if (Object.hasOwn(jsonData, 'errors')) {
                        formStatus.textContent = jsonData.errors.map(error => error.message).join(", ");
                    } else {
                        formStatus.textContent = "Oops! There was a problem submitting your form";
                    }
                    formStatus.className = "error";
                }
            } catch (error) {
                formStatus.textContent = "Oops! There was a problem submitting your form";
                formStatus.className = "error";
            }
        });
    }

});
document.addEventListener('DOMContentLoaded', () => {
    /* Search Functionality */
    const searchBtn = document.getElementById('search-btn');
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.getElementById('search-input');
    const closeSearchBtn = document.getElementById('close-search');
    const searchResults = document.getElementById('search-results');

    // Toggle Search Bar
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchContainer.classList.add('active');
            searchInput.focus();
        });
    }

    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSearch();
        });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            closeSearch();
        }
    });

    function closeSearch() {
        searchContainer.classList.remove('active');
        searchInput.value = '';
        searchResults.classList.remove('show');
        searchResults.innerHTML = '';
    }

    // Index Content
    let searchIndex = [];

    function buildSearchIndex() {
        const sections = document.querySelectorAll('section');
        searchIndex = [];

        sections.forEach(section => {
            const sectionId = section.id;
            const sectionTitle = section.querySelector('h2')?.innerText || sectionId;

            // Text nodes
            const walker = document.createTreeWalker(
                section,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent.trim();
                // Filter out short or empty text, and script/style content if any
                if (text.length > 3 && node.parentElement.tagName !== 'SCRIPT' && node.parentElement.tagName !== 'STYLE') {
                    searchIndex.push({
                        text: text,
                        sectionId: sectionId,
                        sectionTitle: sectionTitle,
                        element: node.parentElement
                    });
                }
            }
        });
    }

    // Build index initially
    buildSearchIndex();

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            searchResults.classList.remove('show');
            searchResults.innerHTML = '';
            return;
        }

        const results = searchIndex.filter(item => item.text.toLowerCase().includes(query));

        // Deduplicate results based on element to avoid showing same paragraph multiple times if multiple matches in same node
        const uniqueResults = [];
        const seenElements = new Set();

        results.forEach(item => {
            if (!seenElements.has(item.element)) {
                uniqueResults.push(item);
                seenElements.add(item.element);
            }
        });

        displayResults(uniqueResults, query);
    });

    function displayResults(results, query) {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            const noResult = document.createElement('div');
            noResult.className = 'search-result-item';
            noResult.textContent = 'No results found.';
            searchResults.appendChild(noResult);
        } else {
            results.slice(0, 10).forEach(result => { // Limit to 10 results
                const div = document.createElement('div');
                div.className = 'search-result-item';

                // Highlight matches in snippet
                const lowerText = result.text.toLowerCase();
                const index = lowerText.indexOf(query);
                const start = Math.max(0, index - 20);
                const end = Math.min(result.text.length, index + query.length + 40);
                let snippet = result.text.substring(start, end);

                if (start > 0) snippet = '...' + snippet;
                if (end < result.text.length) snippet = snippet + '...';

                // Highlighting in snippet
                const regex = new RegExp(`(${query})`, 'gi');
                const highlightedSnippet = snippet.replace(regex, '<span style="background-color: yellow; color: black;">$1</span>');

                div.innerHTML = `
                    <div class="search-result-title">${result.sectionTitle}</div>
                    <div class="search-result-snippet">${highlightedSnippet}</div>
                `;

                div.addEventListener('click', () => {
                    navigateToResult(result.element);
                });

                searchResults.appendChild(div);
            });
        }

        searchResults.classList.add('show');
    }

    function navigateToResult(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Flash Highlight
        element.classList.add('highlight-flash');
        setTimeout(() => {
            element.classList.remove('highlight-flash');
        }, 2000); // Remove after animation

        // Close search (optional, or keep open?) - usually close on navigation
        if (window.innerWidth < 768) {
            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuBtn = document.getElementById('mobile-menu');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        // Force close search on clicking result for better UX?
        // closeSearch(); 
    }
});
