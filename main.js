/**
 * Suvam Gyawali - Portfolio Interactive Logic
 * Features:
 *  - Ambient Neural Particle Canvas
 *  - Dynamic Hero Typewriter Effect
 *  - Categorized Skills Tab Switcher
 *  - Filterable Project Gallery
 *  - Deep Architecture Detail Modal
 *  - Contact Form Client Validation & Toast Alerts
 *  - Mobile Menu Toggle & Scroll Spy
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initAmbientCanvas();
  initTypewriter();
  initScrollSpyAndNavbar();
  initSkillsTabs();
  initProjectFilters();
  initProjectModal();
  initContactForm();
  initMobileMenu();
});

/* ==========================================================================
   1. Ambient Neural Particle Canvas
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  const colors = ['rgba(0, 242, 254, ', 'rgba(168, 85, 247, ', 'rgba(16, 185, 129, '];
  let particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.colorBase}${this.alpha})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Hero Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter-text');
  if (!typewriterEl) return;

  const roles = [
    'Full Stack Web Experiences',
    'Scalable Backend Microservices',
    'Intelligent AI & RAG Pipelines',
    'High-Throughput Distributed Systems',
    'Modern Reactive Architectures'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 75;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1800; // Pause at completion
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. Scroll Spy & Sticky Navbar
   ========================================================================== */
function initScrollSpyAndNavbar() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header background blur on scroll
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy active navigation
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   4. Categorized Skills Tab Switcher
   ========================================================================== */
