/**
 * GEORGIAN PUB KUTAISI - INTERACTIVE JAVASCRIPT[cite: 2]
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initLanguageSwitcher();
  initMenuTabs();
  initReviewsCarousel();
  initBookingForm();
  initPitchWidget();
});

/* ==========================================================================
   Header Scroll Effect[cite: 2]
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  const scrollOffset = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollOffset) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   Mobile Menu Toggle[cite: 2]
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== mobileToggle) {
      mobileToggle.classList.remove('open');
      navMenu.classList.open = false; // Safe removal
      navMenu.classList.remove('open');
    }
  });

  // Close menu when clicking links & handle active status
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      navMenu.classList.remove('open');
      
      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Simple scroll spy to highlight nav active link
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < (section.offsetTop + section.offsetHeight)) {
        const id = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   Language Switcher & Translation Management[cite: 2]
   ========================================================================== */
function initLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.lang-btn');
  
  // Load saved language or default to 'ge' (Georgian)
  const savedLang = localStorage.getItem('selectedLang') || 'ge';
  setLanguage(savedLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  function setLanguage(lang) {
    // Save selection
    localStorage.setItem('selectedLang', lang);
    
    // Toggle body class
    document.body.classList.remove('lang-ge', 'lang-en', 'lang-ru');
    document.body.classList.add(`lang-${lang}`);

    const langAttr = { ge: 'ka', en: 'en', ru: 'ru' };
    document.documentElement.setAttribute('lang', langAttr[lang] || 'ka');

    // Toggle active state on header buttons
    langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Form placeholder based on language
    updateFormPlaceholders(lang);
  }

  function updateFormPlaceholders(lang) {
    const nameInput = document.getElementById('bookName');
    const phoneInput = document.getElementById('bookPhone');
    const notesInput = document.getElementById('bookNotes');

    if (!nameInput || !phoneInput || !notesInput) return;

    if (lang === 'en') {
      nameInput.placeholder = "e.g. John Doe";
      phoneInput.placeholder = "e.g. +995 599 12 34 56";
      notesInput.placeholder = "Notes (e.g. table near giant screen)...";
    } else if (lang === 'ru') {
      nameInput.placeholder = "напр. Иван Петров";
      phoneInput.placeholder = "напр. +995 599 12 34 56";
      notesInput.placeholder = "Примечания (напр. столик у экрана)...";
    } else {
      nameInput.placeholder = "მაგ. გიორგი კახიძე";
      phoneInput.placeholder = "მაგ. +995 599 12 34 56";
      notesInput.placeholder = "შენიშვნები (მაგ. მაგიდა ეკრანთან ახლოს)...";
    }
  }
}

/* ==========================================================================
   Interactive Menu Tabs[cite: 2]
   ========================================================================== */
function initMenuTabs() {
  const tabBtns = document.querySelectorAll('.menu-tab-btn');
  const panels = document.querySelectorAll('.menu-panel');

  if (tabBtns.length === 0 || panels.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update active button
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active panel
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('id') === targetTab) {
          panel.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   Guest Reviews Slider / Carousel[cite: 2]
   ========================================================================== */
function initReviewsCarousel() {
  const reviews = document.querySelectorAll('.review-card');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  let currentIndex = 0;
  let intervalId = null;

  if (reviews.length === 0) return;

  // Function to show specific review
  function showReview(index) {
    reviews.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    reviews[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  // Handle dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      showReview(index);
      resetAutoCycle();
    });
  });

  // Auto cycle reviews
  function startAutoCycle() {
    intervalId = setInterval(() => {
      let nextIndex = (currentIndex + 1) % reviews.length;
      showReview(nextIndex);
    }, 6000);
  }

  function resetAutoCycle() {
    clearInterval(intervalId);
    startAutoCycle();
  }

  startAutoCycle();
}

