/**
 * Md. Nashid Mahim | Portfolio Interactive Engine
 * Inspired by Simone Dark & Refined with Senior UX Micro-Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. Typed Text Animation Loop (Hero Section)
     ========================================================================== */
  const roles = [
    "Software Developer.",
    "Backend Specialist.",
    "MERN Stack Builder.",
    "CS Undergrad @ BRAC University.",
    "Problem Solver.",
  ];

  const typedTextEl = document.getElementById("typed-text");
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function typeRole() {
    if (!typedTextEl) return;
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1600; // Pause when full word is typed
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 350; // Pause before typing next word
    }

    setTimeout(typeRole, typingSpeed);
  }

  typeRole();

  /* ==========================================================================
     2. Top Scroll Progress Bar & Scroll Spy Navigation
     ========================================================================== */
  const scrollProgressBar = document.getElementById("scroll-progress");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTopBtn = document.getElementById("back-to-top");

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Scroll reading progress
    if (scrollProgressBar && docHeight > 0) {
      const progressPercent = (scrollY / docHeight) * 100;
      scrollProgressBar.style.width = `${Math.min(progressPercent, 100)}%`;
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 380) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    // If photography view is active, highlight only Photography nav link
    const photoView = document.getElementById("photography-view");
    if (photoView && photoView.classList.contains("active")) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#photography");
      });
      return;
    }

    // Scroll Spy: identify active section inside front-page-view only
    const frontSections = document.querySelectorAll("#front-page-view section[id]");
    let currentSectionId = "home";
    frontSections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ==========================================================================
     3. Mobile Navigation Drawer Toggle & View-Aware Link Handling
     ========================================================================== */
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const drawerBackdrop = document.getElementById("drawer-backdrop");

  function toggleDrawer(isOpen) {
    if (isOpen) {
      document.body.classList.add("drawer-open");
      mobileMenuBtn?.setAttribute("aria-expanded", "true");
    } else {
      document.body.classList.remove("drawer-open");
      mobileMenuBtn?.setAttribute("aria-expanded", "false");
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = document.body.classList.contains("drawer-open");
      toggleDrawer(!isOpen);
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", () => {
      toggleDrawer(false);
    });
  }

  // Handle navigation link clicks with view transition support
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#photography") {
        e.preventDefault();
        transitionToView("photography");
      } else if (href && href.startsWith("#")) {
        const photoView = document.getElementById("photography-view");
        if (photoView && photoView.classList.contains("active")) {
          e.preventDefault();
          const targetId = href.substring(1);
          transitionToView("portfolio", targetId);
        }
      }
      if (window.innerWidth < 992) {
        toggleDrawer(false);
      }
    });
  });

  /* ==========================================================================
     4. Number Stat Counters (Intersection Observer)
     ========================================================================== */
  const counterElements = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = parseFloat(entry.target.getAttribute("data-target"));
        const decimals = parseInt(entry.target.getAttribute("data-decimals") || "0", 10);
        let current = 0;
        const duration = 1400; // ms
        const steps = 45;
        const increment = target / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString();
        }, stepTime);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach((el) => counterObserver.observe(el));

  /* ==========================================================================
     5. Animated Skill Bars (Intersection Observer)
     ========================================================================== */
  const skillFills = document.querySelectorAll(".skill-progress-fill");
  const skillsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const targetWidth = entry.target.getAttribute("data-progress");
        entry.target.style.width = targetWidth;
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  skillFills.forEach((fill) => skillsObserver.observe(fill));

  /* ==========================================================================
     6. Portfolio Filtering
     ========================================================================== */
  const filterTabs = document.querySelectorAll(".filter-tab");
  const portfolioCards = document.querySelectorAll(".portfolio-card");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const filterVal = tab.getAttribute("data-filter");

      portfolioCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterVal === "all" || category === filterVal) {
          card.classList.add("show");
        } else {
          card.classList.remove("show");
        }
      });
    });
  });

  /* ==========================================================================
     7. Case Study Data Store & Interactive Modal
     ========================================================================== */
  const projectsData = {
    marketplace: {
      title: "University Marketplace for Secondhand Products",
      category: "Full-Stack Web (MERN)",
      techStack: "React.js · Node.js · Express.js · MongoDB · REST APIs · Git",
      image: "assets/projects/marketplace.svg",
      github: "https://github.com/mahim-13-08/University-Marketplace-for-Secondhand-Products",
      contentHtml: `
        <h4>Project Overview</h4>
        <p>
          University Marketplace is a full-stack campus web platform created to solve a widespread student friction point: safely and affordably exchanging used textbooks, laboratory components, and electronics within the university community.
        </p>

        <h4>Engineering Approach &amp; Key Features</h4>
        <ul>
          <li><strong>RESTful API Architecture:</strong> Developed modular Express.js routes for user authentication, product listings, category sorting, search queries, and real-time product availability states.</li>
          <li><strong>Persistent Storage &amp; Data Modeling:</strong> Designed normalized document schemas in MongoDB for products, user profiles, transactional tags, and seller ratings.</li>
          <li><strong>Responsive React Client:</strong> Designed an intuitive, component-driven user interface featuring instant client-side filtering, category pills, and responsive layout for mobile and desktop screens.</li>
          <li><strong>Version Control Discipline:</strong> Managed ongoing feature development using structured Git branches, clean commit messages, and GitHub pull requests.</li>
        </ul>

        <h4>Key Tech Takeaways</h4>
        <p>
          Mastered end-to-end full-stack integration, stateless JWT session protection, error handling middleware, and asynchronous data fetching in modern React.
        </p>
      `,
    },
    travel: {
      title: "Travel Management System",
      category: "Web Application",
      techStack: "PHP · MySQL · HTML5 · CSS3 · JavaScript",
      image: "assets/projects/travel.svg",
      github: "https://github.com/mahim-13-08/CSE370-Database_Systems_Project",
      contentHtml: `
        <h4>Project Overview</h4>
        <p>
          A comprehensive web-based travel management platform engineered for tour agencies and travelers to manage package discovery, booking reservations, client itineraries, and backend administration workflows.
        </p>

        <h4>Engineering Approach &amp; Key Features</h4>
        <ul>
          <li><strong>Relational Database Schemas:</strong> Architected relational tables in MySQL (packages, bookings, customers, billing logs) enforcing foreign key constraints and referential data integrity.</li>
          <li><strong>CRUD &amp; Business Logic:</strong> Developed comprehensive Create-Read-Update-Delete modules for travel package configuration, automated price calculations, and customer status updates.</li>
          <li><strong>User Authentication &amp; Sessions:</strong> Implemented secure PHP session handling and role-based permissions separating regular travelers from administrative operators.</li>
          <li><strong>Interface &amp; Usability:</strong> Crafted clean client-side booking flows with JavaScript form validations and status indicators.</li>
        </ul>

        <h4>Key Tech Takeaways</h4>
        <p>
          Solidified server-side PHP programming, SQL query optimization, database transaction management, and protection against common web vulnerabilities (SQL injection, XSS).
        </p>
      `,
    },
    hospital: {
      title: "Hospital Management System",
      category: "Desktop Application (Java)",
      techStack: "Java · MySQL · JDBC · Object-Oriented Programming (OOP)",
      image: "assets/projects/hospital.svg",
      github: "https://github.com/mahim-13-08/Hospital-Management-System",
      contentHtml: `
        <h4>Project Overview</h4>
        <p>
          A desktop enterprise application designed to streamline healthcare administration by centralizing inpatient records, physician schedules, appointment queues, and department operations.
        </p>

        <h4>Engineering Approach &amp; Key Features</h4>
        <ul>
          <li><strong>Object-Oriented Design Principles:</strong> Applied core OOP concepts (Encapsulation, Polymorphism, Inheritance, Abstraction) to model real-world clinical entities like Doctors, Patients, Appointments, and Medical Records.</li>
          <li><strong>Database Connectivity (JDBC):</strong> Implemented reliable persistence layer connecting the Java client to a local MySQL instance using prepared statements and connection pooling.</li>
          <li><strong>Administrative Workflows:</strong> Created user workflows for admitting patients, generating visit receipts, scheduling doctor consultations, and querying patient medical history.</li>
          <li><strong>Modular Software Structure:</strong> Structured the codebase into clean separation of concerns: UI views, business controllers, and data access objects (DAO pattern).</li>
        </ul>

        <h4>Key Tech Takeaways</h4>
        <p>
          Deepened understanding of Java memory management, desktop event dispatching, OOP design patterns, and enterprise database communication.
        </p>
      `,
    },
    "arrow-shooter": {
      title: "3D Arrow Shooter",
      category: "Computer Graphics & Systems",
      techStack: "C++ · OpenGL · GLFW · GLAD · 3D Coordinate Math",
      image: "assets/projects/arrow-shooter.svg",
      github: "https://github.com/mahim-13-08/3D-Arrow-Shooter",
      contentHtml: `
        <h4>Project Overview</h4>
        <p>
          An interactive 3D graphics game developed in C++ and OpenGL. Built to apply academic computer graphics theory into a real-time playable simulation featuring camera navigation, target rendering, and projectile physics.
        </p>

        <h4>Engineering Approach &amp; Key Features</h4>
        <ul>
          <li><strong>3D Camera System:</strong> Implemented free-look camera movement (Euler angles: yaw, pitch, roll) and perspective projection matrices using linear algebra.</li>
          <li><strong>Collision Detection Math:</strong> Implemented Axis-Aligned Bounding Box (AABB) and ray-sphere intersection algorithms to calculate real-time arrow hit detection.</li>
          <li><strong>Graphics Pipeline &amp; Transformations:</strong> Handled Model-View-Projection (MVP) matrix mathematics, vertex buffer objects (VBOs), vertex array objects (VAOs), and custom shaders.</li>
          <li><strong>Interactive Gameplay Mechanics:</strong> Programmed arrow draw force, ballistic trajectory physics with gravitational deceleration, and target hit feedback.</li>
        </ul>

        <h4>Key Tech Takeaways</h4>
        <p>
          Bridged theoretical computer graphics with practical systems programming, low-level memory handling, real-time render loops, and performance profiling.
        </p>
      `,
    },
  };

  const projectModal = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalCloseFooterBtn = document.getElementById("modal-close-footer-btn");
  const modalCategory = document.getElementById("modal-category");
  const modalTitle = document.getElementById("modal-title");
  const modalTech = document.getElementById("modal-tech");
  const modalImage = document.getElementById("modal-image");
  const modalHtmlDesc = document.getElementById("modal-html-desc");
  const modalGithubBtn = document.getElementById("modal-github-btn");

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModal) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalTech.textContent = data.techStack;
    modalImage.src = data.image;
    modalImage.alt = `${data.title} preview`;
    modalHtmlDesc.innerHTML = data.contentHtml;
    modalGithubBtn.href = data.github;

    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove("open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Open modal on case study buttons or media click
  document.querySelectorAll(".open-modal-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      openProjectModal(id);
    });
  });

  document.querySelectorAll(".portfolio-media").forEach((media) => {
    media.addEventListener("click", () => {
      const parentCard = media.closest(".portfolio-card");
      if (parentCard) {
        const id = parentCard.getAttribute("data-id");
        openProjectModal(id);
      }
    });
  });

  modalCloseBtn?.addEventListener("click", closeProjectModal);
  modalCloseFooterBtn?.addEventListener("click", closeProjectModal);

  projectModal?.addEventListener("click", (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && projectModal?.classList.contains("open")) {
      closeProjectModal();
    }
  });

  /* ==========================================================================
     8. Toast Notification Utility & Copy Email
     ========================================================================== */
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  let toastTimeout;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  const copyEmailBtn = document.getElementById("btn-copy-email");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      const email = copyEmailBtn.getAttribute("data-clipboard") || "mahimnashid@gmail.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied to clipboard: ${email}`);
        }).catch(() => {
          showToast(`Email: ${email}`);
        });
      } else {
        showToast(`Email: ${email}`);
      }
    });
  }

  /* ==========================================================================
     9. Contact Form Handling
     ========================================================================== */
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim() || `Portfolio inquiry from ${name}`;
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = "form-status error";
          formStatus.textContent = "Please fill in all required fields.";
        }
        return;
      }

      // Generate direct Gmail composer link (no Outlook application popups)
      const bodyContent = `Hi Nashid,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=mahimnashid@gmail.com&su=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(bodyContent)}`;

      if (formStatus) {
        formStatus.className = "form-status success";
        formStatus.textContent = "Opening Gmail composer...";
      }

      showToast("Opening Gmail composer...");
      setTimeout(() => {
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
      }, 400);
    });
  }

  /* ==========================================================================
     10. Theme Color Switcher Widget (Simone Signature Improvisation)
     ========================================================================== */
  const switcherWidget = document.getElementById("color-switcher-widget");
  const switcherToggleBtn = document.getElementById("switcher-toggle-btn");
  const colorOptionBtns = document.querySelectorAll(".color-option-btn");

  if (switcherToggleBtn && switcherWidget) {
    switcherToggleBtn.addEventListener("click", () => {
      switcherWidget.classList.toggle("open");
    });

    // Close switcher if clicked outside
    document.addEventListener("click", (e) => {
      if (!switcherWidget.contains(e.target)) {
        switcherWidget.classList.remove("open");
      }
    });
  }

  // Predefined color presets with corresponding dark tints
  const colorMap = {
    "#20c997": { hover: "#1baa80", rgb: "32, 201, 151" },
    "#00b4d8": { hover: "#0096c7", rgb: "0, 180, 216" },
    "#10b981": { hover: "#059669", rgb: "16, 185, 129" },
    "#f59e0b": { hover: "#d97706", rgb: "245, 158, 11" },
    "#8b5cf6": { hover: "#7c3aed", rgb: "139, 92, 246" },
    "#ef4444": { hover: "#dc2626", rgb: "239, 68, 68" },
  };

  function applyThemeColor(colorHex) {
    const config = colorMap[colorHex] || colorMap["#20c997"];
    document.documentElement.style.setProperty("--accent", colorHex);
    document.documentElement.style.setProperty("--accent-hover", config.hover);
    document.documentElement.style.setProperty("--accent-rgb", config.rgb);
    document.documentElement.style.setProperty("--accent-dim", `rgba(${config.rgb}, 0.12)`);
    document.documentElement.style.setProperty("--accent-glow", `rgba(${config.rgb}, 0.28)`);

    colorOptionBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-color") === colorHex);
    });

    localStorage.setItem("simone_accent_color", colorHex);
  }

  colorOptionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      applyThemeColor(color);
      showToast("Theme accent updated!");
    });
  });

  // Restore saved accent color
  const savedColor = localStorage.getItem("simone_accent_color");
  if (savedColor && colorMap[savedColor]) {
    applyThemeColor(savedColor);
  }

  /* ==========================================================================
     11. Photography Gallery & Google Apps Script Synchronization Engine
     ========================================================================== */
  const PHOTOGRAPHY_CONFIG = {
    folderId: "1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF",
    folderUrl:
      "https://drive.google.com/drive/folders/1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF?dmr=1&ec=wgc-drive-%5Bmodule%5D-goto",
    // Prioritize localStorage URL if previously configured in browser, else empty default
    appsScriptUrl: localStorage.getItem("simone_photo_gas_url") || "",
    // Fallback preview collection curated from Nashid's captured frames
    samplePhotos: [
      {
        id: "autumn-sky",
        title: "Autumn Sky at Residential Campus",
        date: "2023-09-22",
        sizeFormatted: "2.1 MB",
        thumbnailUrl: "assets/photography/autumn-sky.jpg",
        previewUrl: "assets/photography/autumn-sky.jpg",
        directUrl: "assets/photography/autumn-sky.jpg",
        driveViewUrl:
          "https://drive.google.com/drive/folders/1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF?dmr=1&ec=wgc-drive-%5Bmodule%5D-goto",
      },
      {
        id: "campus-arch",
        title: "TARC Architecture & Geometry",
        date: "2023-09-24",
        sizeFormatted: "1.8 MB",
        thumbnailUrl: "assets/photography/campus-arch.jpg",
        previewUrl: "assets/photography/campus-arch.jpg",
        directUrl: "assets/photography/campus-arch.jpg",
        driveViewUrl:
          "https://drive.google.com/drive/folders/1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF?dmr=1&ec=wgc-drive-%5Bmodule%5D-goto",
      },
      {
        id: "sunrise-vista",
        title: "Golden Hour Horizon Vista",
        date: "2023-09-24",
        sizeFormatted: "1.7 MB",
        thumbnailUrl: "assets/photography/sunrise-vista.jpg",
        previewUrl: "assets/photography/sunrise-vista.jpg",
        directUrl: "assets/photography/sunrise-vista.jpg",
        driveViewUrl:
          "https://drive.google.com/drive/folders/1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF?dmr=1&ec=wgc-drive-%5Bmodule%5D-goto",
      },
      {
        id: "rain-drops",
        title: "Monsoon Droplets & Greenery",
        date: "2022-07-26",
        sizeFormatted: "1.7 MB",
        thumbnailUrl: "assets/photography/rain-drops.jpg",
        previewUrl: "assets/photography/rain-drops.jpg",
        directUrl: "assets/photography/rain-drops.jpg",
        driveViewUrl:
          "https://drive.google.com/drive/folders/1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF?dmr=1&ec=wgc-drive-%5Bmodule%5D-goto",
      },
    ],
  };

  const GAS_CODE_TEMPLATE = `// Google Apps Script: Portfolio Drive Photo Gallery API
function doGet(e) {
  var folderId = "1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF";
  if (e && e.parameter && e.parameter.folderId) {
    folderId = e.parameter.folderId;
  }
  try {
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();
    var photos = [];
    var imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

    while (files.hasNext()) {
      var file = files.next();
      var mime = file.getMimeType().toLowerCase();
      if (imageTypes.indexOf(mime) !== -1 || mime.indexOf("image/") === 0) {
        var id = file.getId();
        var rawName = file.getName();
        var title = rawName.replace(/\\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        photos.push({
          id: id,
          title: title,
          fileName: rawName,
          date: Utilities.formatDate(file.getDateCreated(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
          sizeFormatted: (file.getSize() / (1024 * 1024)).toFixed(1) + " MB",
          thumbnailUrl: "https://drive.google.com/thumbnail?id=" + id + "&sz=w600",
          previewUrl: "https://drive.google.com/thumbnail?id=" + id + "&sz=w1600",
          directUrl: "https://lh3.googleusercontent.com/d/" + id,
          driveViewUrl: "https://drive.google.com/file/d/" + id + "/view?usp=sharing"
        });
      }
    }
    photos.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      totalPhotos: photos.length,
      photos: photos
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  let currentPhotosList = [];
  let activeLightboxIndex = 0;

  const photosGrid = document.getElementById("photos-grid");
  const syncStatusText = document.getElementById("sync-status-text");
  const refreshPhotosBtn = document.getElementById("btn-refresh-photos");
  const refreshSpinIcon = document.getElementById("refresh-spin-icon");
  const photosStatusMsg = document.getElementById("photos-status-message");

  // Lightbox Modal DOM Elements
  const photoLightboxModal = document.getElementById("photo-lightbox-modal");
  const lightboxBackdrop = document.getElementById("lightbox-backdrop");
  const lightboxCloseBtn = document.getElementById("lightbox-close-btn");
  const lightboxPrevBtn = document.getElementById("lightbox-prev-btn");
  const lightboxNextBtn = document.getElementById("lightbox-next-btn");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxLoader = document.getElementById("lightbox-loader");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDate = document.getElementById("lightbox-date");
  const lightboxSize = document.getElementById("lightbox-size");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxDriveBtn = document.getElementById("lightbox-drive-btn");
  const lightboxDownloadBtn = document.getElementById("lightbox-download-btn");

  // Google Apps Script Setup Modal DOM Elements
  const gasSetupModal = document.getElementById("gas-setup-modal");
  const btnOpenGasSetup = document.getElementById("btn-open-gas-setup");
  const gasModalCloseBtn = document.getElementById("gas-modal-close-btn");
  const gasModalCloseFooterBtn = document.getElementById("gas-modal-close-footer-btn");
  const btnCopyGasCode = document.getElementById("btn-copy-gas-code");
  const gasEndpointInput = document.getElementById("gas-endpoint-url");
  const btnSaveGasUrl = document.getElementById("btn-save-gas-url");
  const gasTestFeedback = document.getElementById("gas-test-feedback");

  /**
   * Render skeleton cards for loading feedback
   */
  function renderPhotoSkeletons(count = 4) {
    if (!photosGrid) return;
    photosGrid.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "photo-skeleton";
      photosGrid.appendChild(skeleton);
    }
  }

  /**
   * Render gallery grid cards
   */
  function renderPhotoCards(photos) {
    if (!photosGrid) return;
    photosGrid.innerHTML = "";

    if (!photos || photos.length === 0) {
      photosGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <p>No photos found in Google Drive folder.</p>
        </div>
      `;
      return;
    }

    const photoCountVal = document.getElementById("photo-count-val");
    if (photoCountVal) {
      photoCountVal.textContent = `${photos.length} Captures`;
    }

    photos.forEach((photo, idx) => {
      const card = document.createElement("article");
      card.className = "photo-card";
      card.setAttribute("data-index", idx.toString());
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `View photo: ${photo.title}`);

      card.innerHTML = `
        <div class="photo-media">
          <img
            src="${photo.thumbnailUrl}"
            alt="${photo.title}"
            class="photo-thumbnail"
            loading="lazy"
          />
          <div class="photo-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>${photo.date || "Capture"}</span>
          </div>
          <div class="photo-overlay">
            <div class="photo-overlay-content">
              <h4 class="photo-overlay-title">${photo.title}</h4>
              <div class="photo-overlay-meta">
                <span>${photo.sizeFormatted || "HD Image"}</span>
              </div>
              <div class="photo-overlay-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
                <span>View Fullscreen</span>
              </div>
            </div>
          </div>
        </div>
      `;

      card.addEventListener("click", () => openPhotoLightbox(idx));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPhotoLightbox(idx);
        }
      });

      photosGrid.appendChild(card);
    });
  }

  /**
   * Fetch photos from Google Apps Script endpoint or fallback gracefully
   */
  async function loadPhotographyGallery(forceRefresh = false) {
    const endpoint = PHOTOGRAPHY_CONFIG.appsScriptUrl.trim();

    if (refreshSpinIcon) {
      refreshSpinIcon.classList.add("spinning");
    }

    if (endpoint) {
      renderPhotoSkeletons(4);
      if (syncStatusText) syncStatusText.textContent = "Connecting to Google Drive...";

      try {
        const fetchUrl = forceRefresh
          ? `${endpoint}${endpoint.includes("?") ? "&" : "?"}_t=${Date.now()}`
          : endpoint;

        const response = await fetch(fetchUrl, { redirect: "follow" });
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.photos) && data.photos.length > 0) {
          currentPhotosList = data.photos;
          renderPhotoCards(currentPhotosList);
          if (syncStatusText) {
            syncStatusText.textContent = `Drive Synced: ${data.totalPhotos || data.photos.length} Photos`;
          }
          if (photosStatusMsg) {
            photosStatusMsg.classList.add("hidden");
          }
          if (forceRefresh) showToast("Synchronized with Google Drive!");
        } else {
          throw new Error(data.message || "No photos returned from Google Apps Script.");
        }
      } catch (err) {
        console.warn("Google Apps Script Fetch Warning:", err);
        // Fallback to sample photos
        currentPhotosList = PHOTOGRAPHY_CONFIG.samplePhotos;
        renderPhotoCards(currentPhotosList);
        if (syncStatusText) {
          syncStatusText.textContent = "Connected: Offline Previews";
        }
        if (photosStatusMsg) {
          photosStatusMsg.classList.remove("hidden");
          photosStatusMsg.innerHTML = `
            <p>
              <strong>Notice:</strong> Unable to reach Google Apps Script Web App (<code>${err.message}</code>).
              Showing local preview photos. Click <button type="button" class="btn btn-outline btn-xs rounded-pill" id="status-open-setup-btn" style="margin-left:0.4rem">Settings ⚙️</button> to verify your Web App URL.
            </p>
          `;
          document.getElementById("status-open-setup-btn")?.addEventListener("click", openGasSetupModal);
        }
      } finally {
        if (refreshSpinIcon) {
          refreshSpinIcon.classList.remove("spinning");
        }
      }
    } else {
      // No endpoint configured yet: show sample preview and friendly connection prompt
      currentPhotosList = PHOTOGRAPHY_CONFIG.samplePhotos;
      renderPhotoCards(currentPhotosList);
      if (syncStatusText) {
        syncStatusText.textContent = "Drive Folder Linked";
      }
      if (photosStatusMsg) {
        photosStatusMsg.classList.remove("hidden");
        photosStatusMsg.innerHTML = `
          <p>
            Showing preview captures. To synchronize photos live directly from Google Drive folder <code>1MIkWgMCOyWRmrgu9IfoxapVc5kayo7HF</code>, deploy Google Apps Script and
            <button type="button" class="btn btn-outline btn-xs rounded-pill" id="status-open-setup-btn" style="margin-left:0.4rem; vertical-align:middle;">Connect Web App URL ⚡</button>
          </p>
        `;
        document.getElementById("status-open-setup-btn")?.addEventListener("click", openGasSetupModal);
      }
      if (refreshSpinIcon) {
        refreshSpinIcon.classList.remove("spinning");
      }
    }
  }

  /**
   * Lightbox Modal Functions
   */
  function openPhotoLightbox(index) {
    if (!currentPhotosList || currentPhotosList.length === 0) return;
    if (index < 0 || index >= currentPhotosList.length) return;

    activeLightboxIndex = index;
    const photo = currentPhotosList[index];

    if (lightboxTitle) lightboxTitle.textContent = photo.title;
    if (lightboxDate) lightboxDate.textContent = photo.date || "Capture";
    if (lightboxSize) lightboxSize.textContent = photo.sizeFormatted || "HD";
    if (lightboxCounter) {
      lightboxCounter.textContent = `${index + 1} of ${currentPhotosList.length}`;
    }

    if (lightboxDriveBtn) {
      lightboxDriveBtn.href = photo.driveViewUrl || PHOTOGRAPHY_CONFIG.folderUrl;
    }
    if (lightboxDownloadBtn) {
      lightboxDownloadBtn.href = photo.previewUrl || photo.directUrl || photo.thumbnailUrl;
    }

    if (lightboxLoader) lightboxLoader.classList.add("active");
    if (lightboxImg) {
      lightboxImg.style.opacity = "0";
      lightboxImg.src = photo.previewUrl || photo.directUrl || photo.thumbnailUrl;
      lightboxImg.alt = photo.title;
      lightboxImg.onload = () => {
        lightboxImg.style.opacity = "1";
        if (lightboxLoader) lightboxLoader.classList.remove("active");
      };
      lightboxImg.onerror = () => {
        // Fallback to thumbnail or directUrl on error
        lightboxImg.src = photo.thumbnailUrl;
        lightboxImg.style.opacity = "1";
        if (lightboxLoader) lightboxLoader.classList.remove("active");
      };
    }

    if (photoLightboxModal) {
      photoLightboxModal.classList.add("open");
      photoLightboxModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closePhotoLightbox() {
    if (!photoLightboxModal) return;
    photoLightboxModal.classList.remove("open");
    photoLightboxModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function stepPhotoLightbox(delta) {
    if (!currentPhotosList || currentPhotosList.length === 0) return;
    const nextIndex = (activeLightboxIndex + delta + currentPhotosList.length) % currentPhotosList.length;
    openPhotoLightbox(nextIndex);
  }

  // Lightbox event listeners
  lightboxCloseBtn?.addEventListener("click", closePhotoLightbox);
  lightboxBackdrop?.addEventListener("click", closePhotoLightbox);
  lightboxPrevBtn?.addEventListener("click", () => stepPhotoLightbox(-1));
  lightboxNextBtn?.addEventListener("click", () => stepPhotoLightbox(1));

  document.addEventListener("keydown", (e) => {
    if (photoLightboxModal?.classList.contains("open")) {
      if (e.key === "Escape") closePhotoLightbox();
      if (e.key === "ArrowLeft") stepPhotoLightbox(-1);
      if (e.key === "ArrowRight") stepPhotoLightbox(1);
    }
  });

  // Refresh photos button
  refreshPhotosBtn?.addEventListener("click", () => {
    showToast("Checking Google Drive for updates...");
    loadPhotographyGallery(true);
  });

  /**
   * Google Apps Script Setup Modal Functions
   */
  function openGasSetupModal() {
    if (!gasSetupModal) return;
    if (gasEndpointInput) {
      gasEndpointInput.value = PHOTOGRAPHY_CONFIG.appsScriptUrl || "";
    }
    if (gasTestFeedback) {
      gasTestFeedback.textContent = "";
      gasTestFeedback.className = "gas-feedback";
    }
    gasSetupModal.classList.add("open");
    gasSetupModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeGasSetupModal() {
    if (!gasSetupModal) return;
    gasSetupModal.classList.remove("open");
    gasSetupModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  btnOpenGasSetup?.addEventListener("click", openGasSetupModal);
  gasModalCloseBtn?.addEventListener("click", closeGasSetupModal);
  gasModalCloseFooterBtn?.addEventListener("click", closeGasSetupModal);

  gasSetupModal?.addEventListener("click", (e) => {
    if (e.target === gasSetupModal) closeGasSetupModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && gasSetupModal?.classList.contains("open")) {
      closeGasSetupModal();
    }
  });

  // Copy Google Apps Script code to clipboard
  btnCopyGasCode?.addEventListener("click", () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(GAS_CODE_TEMPLATE)
        .then(() => {
          showToast("Code.gs template copied to clipboard!");
        })
        .catch(() => {
          showToast("Select and copy Code.gs from repository.");
        });
    } else {
      showToast("Clipboard API not available in this environment.");
    }
  });

  // Save & Test Google Apps Script Endpoint URL
  btnSaveGasUrl?.addEventListener("click", async () => {
    const rawUrl = gasEndpointInput?.value.trim() || "";
    if (!rawUrl) {
      if (gasTestFeedback) {
        gasTestFeedback.className = "gas-feedback error";
        gasTestFeedback.textContent = "Please enter a valid Google Apps Script Web App URL.";
      }
      return;
    }

    if (!rawUrl.includes("script.google.com")) {
      if (gasTestFeedback) {
        gasTestFeedback.className = "gas-feedback error";
        gasTestFeedback.textContent = "URL should be an Apps Script endpoint (https://script.google.com/macros/s/.../exec).";
      }
      return;
    }

    if (gasTestFeedback) {
      gasTestFeedback.className = "gas-feedback";
      gasTestFeedback.textContent = "Testing connection to Google Apps Script...";
    }

    try {
      const testRes = await fetch(rawUrl, { redirect: "follow" });
      const testData = await testRes.json();

      if (testData.status === "success") {
        localStorage.setItem("simone_photo_gas_url", rawUrl);
        PHOTOGRAPHY_CONFIG.appsScriptUrl = rawUrl;
        if (gasTestFeedback) {
          gasTestFeedback.className = "gas-feedback success";
          gasTestFeedback.textContent = `Connected! Found ${testData.totalPhotos || testData.photos.length} photos in Drive folder.`;
        }
        showToast("Connected to Google Drive!");
        loadPhotographyGallery(true);
        setTimeout(closeGasSetupModal, 1200);
      } else {
        throw new Error(testData.message || "Script responded with error status.");
      }
    } catch (testErr) {
      // Even if direct fetch has CORS warning during local testing, allow saving URL
      localStorage.setItem("simone_photo_gas_url", rawUrl);
      PHOTOGRAPHY_CONFIG.appsScriptUrl = rawUrl;
      if (gasTestFeedback) {
        gasTestFeedback.className = "gas-feedback success";
        gasTestFeedback.textContent = "URL saved to portfolio settings! Synchronizing...";
      }
      loadPhotographyGallery(true);
      setTimeout(closeGasSetupModal, 1200);
    }
  });

  /* ==========================================================================
     12. Cinematic View Transition Engine (SPA Page Switcher)
     ========================================================================== */
  let isViewTransitioning = false;

  function transitionToView(targetView, targetSectionId = null) {
    if (isViewTransitioning) return;
    isViewTransitioning = true;

    const curtain = document.getElementById("page-curtain");
    const curtainTitle = document.getElementById("curtain-title");
    const curtainSub = document.getElementById("curtain-sub");
    const frontView = document.getElementById("front-page-view");
    const photoView = document.getElementById("photography-view");

    if (!curtain || !frontView || !photoView) {
      isViewTransitioning = false;
      return;
    }

    // Set transition status text
    if (targetView === "photography") {
      if (curtainTitle) curtainTitle.textContent = "Entering Photography";
      if (curtainSub) curtainSub.textContent = "Streaming live captures from Google Drive...";
    } else {
      if (curtainTitle) curtainTitle.textContent = "Returning to Developer Portfolio";
      if (curtainSub) curtainSub.textContent = "Full-stack projects & technical case studies...";
    }

    // Phase 1: Wipe IN
    curtain.classList.remove("wipe-out");
    curtain.classList.add("animating", "wipe-in");

    setTimeout(() => {
      curtain.classList.add("show-content");
    }, 120);

    // Midpoint: Swap Views
    setTimeout(() => {
      if (targetView === "photography") {
        frontView.classList.remove("active");
        frontView.setAttribute("aria-hidden", "true");
        photoView.classList.add("active");
        photoView.setAttribute("aria-hidden", "false");
        window.scrollTo(0, 0);
        history.pushState(null, "", "#photography");

        // Load photography gallery if not already populated
        if (currentPhotosList.length === 0) {
          loadPhotographyGallery();
        }

        // Highlight photography in nav
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#photography");
        });
      } else {
        photoView.classList.remove("active");
        photoView.setAttribute("aria-hidden", "true");
        frontView.classList.add("active");
        frontView.setAttribute("aria-hidden", "false");

        if (targetSectionId) {
          const targetSec = document.getElementById(targetSectionId);
          if (targetSec) {
            targetSec.scrollIntoView({ behavior: "instant" });
          } else {
            window.scrollTo(0, 0);
          }
          history.pushState(null, "", `#${targetSectionId}`);
        } else {
          const portfolioSec = document.getElementById("portfolio");
          if (portfolioSec) {
            portfolioSec.scrollIntoView({ behavior: "instant" });
          } else {
            window.scrollTo(0, 0);
          }
          history.pushState(null, "", "#portfolio");
        }

        // Update active nav link for front view
        handleScroll();
      }

      // Phase 2: Wipe OUT
      setTimeout(() => {
        curtain.classList.remove("show-content", "wipe-in");
        curtain.classList.add("wipe-out");

        setTimeout(() => {
          curtain.classList.remove("animating", "wipe-out");
          isViewTransitioning = false;
        }, 400);
      }, 160);
    }, 400);
  }

  // Hook "Explore Photo Gallery" trigger button in portfolio callout
  const btnOpenPhotography = document.getElementById("btn-open-photography");
  btnOpenPhotography?.addEventListener("click", () => {
    transitionToView("photography");
  });

  const footerPhotoLinks = document.querySelectorAll(".footer-link-photography");
  footerPhotoLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      transitionToView("photography");
    });
  });

  // Hook all "Back to Developer Portfolio" buttons in photography view
  const backToPortfolioBtns = document.querySelectorAll(".btn-back-to-portfolio");
  backToPortfolioBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      transitionToView("portfolio", "portfolio");
    });
  });

  // Handle browser navigation (Back / Forward buttons)
  window.addEventListener("popstate", () => {
    const isPhotoHash = window.location.hash === "#photography";
    const photoView = document.getElementById("photography-view");
    const isPhotoActive = photoView?.classList.contains("active");

    if (isPhotoHash && !isPhotoActive) {
      transitionToView("photography");
    } else if (!isPhotoHash && isPhotoActive) {
      const targetSecId = window.location.hash ? window.location.hash.substring(1) : "portfolio";
      transitionToView("portfolio", targetSecId);
    }
  });

  // Check initial load hash
  if (window.location.hash === "#photography") {
    const frontView = document.getElementById("front-page-view");
    const photoView = document.getElementById("photography-view");
    if (frontView && photoView) {
      frontView.classList.remove("active");
      frontView.setAttribute("aria-hidden", "true");
      photoView.classList.add("active");
      photoView.setAttribute("aria-hidden", "false");
      window.scrollTo(0, 0);
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#photography");
      });
      loadPhotographyGallery();
    }
  } else {
    // Front page active by default; pre-load photography in background
    loadPhotographyGallery();
  }
});

