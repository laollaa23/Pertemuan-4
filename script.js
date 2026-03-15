// ============================================================
// script.js — Portfolio Olla Ramadhani
// ============================================================


// ==============================
// FITUR 1: DARK MODE + LOCAL STORAGE
// ==============================

const darkToggleBtn = document.querySelector('#dark-toggle');
const body = document.body;

// Terapkan mode yang tersimpan saat halaman dimuat
if (localStorage.getItem('mode') === 'dark') {
  body.classList.add('dark-mode');
  darkToggleBtn.textContent = '☀️ Light Mode';
}

darkToggleBtn.addEventListener('click', function () {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  darkToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('mode', isDark ? 'dark' : 'light');
});


// ==============================
// FITUR 2: NAVBAR — SCROLL SHADOW & ACTIVE LINK
// ==============================

const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar__links a');
const sections = document.querySelectorAll('section[id], header[id]');

// Tambah shadow saat scroll
window.addEventListener('scroll', function () {
  navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
  highlightActiveLink();
});

// Tandai link aktif berdasarkan posisi scroll
function highlightActiveLink() {
  let currentId = '';

  sections.forEach(section => {
    const top = section.offsetTop - 80;
    if (window.scrollY >= top) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}


// ==============================
// FITUR 3: SMOOTH SCROLL UNTUK SEMUA ANCHOR LINK
// ==============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ==============================
// FITUR 4: VALIDASI FORM KONTAK
// ==============================

const contactCard  = document.querySelector('.card');
const inputNama    = contactCard.querySelector('input[type="text"]');
const inputEmail   = contactCard.querySelector('input[type="email"]');
const inputPesan   = contactCard.querySelector('textarea');
const btnKirim     = contactCard.querySelector('.btn-send');

// Buat elemen feedback dan sisipkan sebelum tombol
const formFeedback = document.createElement('p');
formFeedback.className = 'feedback';
contactCard.querySelector('.btn-wrap').insertAdjacentElement('beforebegin', formFeedback);

function tampilkanPesan(teks, tipe) {
  formFeedback.textContent = teks;
  formFeedback.className = `feedback feedback--${tipe}`;

  // Hilangkan pesan setelah 5 detik
  setTimeout(() => {
    formFeedback.textContent = '';
    formFeedback.className = 'feedback';
  }, 5000);
}

function isEmailValid(email) {
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  return regex.test(email);
}

btnKirim.addEventListener('click', function () {
  const nama  = inputNama.value.trim();
  const email = inputEmail.value.trim();
  const pesan = inputPesan.value.trim();

  // Reset highlight error
  [inputNama, inputEmail, inputPesan].forEach(el => el.classList.remove('input--error'));

  if (nama === '' || email === '' || pesan === '') {
    tampilkanPesan('⚠️ Semua field harus diisi!', 'error');
    if (nama === '')  inputNama.classList.add('input--error');
    if (email === '') inputEmail.classList.add('input--error');
    if (pesan === '') inputPesan.classList.add('input--error');
    return;
  }

  if (!isEmailValid(email)) {
    tampilkanPesan('⚠️ Format email tidak valid!', 'error');
    inputEmail.classList.add('input--error');
    return;
  }

  tampilkanPesan(`✅ Pesan berhasil dikirim! Terima kasih, ${nama} 🎉`, 'success');

  // Reset form
  inputNama.value  = '';
  inputEmail.value = '';
  inputPesan.value = '';
});


// ==============================
// FITUR 5: ANIMASI MUNCUL SAAT SCROLL (INTERSECTION OBSERVER)
// ==============================

const revealElements = document.querySelectorAll(
  '.skill-card, .portfolio-card, .about__edu-item, .contact__item'
);

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // Animasi hanya sekali
    }
  });
}, observerOptions);

revealElements.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`; // stagger per baris
  revealObserver.observe(el);
});


// ==============================
// FITUR 6: SKILL CARD — HOVER TILT EFEK
// ==============================

document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 14;
    card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', function () {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
  });
});


// ==============================
// FITUR 7: TYPING EFFECT PADA HERO SUBTITLE
// ==============================

const typingTarget = document.querySelector('.hero__title .highlight');
if (typingTarget) {
  const originalText = typingTarget.textContent;
  typingTarget.textContent = '';
  typingTarget.style.borderRight = '2px solid currentColor';

  let charIndex = 0;
  const typeInterval = setInterval(() => {
    typingTarget.textContent += originalText[charIndex];
    charIndex++;
    if (charIndex >= originalText.length) {
      clearInterval(typeInterval);
      // Kedip kursor berhenti setelah 2 detik
      setTimeout(() => { typingTarget.style.borderRight = 'none'; }, 2000);
    }
  }, 80);
}


// ==============================
// FITUR 8: PORTFOLIO CARD — PREVIEW GAMBAR ZOOM
// ==============================

document.querySelectorAll('.portfolio-card__image img').forEach(img => {
  img.addEventListener('click', function () {
    const overlay = document.createElement('div');
    overlay.className = 'img-overlay';
    overlay.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    document.body.appendChild(overlay);

    // Fade in
    requestAnimationFrame(() => overlay.classList.add('img-overlay--visible'));

    overlay.addEventListener('click', () => {
      overlay.classList.remove('img-overlay--visible');
      setTimeout(() => overlay.remove(), 300);
    });
  });
});