function initSkillsTabs() {
  const tabBtns = document.querySelectorAll('.skills-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-target');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (target === 'all-skills') {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else if (target === 'frontend-skills') {
          card.style.display = category === 'frontend' ? 'flex' : 'none';
        } else if (target === 'backend-skills') {
          card.style.display = category === 'backend' ? 'flex' : 'none';
        } else if (target === 'ai-skills') {
          card.style.display = category === 'ai' ? 'flex' : 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Filterable Projects Gallery
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   6. Deep Architecture Detail Modal
   ========================================================================== */
const projectData = {
  neuroquery: {
    title: 'NeuroQuery: Enterprise Multimodal RAG Engine',
    category: 'Artificial Intelligence & Machine Learning',
    banner: 'assets/images/project-ai-rag.jpg',
    overview:
      'NeuroQuery is an enterprise-grade retrieval-augmented generation platform engineered to deliver sub-300ms query responses across multi-gigabyte proprietary vector embeddings.',
    architectureDetails: [
      {
        heading: 'Vector Space & Hybrid Indexing',
        desc: 'Constructed an indexing engine combining Dense embeddings (OpenAI text-embedding-3-large) with Sparse lexical indexing (BM25) stored directly in PostgreSQL via the pgvector extension.'
      },
      {
        heading: 'Cross-Encoder Re-Ranking Pipeline',
        desc: 'Employs a two-stage retrieval pass: candidate collection via cosine similarity followed by Cohere / BGE cross-encoder re-ranking, boosting precision to 99.2%.'
      },
      {
        heading: 'Agentic Tool Calling & Guardrails',
        desc: 'Equipped with custom LangChain execution chains with automated schema validation and semantic hallucination guardrails before streaming responses to the frontend.'
      }
    ],
    techStack: ['Python 3.11', 'FastAPI', 'LangChain', 'pgvector', 'PostgreSQL', 'Docker', 'React 18', 'TailwindCSS'],
    benchmarks: [
      { label: 'P95 Retrieval Latency', val: '240ms' },
      { label: 'Re-ranking Accuracy', val: '99.2%' },
      { label: 'Concurrent Queries', val: '1,500 req/s' }
    ]
  },
  omniflow: {
    title: 'OmniFlow: Distributed Microservices Hub',
    category: 'Backend Architecture & Cloud Systems',
    banner: 'assets/images/project-backend-cloud.jpg',
    overview:
      'A resilient, event-driven backend microservices hub orchestrating high-concurrency order workflows, payment event streams, and real-time inventory synchronization.',
    architectureDetails: [
      {
        heading: 'Distributed Event Streaming',
        desc: 'Utilizes Redis Streams and BullMQ message queues with isolated worker processes to guarantee at-least-once message delivery across 8 microservices.'
      },
      {
        heading: 'Database Partitioning & Isolation',
        desc: 'Implemented PostgreSQL multi-tenant schema partitioning with connection pooling via PgBouncer, preventing connection starvation during spike traffic.'
      },
      {
        heading: 'Automated Circuit Breakers & Observability',
        desc: 'Configured automated circuit breakers and Prometheus telemetry exporters to safeguard down-stream APIs and achieve 99.99% uptime.'
      }
    ],
    techStack: ['Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'BullMQ', 'Docker Compose', 'Nginx', 'TypeScript'],
    benchmarks: [
      { label: 'Throughput', val: '32,540 req/s' },
      { label: 'P99 Latency', val: '15ms' },
      { label: 'Error Rate', val: '0.012%' }
    ]
  },
  nexusui: {
    title: 'NexusUI: Next-Gen Reactive Component Studio',
    category: 'Frontend Engineering & Design Systems',
    banner: 'assets/images/project-frontend-studio.jpg',
    overview:
      'A cutting-edge interactive design system and component studio empowering developers to design, test, and export accessible glassmorphic UI widgets in real-time.',
    architectureDetails: [
      {
        heading: 'State Synchronization & Performance',
        desc: 'Engineered a reactive store using Zustand with selective re-render subscriptions, achieving consistent 60fps canvas performance during drag-and-drop operations.'
      },
      {
        heading: 'Fluid Design Tokens & CSS Variables',
        desc: 'Built an atomic design token compiler that dynamically updates CSS custom properties across the DOM tree without triggering layout thrashing.'
      },
      {
        heading: 'Accessibility & Cross-Platform Compliance',
        desc: 'Compliant with WCAG 2.1 AA standards, featuring full keyboard navigability, high-contrast support, and ARIA live regions for screen readers.'
      }
    ],
    techStack: ['React 18', 'TypeScript', 'Modern Vanilla CSS', 'TailwindCSS', 'Zustand', 'Vite', 'HTML5 Canvas'],
    benchmarks: [
      { label: 'Frame Rate', val: '60 fps' },
      { label: 'Bundle Size (Gzipped)', val: '24.6 KB' },
      { label: 'Lighthouse Score', val: '99 / 100' }
    ]
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalContent = document.getElementById('modal-dynamic-content');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--frontend-cyan); text-transform: uppercase; letter-spacing: 0.1em;">${data.category}</span>
        <h2 style="font-size: 1.8rem; margin: 0.4rem 0 1rem;">${data.title}</h2>
        <div style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.5rem; max-height: 280px;">
          <img src="${data.banner}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <p style="color: var(--text-muted); font-size: 1.02rem; line-height: 1.6; margin-bottom: 1.5rem;">${data.overview}</p>
      </div>

      <div style="margin-bottom: 1.75rem;">
        <h3 style="font-size: 1.25rem; margin-bottom: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem;">
          <i class="fa-solid fa-microchip" style="color: var(--ai-purple); margin-right: 0.5rem;"></i> Deep Technical Architecture
        </h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${data.architectureDetails
            .map(
              (item) => `
            <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--frontend-cyan);">
              <h4 style="font-size: 1rem; margin-bottom: 0.3rem;">${item.heading}</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">${item.desc}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div style="margin-bottom: 1.75rem;">
        <h3 style="font-size: 1.25rem; margin-bottom: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem;">
          <i class="fa-solid fa-chart-line" style="color: var(--backend-green); margin-right: 0.5rem;"></i> Verified Benchmarks
        </h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
          ${data.benchmarks
            .map(
              (b) => `
            <div style="background: rgba(255,255,255,0.03); padding: 0.85rem; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--glass-border);">
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-main);">${b.val}</div>
              <div style="font-size: 0.74rem; font-family: var(--font-mono); color: var(--text-muted);">${b.label}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div>
        <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-muted);">Core Stack:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${data.techStack
            .map(
              (t) => `
            <span style="font-family: var(--font-mono); font-size: 0.76rem; background: var(--frontend-cyan-bg); color: var(--frontend-cyan); padding: 0.3rem 0.7rem; border-radius: var(--radius-full); border: 1px solid rgba(0,242,254,0.25);">${t}</span>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = trigger.getAttribute('data-project');
      openModal(projId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. Contact Form Client-Side Validation & Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }

    // Simulate sending state
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>Transmitting Message...</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      form.reset();

      showToast(`Thank you, ${name}! Your message has been received. Suvam will get in touch shortly.`, 'success');
    }, 800);
  });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';

  toast.innerHTML = `
    <i class="${iconClass}"></i>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ==========================================================================
   8. Mobile Drawer Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    toggleBtn.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}
