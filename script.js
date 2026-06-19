/* ================================================================
   script.js — Phil Collins Darlington | Portfolio
   ================================================================

   TABLE OF CONTENTS
   -----------------
   1.  Navbar: scroll effect + active link highlighting
   2.  Mobile menu toggle
   3.  Typing effect (hero section)
   4.  Particle canvas background
   5.  Scroll animations (IntersectionObserver)
   6.  Skill bar animations
   7.  Portfolio filter buttons
   8.  Back to top button
   9.  Contact form validation & submission
   10. Footer: dynamic copyright year
   ================================================================ */


/* ================================================================
   Wait for the DOM to be fully loaded before running any script
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {


  /* ==============================================================
     1. NAVBAR — Scroll effect & active link highlighting
     ==============================================================
     Adds the .scrolled class to the navbar when the user scrolls
     past a threshold, enabling the frosted-glass background.
     Also highlights the nav link corresponding to the current section.
  ============================================================== */

  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    // Toggle frosted-glass effect after scrolling 50px
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight the nav link for the section currently in view
    let currentSection = '';

    sections.forEach(section => {
      // 120px offset accounts for the fixed navbar height
      if (window.scrollY >= section.offsetTop - 120) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      // The href is like "#about" so we slice the # off
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Run on scroll and once on load
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* ==============================================================
     2. MOBILE MENU TOGGLE
     ==============================================================
     Toggles the .open class on the nav links and .active on the
     hamburger icon. Closes the menu when any link is clicked.
  ============================================================== */

  const hamburger  = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksList.classList.toggle('open');
    // Prevent body from scrolling while menu is open
    document.body.style.overflow =
      navLinksList.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksList.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ==============================================================
     3. TYPING EFFECT (Hero Section)
     ==============================================================
     Cycles through an array of strings, typing each character with
     a delay, then erasing it before moving to the next phrase.
     The cursor is rendered in HTML (the .cursor span).
  ============================================================== */

  const typedElement = document.getElementById('typedText');

  // ── CUSTOMIZE: Change these phrases to whatever you like ──────
  const phrases = [
    'Digital Experiences.',
    'Business Websites.',
    'E-commerce Stores.',
    'IT Solutions.',
    'Your Vision Online.',
  ];

  let phraseIndex  = 0; // which phrase we're on
  let charIndex    = 0; // which character within the phrase
  let isDeleting   = false;
  let typingPaused = false;

  function typeEffect() {
    if (typingPaused) return;

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing forward
      typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        // Pause at end of phrase before erasing
        typingPaused = true;
        setTimeout(() => {
          typingPaused = false;
          isDeleting   = true;
          typeEffect();
        }, 1800);
        return;
      }
    } else {
      // Erasing
      typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    // Speed: faster when erasing, slightly random when typing
    const speed = isDeleting ? 60 : 90 + Math.random() * 40;
    setTimeout(typeEffect, speed);
  }

  // Start after a short delay so the hero fully renders first
  setTimeout(typeEffect, 1000);


  /* ==============================================================
     4. PARTICLE CANVAS (Hero Background)
     ==============================================================
     Draws a network of connected moving dots on a <canvas>.
     Dots move gently and connect when within a threshold distance.
     Mouse proximity repels nearby dots for an interactive feel.
  ============================================================== */

  const canvas  = document.getElementById('particleCanvas');
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let mouse     = { x: null, y: null };

  // ── CONFIG ────────────────────────────────────────────────────
  const PARTICLE_COUNT    = 70;   // Number of dots
  const MAX_DIST          = 130;  // Line draw distance (px)
  const MOUSE_REPEL_DIST  = 120;  // Mouse interaction radius
  const PARTICLE_COLOR    = 'rgba(0, 212, 255, '; // Base color (alpha appended)
  const LINE_COLOR        = 'rgba(0, 212, 255, '; // Line color
  // ─────────────────────────────────────────────────────────────

  // Resize canvas to fill the hero section
  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  // Create a single particle at a random position
  function createParticle() {
    return {
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      vx:   (Math.random() - 0.5) * 0.5, // velocity x
      vy:   (Math.random() - 0.5) * 0.5, // velocity y
      size: Math.random() * 2 + 1,       // radius
    };
  }

  // Initialise all particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  // Main animation loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // Move the particle
      p.x += p.vx;
      p.y += p.vy;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_REPEL_DIST) {
          const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST * 0.08;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Speed cap so particles don't fly off
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) {
        p.vx = (p.vx / speed) * 1.5;
        p.vy = (p.vy / speed) * 1.5;
      }

      // Gentle friction to keep things calm
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Wrap particles at edges so they reappear on the other side
      if (p.x < 0)             p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0)             p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw the particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${PARTICLE_COLOR}0.6)`;
      ctx.fill();

      // Draw connecting lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dx   = p.x - q.x;
        const dy   = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          // Opacity fades as distance increases
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `${LINE_COLOR}${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animateParticles);
  }

  // Track mouse position over the hero
  document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.querySelector('.hero').addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  // Boot the canvas
  resizeCanvas();
  initParticles();
  animateParticles();


  /* ==============================================================
     5. SCROLL ANIMATIONS (IntersectionObserver)
     ==============================================================
     Watches all elements with [data-animate] attribute.
     When they enter the viewport, adds the .visible class which
     triggers the CSS fade-up transition.
  ============================================================== */

  const animatedElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    threshold: 0.12,       // 12% of element must be visible
    rootMargin: '0px 0px -50px 0px', // Slight bottom offset
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animating so it only plays once
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));


  /* ==============================================================
     6. SKILL BAR ANIMATIONS
     ==============================================================
     Uses an IntersectionObserver to trigger skill bar fills.
     When the skills section enters the viewport, the fill widths
     animate from 0 to their data-level value.
  ============================================================== */

  const skillFills   = document.querySelectorAll('.skill-fill');
  const skillsSection = document.getElementById('skills');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // A small delay so the section's fade-in completes first
        setTimeout(() => {
          skillFills.forEach(fill => {
            const level = fill.getAttribute('data-level');
            fill.style.width = `${level}%`;
          });
        }, 300);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (skillsSection) {
    skillObserver.observe(skillsSection);
  }


  /* ==============================================================
     7. PORTFOLIO FILTER BUTTONS
     ==============================================================
     Filters portfolio cards by their data-category attribute.
     "all" shows everything. Other values show/hide cards with
     a smooth fade transition.
  ============================================================== */

  const filterButtons   = document.querySelectorAll('.filter-btn');
  const portfolioCards  = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button style
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          // Fade in
          card.style.display  = 'block';
          card.style.opacity  = '0';
          card.style.transform = 'scale(0.95)';
          // Small timeout lets display:block render before transition
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'scale(1)';
          }, 10);
        } else {
          // Fade out then hide
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  /* ==============================================================
     8. BACK TO TOP BUTTON
     ==============================================================
     Shows/hides the button based on scroll position.
     Clicking it smoothly scrolls back to the top.
  ============================================================== */

  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ==============================================================
     9. CONTACT FORM — Validation & Submission
     ==============================================================
     Validates required fields client-side before submission.
     Currently simulates a successful send with a timeout.
     TO INTEGRATE with a real backend, replace the simulated
     send inside submitForm() with a fetch() call to your API,
     EmailJS, Formspree, or any form service.
  ============================================================== */

  const contactForm  = document.getElementById('contactForm');
  const submitBtn    = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  // ── Validation helpers ──────────────────────────────────────

  function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field && error) {
      field.classList.add('invalid');
      error.textContent = message;
    }
  }

  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field && error) {
      field.classList.remove('invalid');
      error.textContent = '';
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm() {
    let valid = true;

    // Name
    const name = document.getElementById('name').value.trim();
    if (!name) {
      showError('name', 'nameError', 'Please enter your full name.');
      valid = false;
    } else if (name.length < 2) {
      showError('name', 'nameError', 'Name must be at least 2 characters.');
      valid = false;
    } else {
      clearError('name', 'nameError');
    }

    // Email
    const email = document.getElementById('email').value.trim();
    if (!email) {
      showError('email', 'emailError', 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('email', 'emailError', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('email', 'emailError');
    }

    // Subject
    const subject = document.getElementById('subject').value.trim();
    if (!subject) {
      showError('subject', 'subjectError', 'Please enter a subject.');
      valid = false;
    } else {
      clearError('subject', 'subjectError');
    }

    // Message
    const message = document.getElementById('message').value.trim();
    if (!message) {
      showError('message', 'messageError', 'Please write a message.');
      valid = false;
    } else if (message.length < 20) {
      showError('message', 'messageError', 'Message should be at least 20 characters.');
      valid = false;
    } else {
      clearError('message', 'messageError');
    }

    return valid;
  }

  // ── Clear errors on input ───────────────────────────────────
  ['name', 'email', 'subject', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearError(id, `${id}Error`));
    }
  });

  // ── Form submit ─────────────────────────────────────────────
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default page reload

    // Reset feedback
    formFeedback.className = 'form-feedback';
    formFeedback.textContent = '';

    if (!validateForm()) return;

    // ── Loading state ──────────────────────────────────────
    submitBtn.classList.add('loading');
    submitBtn.querySelector('span').textContent = 'Sending…';

    // ── SIMULATED SEND (replace this block with real API call) ──
    // Example with Formspree:
    //   fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //     method: 'POST',
    //     headers: { 'Accept': 'application/json' },
    //     body: new FormData(contactForm)
    //   })
    //   .then(res => res.ok ? showSuccess() : showFormError())
    //   .catch(() => showFormError());
    //
    // Example with EmailJS:
    //   emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', contactForm)
    //   .then(showSuccess, showFormError);
    // ───────────────────────────────────────────────────────────
    setTimeout(() => {
      showSuccess();
    }, 1500); // Simulated 1.5s network delay
  });

  function showSuccess() {
    submitBtn.classList.remove('loading');
    submitBtn.querySelector('span').textContent = 'Send Message';
    formFeedback.className = 'form-feedback success';
    formFeedback.textContent =
      '✓ Message sent! I\'ll get back to you within 24 hours.';
    contactForm.reset();

    // Auto-clear feedback after 6 seconds
    setTimeout(() => {
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';
    }, 6000);
  }

  function showFormError() {
    submitBtn.classList.remove('loading');
    submitBtn.querySelector('span').textContent = 'Send Message';
    formFeedback.className = 'form-feedback error';
    formFeedback.textContent =
      'Something went wrong. Please try again or contact me via WhatsApp.';
  }


  /* ==============================================================
     10. FOOTER — Dynamic Copyright Year
     ==============================================================
     Keeps the copyright year current automatically.
  ============================================================== */

  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ==============================================================
     BONUS: Smooth reveal for sections loaded above the fold
     ==============================================================
     On page load, immediately mark any [data-animate] elements
     that are already in the viewport as visible.
  ============================================================== */
  setTimeout(() => {
    animatedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 100);


}); // ── End DOMContentLoaded ────────────────────────────────────
