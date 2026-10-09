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
    "CSE Undergrad @ BRAC University.",
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
  const sections = document.querySelectorAll("section[id]");
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

    // Scroll Spy: identify active section
    let currentSectionId = "home";
    sections.forEach((section) => {
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
     3. Mobile Navigation Drawer Toggle
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

  // Close mobile drawer when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
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
      github: "https://github.com/mahim-13-08",
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
      github: "https://github.com/mahim-13-08",
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
      github: "https://github.com/mahim-13-08",
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
      github: "https://github.com/mahim-13-08",
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

      // Generate mailto link
      const mailtoUrl = `mailto:mahimnashid@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Hi Nashid,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`
      )}`;

      if (formStatus) {
        formStatus.className = "form-status success";
        formStatus.textContent = "Opening your email client...";
      }

      showToast("Opening default email client...");
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);
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
});
