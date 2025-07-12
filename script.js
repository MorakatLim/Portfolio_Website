// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Global State --- //
    let currentGalleryImages = [];
    let currentImageIndex = 0;
    let activeVivusInstances = [];

    const body = document.body;
    const sections = document.querySelectorAll('main#page-content section');

    // --- Initial Page Load Animation --- //
    const heroSection = document.getElementById('hero');
    setTimeout(() => {
        heroSection.classList.add('active');
    }, 100);

    // --- Dynamic Top Navigation --- //
    const topNavList = document.querySelector('#top-nav .nav-list');
    const navItems = [];
    sections.forEach((section) => {
        const sectionId = section.id;
        let sectionName = section.dataset.theme.replace(/-/g, ' ');
        sectionName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
        if (sectionId === 'hero') sectionName = 'Home';

        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${sectionId}`;
        link.textContent = sectionName;
        listItem.appendChild(link);
        topNavList.appendChild(listItem);
        navItems.push(listItem);
    });

    // --- Modal Content & Logic --- //

    /**
     * Generates HTML for the 7 steps of architectural design.
     * @param {string} title - The main title for the modal.
     * @param {string} summary - A short summary of the project.
     * @returns {string} - The complete HTML string for the modal content.
     */
    function generateArchitecturalStepsHTML(title, summary) {
        const steps = [
            "Schematic Design", "Design Development", "Construction Documents",
            "Bidding and Negotiation", "Construction Administration", "Substantial Completion",
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
                <div class="architectural-steps-container">`;

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
                </div>`;
        });

        modalHTML += `</div></div>`;
        return modalHTML;
    }

    const travelImageConfig = {
        'Cloudcroft': { path: "Projects/Travels/New_Mexico/Cloudcroft/images_webp/", count: 7 },
        'Pistachio Land': { path: "Projects/Travels/New_Mexico/Pistachio_Land/images_webp/", count: 3 },
        'National Space Museum': { path: "Projects/Travels/New_Mexico/Space_Museum/images_webp/", count: 7 },
        'Trails': { path: "Projects/Travels/New_Mexico/Trails/images_webp/", count: 8 },
        'White Sands National Park': { path: "Projects/Travels/New_Mexico/White_Sands/images_webp/", count: 24 }
    };

    function generateTravelCategories(config) {
        const categories = {};
        for (const categoryName in config) {
            const categoryData = config[categoryName];
            categories[categoryName] = [];
            for (let i = 0; i < categoryData.count; i++) {
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
        engineeringProject1: { html: `<h2>Placeholder Project One</h2><p>Details for this project are coming soon.</p>` },
        engineeringProject2: { html: `<h2>Placeholder Project Two</h2><p>Details for this project are coming soon.</p>` },
        engineeringProject3: { html: `<h2>Placeholder Project Three</h2><p>Details for this project are coming soon.</p>` },
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
                                <svg id="icon-skill-sketchup" class="animatable-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                                <p>SketchUp</p>
                            </div>
                            <div class="skill-item">
                                <svg id="icon-skill-solidworks" class="animatable-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                                <p>SolidWorks</p>
                            </div>
                            <div class="skill-item">
                                <svg id="icon-skill-ansys" class="animatable-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                </svg>
                                <p>Ansys</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="architecture-philosophy" style="margin-top: 20px;">
                         <h4>My Guides & Findings</h4>
                         <div class="pdf-container">
                            <iframe src="Projects/Architecture_Design/Architecture_&_Design.pdf"></iframe>
                         </div>
                    </div>

                    <div style="text-align: center; margin-top: 40px;">
                        <a href="#architecture" class="hero-cta">Explore My Projects</a>
                    </div>
                </div>`
        },
        dreamHome: { html: generateArchitecturalStepsHTML("Dream Home Design Process", "A personal exploration into creating a modern, sustainable living space.") },
        currentHome: { html: generateArchitecturalStepsHTML("Current Home Design Process", "Reimagining a current residence for better spatial optimization and quality of life.") },
        firmDesign: { html: generateArchitecturalStepsHTML("E.A.R. Firm Design Process", "A conceptual design for an innovative Engineering, Architecture, and Real Estate firm headquarters.") },
        realestate: {
            title: 'Real Estate Ventures',
            text: 'I have a passion in real estate, which directly ties to my interests in architecture. I hope to use my background to design and build my own home in the near future! Check out some of my guides and findings below!',
            pdfSrc: 'Projects/Real_Estate/MA_Real_Estate_Salesperson_Guide_Master_Edition.pdf'
        },
        raytheon: {
            html: `
                <div class="modal-raytheon-content">
                    <p class="raytheon-description">I have had the awesome opportunity to work at Raytheon for over two years as a Systems Engineer and I have learned a lot!</p>
                    <div class="raytheon-projects-container">
                        <div class="raytheon-project">
                            <svg id="icon-raytheon-ltamds" class="raytheon-icon animatable-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2,10 L12,10 L12,20 L2,20 L2,10 Z"></path><path d="M12,10 L22,10 L22,20 L12,20"></path><path d="M2,10 L7,4 L17,4 L12,10"></path><path d="M17,4 L22,10"></path><circle cx="5" cy="21" r="1"></circle><circle cx="15" cy="21" r="1"></circle>
                            </svg>
                            <p class="subtitle-role">LTAMDS / Systems Engineer</p>
                            <p class="subtitle-years">2023 - 2025 / 2 Years</p>
                        </div>
                        <div class="raytheon-project">
                            <svg id="icon-raytheon-qwer" class="raytheon-icon animatable-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2 L2 12 L12 22 L22 12 Z"></path><path d="M2 12 L12 22"></path><path d="M12 2 L12 22"></path><path d="M22 12 L12 22"></path>
                            </svg>
                            <p class="subtitle-role">QWER / Systems Engineer</p>
                            <p class="subtitle-years">2025 - Current/ 2 Months</p>
                        </div>
                    </div>
                </div>`
        },
        travels: {
            title: 'Journeys and Inspirations',
            text: 'Exploring different cultures has profoundly influenced my perspective, creativity, and problem-solving skills. Below is a collection of moments from my travels.',
            categories: generateTravelCategories(travelImageConfig)
        },
        photoshop: {
            title: 'Digital Artistry with Photoshop',
            text: 'I have a background in website designing and creative designing. The design shown is a banner that I have designed for a community on Discord. Interested in all of my works? Please reach out!',
            featuredImage: {
                thumb: 'Projects/Photoshop/Detoxpvm.jpg',
                full: 'Projects/Photoshop/Detoxpvm.jpg',
            }
        }
    };

    const modal = document.getElementById('project-modal');
    const modalContentArea = modal.querySelector('.modal-content-area');
    const closeModalBtn = modal.querySelector('.modal-close-btn');

    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCloseBtn = document.querySelector('.lightbox-close');
    const lightboxPrevBtn = document.querySelector('.lightbox-prev');
    const lightboxNextBtn = document.querySelector('.lightbox-next');

    function openModal(key) {
        const content = modalContent[key];
        if (!content) return;

        let modalHTML = '';

        if (content.html) {
            modalHTML = content.html;
        } else {
            if (content.featuredImage) {
                modalHTML += `
                    <div class="modal-featured-image-container">
                        <img src="${content.featuredImage.thumb}" data-full-src="${content.featuredImage.full}" class="modal-featured-image" alt="${content.title}">
                    </div>`;
            }
            modalHTML += `<h2>${content.title}</h2><p>${content.text}</p>`;

            if (key === 'travels' && content.categories) {
                for (const category in content.categories) {
                    modalHTML += `<h3 class="gallery-category-title">${category}</h3><div class="modal-gallery-container">`;
                    content.categories[category].forEach(image => {
                        modalHTML += `<img src="${image.thumb}" data-full-src="${image.full}" alt="Travel photo from ${category}">`;
                    });
                    modalHTML += '</div>';
                }
            } else if (content.pdfSrc) {
                modalHTML += `<div class="pdf-container"><iframe src="${content.pdfSrc}"></iframe></div>`;
            }
        }

        modalContentArea.innerHTML = modalHTML;
        const modalWindow = modal.querySelector('.modal-window');
        if (modalContentArea.querySelector('.modal-steps-toggle-btn')) {
            modalWindow.classList.add('steps-collapsed');
        }

        const stepsToggleBtn = modalContentArea.querySelector('.modal-steps-toggle-btn');
        if (stepsToggleBtn) {
            stepsToggleBtn.addEventListener('click', () => {
                const isCollapsed = modalWindow.classList.toggle('steps-collapsed');
                stepsToggleBtn.setAttribute('aria-expanded', !isCollapsed);
                stepsToggleBtn.querySelector('.toggle-text').textContent = isCollapsed ? 'Show Design Steps' : 'Hide Design Steps';
            });
        }

        if (typeof Vivus !== 'undefined') {
            const iconsToAnimate = modalContentArea.querySelectorAll('.animatable-icon');
            iconsToAnimate.forEach(icon => {
                activeVivusInstances.push(new Vivus(icon.id, { duration: 150, type: 'oneByOne' }));
            });
        }

        body.classList.add('modal-open');
    }

    function closeModal() {
        if (activeVivusInstances.length > 0) {
            activeVivusInstances.forEach(instance => instance.destroy());
            activeVivusInstances = [];
        }
        body.classList.remove('modal-open');
        modal.querySelector('.modal-window').classList.remove('steps-collapsed');
    }

    function showImageAtIndex(index) {
        if (index < 0) { index = currentGalleryImages.length - 1; }
        if (index >= currentGalleryImages.length) { index = 0; }
        currentImageIndex = index;
        lightboxImage.src = currentGalleryImages[currentImageIndex].dataset.fullSrc;
    }

    function openLightbox(e) {
        const targetImage = e.target;
        const isGalleryImage = targetImage.matches('.modal-gallery-container img');
        const isFeaturedImage = targetImage.matches('.modal-featured-image, .modal-clickable-image');

        if (isGalleryImage) {
            const gallery = targetImage.closest('.modal-gallery-container');
            currentGalleryImages = [...gallery.querySelectorAll('img')];
            const clickedIndex = currentGalleryImages.findIndex(img => img === targetImage);
            lightboxPrevBtn.style.display = 'flex';
            lightboxNextBtn.style.display = 'flex';
            lightboxOverlay.classList.add('visible');
            showImageAtIndex(clickedIndex);
        } else if (isFeaturedImage && targetImage.dataset.fullSrc) {
            lightboxImage.src = targetImage.dataset.fullSrc;
            lightboxPrevBtn.style.display = 'none';
            lightboxNextBtn.style.display = 'none';
            lightboxOverlay.classList.add('visible');
        }
    }

    function closeLightbox() {
        lightboxOverlay.classList.remove('visible');
    }

    // --- Event Listeners --- //
    document.getElementById('page-content').addEventListener('click', (e) => {
        const clickableItem = e.target.closest('[data-modal-key]');
        if (clickableItem) {
            openModal(clickableItem.dataset.modalKey);
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    modalContentArea.addEventListener('click', openLightbox);
    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', (e) => { if (e.target === lightboxOverlay) closeLightbox(); });
    lightboxPrevBtn.addEventListener('click', () => showImageAtIndex(currentImageIndex - 1));
    lightboxNextBtn.addEventListener('click', () => showImageAtIndex(currentImageIndex + 1));

    modalContentArea.addEventListener('click', (e) => {
        const sectionLink = e.target.closest('a[href^="#"]');
        if (sectionLink) {
            const href = sectionLink.getAttribute('href');
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                closeModal();
                setTimeout(() => {
                    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
                }, 150);
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightboxOverlay.classList.contains('visible')) {
                closeLightbox();
            } else if (body.classList.contains('modal-open')) {
                closeModal();
            }
        }
    });

    document.querySelectorAll('.hero-cta, .arrow, #top-nav a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Intersection Observer for Section Animations --- //
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const activeIndex = Array.from(sections).findIndex(sec => sec.id === entry.target.id);
                navItems.forEach((item, index) => {
                    item.classList.toggle('nav-active', index === activeIndex);
                });
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    sections.forEach(section => sectionObserver.observe(section));

    // --- 3D Tilt Effect for Cards --- //
    document.querySelectorAll('.project-box, .engineering-project-card, .architecture-project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y / height - 0.5) * -15;
            const rotateY = (x / width - 0.5) * 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- SVG Icon Animations --- //
    const iconGrid = document.querySelector('.projects-grid');
    if (iconGrid && typeof Vivus !== 'undefined') {
        const vivusInstances = [];
        const iconIds = ['icon-engineering', 'icon-architecture', 'icon-realestate', 'icon-raytheon', 'icon-travels', 'icon-photoshop'];
        iconIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                vivusInstances.push(new Vivus(id, { duration: 120, start: 'manual', type: 'oneByOne' }));
            }
        });
        const iconObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    vivusInstances.forEach(instance => instance.play());
                } else {
                    vivusInstances.forEach(instance => instance.reset());
                }
            });
        }, { threshold: 0.5 });
        iconObserver.observe(iconGrid);
    }

    // --- Contact Icon Animation --- //
    const contactIcon = document.getElementById('icon-contact');
    if (contactIcon && typeof Vivus !== 'undefined') {
        const contactVivus = new Vivus('icon-contact', {
            duration: 150,
            start: 'manual',
            type: 'oneByOne'
        });
        const contactIconObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // When the icon is visible, play the animation.
                    contactVivus.play();
                } else {
                    // When the icon is not visible, reset it for next time.
                    contactVivus.reset();
                }
            });
        }, { threshold: 0.8 });
        contactIconObserver.observe(contactIcon);
    }

    // --- Digital Blueprint Background --- //
    const blueprintCanvas = document.getElementById('blueprint-background');
    if (blueprintCanvas) {
        const ctx = blueprintCanvas.getContext('2d');
        let lines = [];
        const gridSize = 40;

        const setupCanvas = () => {
            blueprintCanvas.width = window.innerWidth;
            blueprintCanvas.height = window.innerHeight;
        };
        window.addEventListener('resize', setupCanvas);

        class Line {
            constructor() {
                this.path = [];
                this.progress = 0;
                this.totalLength = 0;
                this.tailLength = 250; // The visible length of the light streak.

                let currentX = Math.floor(Math.random() * (blueprintCanvas.width / gridSize)) * gridSize;
                let currentY = Math.floor(Math.random() * (blueprintCanvas.height / gridSize)) * gridSize;
                this.path.push({ x: currentX, y: currentY });

                const segmentCount = 6 + Math.floor(Math.random() * 5);
                let direction = Math.random() > 0.5 ? 'h' : 'v';

                for (let i = 0; i < segmentCount; i++) {
                    let nextX, nextY;
                    if (direction === 'h') {
                        nextX = Math.floor(Math.random() * (blueprintCanvas.width / gridSize)) * gridSize;
                        nextY = currentY;
                    } else {
                        nextX = currentX;
                        nextY = Math.floor(Math.random() * (blueprintCanvas.height / gridSize)) * gridSize;
                    }
                    this.totalLength += Math.abs(nextX - currentX) + Math.abs(nextY - currentY);
                    this.path.push({ x: nextX, y: nextY });
                    currentX = nextX;
                    currentY = nextY;
                    direction = (direction === 'h') ? 'v' : 'h';
                }
            }
            update() {
                this.progress += 3;
            }
            draw() {
                ctx.beginPath();
                let cumulativeLength = 0;
                const head = this.progress;
                const tail = head - this.tailLength;

                for (let i = 0; i < this.path.length - 1; i++) {
                    const p1 = this.path[i];
                    const p2 = this.path[i + 1];
                    const segmentLength = Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
                    const startOfSegmentDist = cumulativeLength;
                    const endOfSegmentDist = cumulativeLength + segmentLength;
                    const visibleStartDist = Math.max(startOfSegmentDist, tail);
                    const visibleEndDist = Math.min(endOfSegmentDist, head);

                    if (visibleStartDist < visibleEndDist) {
                        const startFraction = (visibleStartDist - startOfSegmentDist) / segmentLength;
                        const endFraction = (visibleEndDist - startOfSegmentDist) / segmentLength;
                        const startPoint = {
                            x: p1.x + (p2.x - p1.x) * startFraction,
                            y: p1.y + (p2.y - p1.y) * startFraction
                        };
                        const endPoint = {
                            x: p1.x + (p2.x - p1.x) * endFraction,
                            y: p1.y + (p2.y - p1.y) * endFraction
                        };
                        const gradient = ctx.createLinearGradient(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
                        const color = '0, 191, 255';
                        const opacityAtStart = (visibleStartDist - tail) / this.tailLength;
                        const opacityAtEnd = (visibleEndDist - tail) / this.tailLength;

                        gradient.addColorStop(0, `rgba(${color}, ${opacityAtStart * 1.5})`);
                        gradient.addColorStop(1, `rgba(${color}, ${opacityAtEnd * 1.5})`);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 1.5;
                        ctx.moveTo(startPoint.x, startPoint.y);
                        ctx.lineTo(endPoint.x, endPoint.y);
                    }
                    cumulativeLength += segmentLength;
                }
                ctx.stroke();
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, blueprintCanvas.width, blueprintCanvas.height);
            if (lines.length < 15 && Math.random() < 0.05) {
                lines.push(new Line());
            }
            lines = lines.filter(line => {
                line.update();
                line.draw();
                return (line.progress - line.tailLength) < line.totalLength;
            });
            requestAnimationFrame(animate);
        };
        
        setupCanvas();
        animate();
    }
});