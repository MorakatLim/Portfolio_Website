// Wait for the entire HTML document to be loaded and parsed before running the script
document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // === GLOBAL VARIABLES & STATE ======================================
    // ===================================================================

    // State for the image lightbox gallery
    let currentGalleryImages = [];
    let currentImageIndex = 0;

    // Get the main body element for later use (e.g., locking scroll)
    const body = document.body;

    // Get all main sections for intersection observer
    const sections = document.querySelectorAll('main#page-content section');


    // ===================================================================
    // === INITIAL PAGE LOAD ANIMATION ===================================
    // ===================================================================

    const heroSection = document.getElementById('hero');
    setTimeout(() => {
        heroSection.classList.add('active');
    }, 100);


    // ===================================================================
    // === DYNAMIC TOP NAVIGATION ========================================
    // ===================================================================

    const topNavList = document.querySelector('#top-nav .nav-list');
    const navItems = [];
    sections.forEach((section) => {
        const sectionId = section.id;
        // Create a user-friendly name from the section's data-theme attribute
        let sectionName = section.dataset.theme.replace(/-/g, ' ');
        sectionName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
        if (sectionId === 'hero') sectionName = 'Home'; // Override for hero section

        // Create and append the navigation list item
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${sectionId}`;
        link.textContent = sectionName;
        listItem.appendChild(link);
        topNavList.appendChild(listItem);
        navItems.push(listItem);
    });


    // ===================================================================
    // === MODAL CONTENT & LOGIC =========================================
    // ===================================================================

    /**
     * Generates the HTML for the 7 steps of architectural design for a modal.
     * @param {string} title - The main title for the modal content.
     * @param {string} summary - A short summary of the project.
     * @returns {string} - The complete HTML string for the modal content.
     */
    function generateArchitecturalStepsHTML(title, summary) {
        const steps = [
            "Schematic Design",
            "Design Development",
            "Construction Documents",
            "Bidding and Negotiation",
            "Construction Administration",
            "Substantial Completion",
            "Final Project Closeout"
        ];

        const descriptions = [
            "This initial phase involves understanding the client's needs, goals, and budget. We conduct site analysis and develop preliminary sketches and concepts to establish the project's overall vision.",
            "The schematic design is refined into a more detailed plan. This includes finalizing floor plans, elevations, and materials, and integrating structural, mechanical, and electrical systems.",
            "This is the most detailed phase where all specifications for construction are documented. A comprehensive set of drawings and specs is created for contractors to use for bidding and building.",
            "The completed construction documents are sent to contractors to get pricing. We assist in reviewing the bids, selecting the contractor, and finalizing the construction contract.",
            "We act as the owner's representative during construction, conducting site visits, reviewing the contractor's work for compliance with the documents, and managing any issues that arise.",
            "This milestone is reached when the building is essentially ready for move-in. We perform a final inspection, create a 'punch list' of remaining items for the contractor to fix, and certify completion.",
            "All remaining items are completed, final payments are made, and all project documentation, warranties, and manuals are handed over to the owner, officially concluding the project."
        ];

        let modalHTML = `
            <div class="modal-architecture-steps-content">
                <h2>${title}</h2>
                <p class="modal-architecture-summary">${summary}</p>
                <button class="modal-steps-toggle-btn" aria-label="Toggle steps visibility" aria-expanded="false">
                    <span class="toggle-text">Show Design Steps</span>
                    <svg class="toggle-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div class="architectural-steps-container">
        `;

        steps.forEach((step, index) => {
            modalHTML += `
                <div class="architectural-step">
                    <h3>Step ${index + 1}: ${step}</h3>
                    <div class="step-content">
                        <div class="step-image-placeholder">
                            <span>Image Placeholder</span>
                        </div>
                        <div class="step-description">
                            <p>${descriptions[index]}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        modalHTML += `
                </div>
            </div>
        `;
        return modalHTML;
    }

    // Configuration for travel photo galleries. Maps a category name to a path and image count.
    const travelImageConfig = {
        'Cloudcroft': { path: "Projects/Travels/New_Mexico/Cloudcroft/images_webp/", count: 7 },
        'Pistachio Land': { path: "Projects/Travels/New_Mexico/Pistachio_Land/images_webp/", count: 3 },
        'National Space Museum': { path: "Projects/Travels/New_Mexico/Space_Museum/images_webp/", count: 7 },
        'Trails': { path: "Projects/Travels/New_Mexico/Trails/images_webp/", count: 8 },
        'White Sands National Park': { path: "Projects/Travels/New_Mexico/White_Sands/images_webp/", count: 24 }
    };

    /**
     * Generates a structured object of travel categories and their image paths.
     * @param {object} config - The configuration object for travel images.
     * @returns {object} - A structured object with categories and image paths.
     */
    function generateTravelCategories(config) {
        const categories = {};
        for (const categoryName in config) {
            const categoryData = config[categoryName];
            categories[categoryName] = [];
            for (let i = 0; i < categoryData.count; i++) {
                // Generates filenames 'a.webp', 'b.webp', etc., based on image count.
                const fileName = String.fromCharCode(97 + i) + '.webp';
                const fullPath = categoryData.path + fileName;
                categories[categoryName].push({
                    thumb: fullPath,
                    full: fullPath
                });
            }
        }
        return categories;
    }

    // Main object holding all the content for the modals
    const modalContent = {
        profile: {
            html: `
                <div class="modal-profile-content">
                    <div class="enlarged-photo"></div>
                    <div class="profile-titles">
                        <h2>Morakat Lim</h2>
                        <ul>
                            <li>Engineer</li>
                            <li>Architectural Designer</li>
                            <li>Creative Developer</li>
                            <li>Real Estate Enthusiast</li>
                            <li>Designer</li>
                            <li>Traveler</li>
                        </ul>
                    </div>
                </div>`
        },
        engineering: {
            html: `
                <div class="modal-engineering-content">
                    <p class="engineering-description">
                        I have always enjoyed solving problems and designing solutions. This is one of the projects that taught me a lot as an engineer.
                        I was the software, firmware, network, and embedded systems engineer for this difficult project.
                        My team and I were assigned to design and produce a radar sensor from the ground up and provide it the functionality of measuring large and short distances.
                        This project is part of a larger project used by the industry company to develop new technology for airport scanners!
                    </p>
                    <div class="engineering-projects-container">
                        <div class="engineering-project">
                            <div class="engineering-image-container">
                                <img src="Projects/Engineering/Radar_Sensor/radar_sensor.jpg"
                                     data-full-src="Projects/Engineering/Radar_Sensor/radar_sensor.jpg"
                                     alt="Engineering Project 1"
                                     class="modal-clickable-image">
                            </div>
                            <a href="#engineering" class="engineering-title-link">Low-Cost Radar Sensor</a>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="#engineering" class="hero-cta">Go to Engineering Section</a>
                    </div>
                </div>`
        },
        engineeringProject1: {
            html: `<h2>Placeholder Project One</h2><p>Details for this project are coming soon. This section will feature in-depth information about the design process, technical specifications, and outcomes.</p>`
        },
        engineeringProject2: {
            html: `<h2>Placeholder Project Two</h2><p>Details for this project are coming soon. This section will feature in-depth information about the design process, technical specifications, and outcomes.</p>`
        },
        engineeringProject3: {
            html: `<h2>Placeholder Project Three</h2><p>Details for this project are coming soon. This section will feature in-depth information about the design process, technical specifications, and outcomes.</p>`
        },
        architecture: {
            html: `
                <div class="modal-architecture-content">
                    <div class="modal-featured-image-container">
                        <img src="Projects/Architecture/arch_showcase_1.webp" 
                             data-full-src="Projects/Architecture/arch_showcase_1.webp" 
                             alt="Featured architectural project" 
                             class="modal-featured-image">
                    </div>
                    <div class="architecture-project-details">
                        <h3 class="architecture-project-title">My Approach to Design</h3>
                    </div>
                    <div class="architecture-philosophy">
                        <h4>Design Philosophy</h4>
                        <p>
                            My design philosophy centers on human-centric and sustainable design. 
                            I believe that buildings should not only be aesthetically pleasing but also functional, environmentally responsible, and seamlessly integrated with their surroundings.
                        </p>
                    </div>
                    <div class="skills-container">
                        <h4>Tools & Technologies</h4>
                        <div class="skills-icons">
                            <div class="skill-item">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                                <p>SketchUp</p>
                            </div>
                            <div class="skill-item">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                                <p>SolidWorks</p>
                            </div>
                            <div class="skill-item">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                </svg>
                                <p>Ansys</p>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 40px;">
                        <a href="#architecture" class="hero-cta">Explore My Projects</a>
                    </div>
                </div>`
        },
        dreamHome: {
            html: generateArchitecturalStepsHTML(
                "Dream Home Design Process",
                "This project is a personal and ongoing exploration into creating a modern, sustainable living space. The design focuses on harmonizing with its natural surroundings, maximizing natural light, and integrating smart-home technology for a futuristic yet comfortable home."
            )
        },
        currentHome: {
            html: generateArchitecturalStepsHTML(
                "Current Home Design Process",
                "This conceptual exercise applies architectural principles to my current residence. The goal is to reimagine the space for better optimization, multi-functionality, and an enhanced quality of daily life, proving that good design can transform any environment."
            )
        },
        firmDesign: {
            html: generateArchitecturalStepsHTML(
                "E.A.R. Firm Design Process",
                "This is a conceptual design for the headquarters of an innovative Engineering, Architecture, and Real Estate (E.A.R.) firm. The building aims to reflect a spirit of collaboration, transparency, and forward-thinking by integrating all three disciplines under one roof."
            )
        },
        realestate: {
            title: 'Real Estate Ventures',
            text: 'I have a passion in real estate. This is directly tied to my interests and knowledge in architecture design. I hope to use my engineering and architectural design background to design and build my own home in the very near future! Check out some of my guides and findings below!',
            pdfSrc: 'Projects/Real_Estate/MA_Real_Estate_Salesperson_Guide_Master_Edition.pdf',
            expandedText: 'TBD'
        },
        raytheon: {
            html: `
                <div class="modal-raytheon-content">
                    <p class="raytheon-description">
                        I have had the awesome opportunity to work at Raytheon for over two years as a Systems Engineer and I have learned a lot!
                    </p>
                    <div class="raytheon-projects-container">
                        <div class="raytheon-project">
                            <svg class="raytheon-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2,10 L12,10 L12,20 L2,20 L2,10 Z"></path>
                                <path d="M12,10 L22,10 L22,20 L12,20"></path>
                                <path d="M2,10 L7,4 L17,4 L12,10"></path>
                                <path d="M17,4 L22,10"></path>
                                <circle cx="5" cy="21" r="1"></circle><circle cx="15" cy="21" r="1"></circle>
                            </svg>
                            <div class="raytheon-subtitles">
                                <p class="subtitle-role">LTAMDS / Systems Engineer</p>
                                <p class="subtitle-years">2023 - 2025 / 2 Years</p>
                            </div>
                        </div>
                        <div class="raytheon-project">
                            <svg class="raytheon-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2 L2 12 L12 22 L22 12 Z"></path>
                                <path d="M2 12 L12 22"></path>
                                <path d="M12 2 L12 22"></path>
                                <path d="M22 12 L12 22"></path>
                            </svg>
                            <div class="raytheon-subtitles">
                                <p class="subtitle-role">QWER / Systems Engineer</p>
                                <p class="subtitle-years">2025 - Current/ 2 Months</p>
                            </div>
                        </div>
                    </div>
                </div>`
        },
        travels: {
            title: 'Journeys and Inspirations',
            text: 'Exploring different cultures has profoundly influenced my perspective, creativity, and problem-solving skills. Below is a collection of moments from my travels.',
            categories: generateTravelCategories(travelImageConfig) // Use the generator function
        },
        photoshop: {
            title: 'Digital Artistry with Photoshop',
            text: 'I have a background in website designing and creative designing. The design shown is a banner that I have designed for a community on Discord. Interested in all of my works? Please reach out!',
            featuredImage: {
                thumb: 'Projects/Photoshop/Detoxpvm.jpg',
                full: 'Projects/Photoshop/Detoxpvm.jpg',
            },
            expandedText: 'I have been creative designing and programming ever since I was in highschool! Lots of designs tucked away, waiting to be showcased!'
        }
    };

    // --- Modal DOM Elements ---
    const modal = document.getElementById('project-modal');
    const modalContentArea = modal.querySelector('.modal-content-area');
    const closeModalBtn = modal.querySelector('.modal-close-btn');

    // --- Lightbox DOM Elements ---
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCloseBtn = document.querySelector('.lightbox-close');
    const lightboxPrevBtn = document.querySelector('.lightbox-prev');
    const lightboxNextBtn = document.querySelector('.lightbox-next');

    /**
     * Opens the modal window and populates it with content based on the provided key.
     * @param {string} key - The key corresponding to an entry in the modalContent object.
     */
    function openModal(key) {
        const content = modalContent[key];
        if (!content) return;

        let modalHTML = '';

        if (content.html) {
            // Use pre-defined HTML if available
            modalHTML = content.html;
        } else {
            // Build HTML from other content properties
            if (content.featuredImage) {
                modalHTML += `
                    <div class="modal-featured-image-container">
                        <img src="${content.featuredImage.thumb}"
                             data-full-src="${content.featuredImage.full}"
                             class="modal-featured-image"
                             alt="${content.title}">
                    </div>`;
            }

            modalHTML += `<h2>${content.title}</h2><p>${content.text}</p>`;

            if (key === 'travels' && content.categories) {
                for (const category in content.categories) {
                    modalHTML += `<h3 class="gallery-category-title">${category}</h3>`;
                    let galleryHTML = '<div class="modal-gallery-container">';
                    content.categories[category].forEach(image => {
                        galleryHTML += `<img src="${image.thumb}" data-full-src="${image.full}" alt="Travel photo from ${category}">`;
                    });
                    galleryHTML += '</div>';
                    modalHTML += galleryHTML;
                }
            } else if (content.pdfSrc) {
                modalHTML += `
                    <div class="pdf-container">
                        <iframe src="${content.pdfSrc}"></iframe>
                    </div>`;
            } else if (content.expandedText) {
                modalHTML += `
                    <div class="modal-expandable-content">
                        <p>${content.expandedText}</p>
                    </div>
                    <button class="modal-expand-btn" aria-label="Expand content" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 5v14M19 12l-7 7-7-7" />
                        </svg>
                    </button>`;
            }
        }

        modalContentArea.innerHTML = modalHTML;
        // Add the 'steps-collapsed' class by default to modals that have the toggle button
        const modalWindow = modal.querySelector('.modal-window');
        if (modalContentArea.querySelector('.modal-steps-toggle-btn')) {
            modalWindow.classList.add('steps-collapsed');
        }


        // Add event listener for the expand button
        const expandBtn = modalContentArea.querySelector('.modal-expand-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                expandBtn.closest('.modal-window').classList.toggle('expanded');
                const isExpanded = expandBtn.closest('.modal-window').classList.contains('expanded');
                expandBtn.setAttribute('aria-expanded', isExpanded);
            });
        }

        // Add event listener for the new steps toggle button
        const stepsToggleBtn = modalContentArea.querySelector('.modal-steps-toggle-btn');
        if (stepsToggleBtn) {
            stepsToggleBtn.addEventListener('click', () => {
                const modalWindow = stepsToggleBtn.closest('.modal-window');
                const isCollapsed = modalWindow.classList.toggle('steps-collapsed');
                stepsToggleBtn.setAttribute('aria-expanded', !isCollapsed);
                const btnText = stepsToggleBtn.querySelector('.toggle-text');
                btnText.textContent = isCollapsed ? 'Show Design Steps' : 'Hide Design Steps';
            });
        }

        body.classList.add('modal-open');
    }

    /**
     * Closes the main modal window and resets its state.
     */
    function closeModal() {
        body.classList.remove('modal-open');
        const modalWindow = modal.querySelector('.modal-window');
        // Reset any specific states on close
        if (modalWindow.classList.contains('expanded')) {
            modalWindow.classList.remove('expanded');
        }
        if (modalWindow.classList.contains('steps-collapsed')) {
            modalWindow.classList.remove('steps-collapsed');
        }
    }


    // ===================================================================
    // === LIGHTBOX LOGIC ================================================
    // ===================================================================

    /**
     * Displays an image in the lightbox based on its index in the current gallery.
     * @param {number} index - The index of the image to show.
     */
    function showImageAtIndex(index) {
        // Wrap around the gallery if index is out of bounds
        if (index < 0) {
            index = currentGalleryImages.length - 1;
        } else if (index >= currentGalleryImages.length) {
            index = 0;
        }
        currentImageIndex = index;
        const imageElement = currentGalleryImages[currentImageIndex];
        lightboxImage.src = imageElement.dataset.fullSrc;
    }

    /**
     * Opens the lightbox, determines if it's a gallery or single image, and displays it.
     * @param {Event} e - The click event.
     */
    function openLightbox(e) {
        const targetImage = e.target;

        // Handle clicks on gallery images
        if (targetImage.matches('.modal-gallery-container img')) {
            const gallery = targetImage.closest('.modal-gallery-container');
            currentGalleryImages = [...gallery.querySelectorAll('img')];
            const clickedIndex = currentGalleryImages.findIndex(img => img === targetImage);

            lightboxPrevBtn.style.display = 'flex';
            lightboxNextBtn.style.display = 'flex';
            lightboxOverlay.classList.add('visible');
            showImageAtIndex(clickedIndex);
        }
        // Handle clicks on single featured/engineering images
        else if (targetImage.matches('.modal-featured-image, .modal-clickable-image')) {
            const fullSrc = targetImage.dataset.fullSrc;
            if (fullSrc) {
                lightboxImage.src = fullSrc;
                lightboxPrevBtn.style.display = 'none';
                lightboxNextBtn.style.display = 'none';
                lightboxOverlay.classList.add('visible');
            }
        }
    }

    /**
     * Closes the lightbox and resets its state.
     */
    function closeLightbox() {
        lightboxOverlay.classList.remove('visible');
        currentGalleryImages = [];
        currentImageIndex = 0;
    }


    // ===================================================================
    // === EVENT LISTENERS ===============================================
    // ===================================================================

    // Delegated event listener for all modal triggers
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
        pageContent.addEventListener('click', (e) => {
            const clickableItem = e.target.closest('[data-modal-key]');
            if (clickableItem) {
                const modalKey = clickableItem.dataset.modalKey;
                openModal(modalKey);
            }
        });
    }

    // Listeners for closing the modal
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // Close if clicking on the overlay
    });

    // Listeners for the lightbox
    modalContentArea.addEventListener('click', openLightbox);
    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox(); // Close if clicking on the overlay
    });
    lightboxPrevBtn.addEventListener('click', () => showImageAtIndex(currentImageIndex - 1));
    lightboxNextBtn.addEventListener('click', () => showImageAtIndex(currentImageIndex + 1));

    // Special listener for links inside the modal that should close it and scroll to a section
    modalContentArea.addEventListener('click', (e) => {
        // Check if the clicked element or its ancestor is a link to a page section
        const sectionLink = e.target.closest('a[href^="#"]');

        if (sectionLink) {
            const href = sectionLink.getAttribute('href');
            // Ensure the link is not just a placeholder and the target element exists on the page
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault(); // Prevent the default anchor jump
                closeModal(); // Close the modal

                // Use a short timeout to allow the modal-close animation to start before scrolling
                setTimeout(() => {
                    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
                }, 150);
            }
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightboxOverlay.classList.contains('visible')) {
                closeLightbox();
            } else if (body.classList.contains('modal-open')) {
                closeModal();
            }
        }
    });

    // Smooth scrolling for all navigation-related links
    const allLinks = document.querySelectorAll('.hero-cta, .arrow, #top-nav a');
    allLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ===================================================================
    // === INTERSECTION OBSERVER (for section animations & nav highlighting) ===
    // ===================================================================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    let particlesInitialized = { hero: false };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetSection = entry.target;
                targetSection.classList.add('active');

                // Highlight the corresponding item in the top navigation
                const activeIndex = Array.from(sections).findIndex(sec => sec.id === targetSection.id);
                navItems.forEach((item, index) => {
                    item.classList.toggle('nav-active', index === activeIndex);
                });

                // Initialize particles only when the hero section becomes visible
                if (targetSection.id === 'hero' && !particlesInitialized.hero) {
                    initializeCosmicParticles();
                    particlesInitialized.hero = true;
                }
            } else {
                entry.target.classList.remove('active');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));


    // ===================================================================
    // === PARTICLE.JS INITIALIZATION ====================================
    // ===================================================================

    function initializeCosmicParticles() {
        if (typeof particlesJS === 'undefined') return;

        // Background particles (more numerous, smaller, slower)
        particlesJS('particles-js-cosmic-bg', {
            particles: {
                number: { value: 60 },
                color: { value: "#ffffff" },
                opacity: { value: 0.5, random: true },
                size: { value: 1, random: true },
                move: { enable: true, speed: 0.4 }
            }
        });

        // Foreground particles (fewer, larger, faster)
        particlesJS('particles-js-cosmic-fg', {
            particles: {
                number: { value: 20 },
                color: { value: "#ffffff" },
                size: { value: 2.5, random: true },
                line_linked: { enable: false },
                move: { enable: true, speed: 1 }
            },
            interactivity: { events: { onhover: { enable: false } } }
        });
    }


    // ===================================================================
    // === THREE.JS DYSON SPHERE INITIALIZATION ==========================
    // ===================================================================

    if (document.getElementById('sphere-container')) {
        // --- Setup ---
        const container = document.getElementById('sphere-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        camera.position.z = 12;

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // --- Main Group ---
        const dysonSphereGroup = new THREE.Group();
        dysonSphereGroup.position.x = 0;
        scene.add(dysonSphereGroup);

        // --- Sun & Glow ---
        const sunGeometry = new THREE.SphereGeometry(2.5, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffdd88,
            side: THREE.BackSide,
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        dysonSphereGroup.add(sun);

        const glowSpriteMaterial = new THREE.SpriteMaterial({
            map: createGlowTexture(),
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.9,
        });
        const glowSprite = new THREE.Sprite(glowSpriteMaterial);
        glowSprite.scale.set(8, 8, 1);
        glowSprite.renderOrder = -1;
        dysonSphereGroup.add(glowSprite);
        // NOTE: The line below was in the original code. It adds the same glow sprite a second time.
        // If this is unintentional, it can be removed.
        dysonSphereGroup.add(glowSprite);

        // --- Dyson Sphere Structure ---
        const dysonGeometry = new THREE.IcosahedronGeometry(5, 5);

        const panelMaterial = new THREE.MeshPhongMaterial({
            color: 0x9370DB, // Changed back to Purple
            shininess: 90,
            specular: 0xffffff,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        const dysonPanels = new THREE.Mesh(dysonGeometry, panelMaterial);
        dysonSphereGroup.add(dysonPanels);

        const wireframeGeom = new THREE.WireframeGeometry(dysonGeometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0xFFD700, // Kept as Gold
            linewidth: 1
        });
        const dysonWireframe = new THREE.LineSegments(wireframeGeom, wireframeMaterial);
        dysonSphereGroup.add(dysonWireframe);

        // --- Mouse Drag Controls ---
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            container.style.cursor = 'grabbing';
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            const rotateAngleX = deltaMove.y * 0.005;
            const rotateAngleY = deltaMove.x * 0.005;
            dysonSphereGroup.rotation.x += rotateAngleX;
            dysonSphereGroup.rotation.y += rotateAngleY;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        // --- Animation Loop ---
        function animate() {
            requestAnimationFrame(animate);
            // Constant rotation when not dragging
            if (!isDragging) {
                dysonSphereGroup.rotation.y += 0.0005;
            }
            // Sun pulsation effect
            const time = Date.now() * 0.0005;
            sun.scale.setScalar(Math.sin(time) * 0.05 + 1);
            renderer.render(scene, camera);
        }
        animate();

        // --- Responsive Resizing ---
        window.addEventListener('resize', () => {
            renderer.setSize(container.clientWidth, container.clientHeight);
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();

            // Adjust scale and opacity for different screen sizes
            if (window.innerWidth <= 900) {
                dysonSphereGroup.scale.set(0.6, 0.6, 0.6);
                glowSpriteMaterial.opacity = 0.5;
            } else {
                dysonSphereGroup.scale.set(1, 1, 1);
                glowSpriteMaterial.opacity = 0.9;
            }
        });

        // Trigger resize on load to set the initial state
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Generates a canvas texture for a glowing sphere.
     * @returns {THREE.CanvasTexture} - The generated texture.
    **/
    function createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0.2, 'rgba(255, 220, 130, 1.0)');
        gradient.addColorStop(1.0, 'rgba(255, 220, 130, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        return new THREE.CanvasTexture(canvas);
    }
});