/* ==========================================================================
   Booking Form Validation & Simulated Reservation[cite: 2]
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  // Restrict date input from today onwards
  const dateInput = document.getElementById('bookDate');
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  
  // Max date is 3 months from now
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  dateInput.max = maxDate.toISOString().split('T')[0];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear errors
    clearFormErrors();

    // Validate fields
    const name = document.getElementById('bookName');
    const phone = document.getElementById('bookPhone');
    const date = document.getElementById('bookDate');
    const time = document.getElementById('bookTime');
    
    let isValid = true;
    const isEn = document.body.classList.contains('lang-en');

    // Name Validation
    if (name.value.trim().length < 2) {
      showError(name, isEn ? "Please enter your name (min 2 characters)" : "გთხოვთ შეიყვანოთ სახელი (მინ. 2 სიმბოლო)");
      isValid = false;
    }

    // Phone Validation
    const phoneRegex = /^\+?[0-9\s-]{9,15}$/;
    if (!phoneRegex.test(phone.value.trim())) {
      showError(phone, isEn ? "Please enter a valid phone number" : "შეიყვანეთ ტელონის სწორი ნომერი");
      isValid = false;
    }

    // Date Validation
    if (!date.value) {
      showError(date, isEn ? "Please select a date" : "გთხოვთ აირჩიოთ თარიღი");
      isValid = false;
    }

    // Time Validation
    if (!time.value) {
      showError(time, isEn ? "Please select a time" : "გთხოვთ აირჩიოთ დრო");
      isValid = false;
    }

    if (!isValid) return;

    // Simulate submission loader
    const submitBtn = document.getElementById('submitBtn');
    const originalContent = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = isEn 
      ? '<i class="fa-solid fa-spinner fa-spin"></i> Processing...' 
      : '<i class="fa-solid fa-spinner fa-spin"></i> იგზავნება...';

    setTimeout(() => {
      // Complete reservation
      showToast(isEn ? "Table reserved! We will call you shortly to confirm." : "მაგიდა დაჯავშნილია! დასადასტურებლად მალე დაგიკავშირდებით.");
      form.reset();
      
      // Restore date min value
      dateInput.min = today;
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
    }, 1800);
  });

  function showError(inputElement, message) {
    const group = inputElement.closest('.form-group');
    group.classList.add('error');
    const errorSpan = group.querySelector('.error-msg');
    if (errorSpan) {
      errorSpan.innerText = message;
    }
  }

  function clearFormErrors() {
    const groups = document.querySelectorAll('.form-group');
    groups.forEach(g => g.classList.remove('error'));
  }
}

/* ==========================================================================
   Toast Notification System[cite: 2]
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid fa-circle-check"></i></div>
    <div class="toast-body">${message}</div>
  `;

  container.appendChild(toast);

  // Trigger animation reflow
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Remove toast after 4.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4500);
}

/* ==========================================================================
   Pitch Widget Logic (Floating Sales Helper)[cite: 2]
   ========================================================================== */
function initPitchWidget() {
  const widget = document.getElementById('pitchWidget');
  const toggle = document.getElementById('pitchToggle');
  const closeBtn = document.getElementById('closePitchBtn');
  const copyBtn = document.getElementById('copyCodeBtn');

  if (!widget || !toggle || !closeBtn || !copyBtn) return;

  // Toggle open
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    widget.classList.toggle('open');
  });

  // Close widget
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    widget.classList.remove('open');
  });

  // Close when clicking outside widget
  document.addEventListener('click', (e) => {
    if (widget.classList.contains('open') && !widget.contains(e.target)) {
      widget.classList.remove('open');
    }
  });

  // Copy folder paths / pitch helper to clipboard
  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    const pitchText = `Hi! I created this premium, bilingual, interactive website for "ქართული პაბი • Georgian Pub". The complete codebase is located on your system:
Folder: c:\\Users\\mrinb\\OneDrive\\Desktop\\websites for buisnesses\\georgian-pub
Feel free to launch index.html and review it!`;

    navigator.clipboard.writeText(pitchText).then(() => {
      const isEn = document.body.classList.contains('lang-en');
      showToast(isEn ? "Pitch information copied to clipboard!" : "ინფორმაცია კოპირებულია გაცვლის ბუფერში!");
      widget.classList.remove('open');
    }).catch(err => {
      console.error('Failed to copy to clipboard', err);
    });
  });
}