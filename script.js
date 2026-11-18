/* =============================================================
   FOR JANELLE — script.js
   ============================================================= */


/* ---- HERO ENTRANCE ----------------------------------------- */
(function initHeroEntrance() {
  var heroEls = document.querySelectorAll('.fade-up');

  function triggerHero() {
    requestAnimationFrame(function () {
      heroEls.forEach(function (el) {
        el.classList.add('visible');
      });
    });
  }

  if (document.readyState === 'complete') {
    triggerHero();
  } else {
    window.addEventListener('load', triggerHero);
  }
})();


/* ---- NAV: scroll + mobile menu ----------------------------- */
(function initNav() {
  var nav    = document.getElementById('main-nav');
  var toggle = document.querySelector('.nav-toggle');

  /* add .scrolled once page scrolls past nav height */
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* mobile hamburger */
  if (toggle) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('menu-open');
      var expanded = nav.classList.contains('menu-open');
      toggle.setAttribute('aria-expanded', String(expanded));
    });
  }

  /* close mobile menu on any link tap */
  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('menu-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ---- SECTION REVEAL ---------------------------------------- */
(function initReveal() {
  var sections = document.querySelectorAll('.reveal-section');

  if (!('IntersectionObserver' in window)) {
    sections.forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  sections.forEach(function (el) { obs.observe(el); });
})();


/* ---- REASON CARD STAGGER ----------------------------------- */
(function initReasonStagger() {
  var cards = document.querySelectorAll('.reason-card');

  if (!('IntersectionObserver' in window)) {
    /* no observer support — leave cards fully visible */
    return;
  }

  /* mark cards for animation only after JS is running
     (avoids invisible cards if observer never fires) */
  cards.forEach(function (card, i) {
    card.classList.add('will-animate');
    /* stagger: 0 / 0.1 / 0.2 s per column position */
    card.style.animationDelay = ((i % 3) * 0.1) + 's';
  });

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(function (card) { obs.observe(card); });
})();


/* ---- OPEN GIFT button -------------------------------------- */
function openGift() {
  var letter = document.getElementById('letter');

  /* Attempt to start music on this interaction.
     updateMusicButton fires automatically via the 'play' event listener. */
  var music = document.getElementById('bgMusic');
  if (music && music.paused) {
    music.play().catch(function () {});
  }

  if (letter) {
    letter.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


/* ---- REVEAL SURPRISE --------------------------------------- */
function revealSurprise() {
  var btn = document.getElementById('revealBtn');
  var msg = document.getElementById('surpriseMessage');
  if (!btn || !msg) return;

  btn.style.transition    = 'opacity 0.35s ease';
  btn.style.opacity       = '0';
  btn.style.pointerEvents = 'none';

  setTimeout(function () {
    btn.style.display = 'none';
    msg.classList.add('visible');
  }, 380);
}


/* ---- MUSIC PLAYER ------------------------------------------ */
(function initMusicPlayer() {
  var music  = document.getElementById('bgMusic');
  var toggle = document.getElementById('musicToggle');
  var icon   = document.getElementById('musicIcon');
  var label  = document.getElementById('musicLabel');

  /* Bail if any required element is missing */
  if (!music || !toggle || !icon || !label) return;

  /* Set volume once; loop is already set via the HTML attribute */
  music.volume = 0.5;

  /* ---- Update button to reflect actual audio state ---------- */
  function updateMusicButton() {
    if (music.paused) {
      icon.textContent  = '▶';
      label.textContent = 'Play music';
      toggle.setAttribute('aria-label', 'Play music');
    } else {
      icon.textContent  = '⏸';
      label.textContent = 'Pause music';
      toggle.setAttribute('aria-label', 'Pause music');
    }
  }

  /* Keep button in sync whenever audio state changes */
  music.addEventListener('play',  updateMusicButton);
  music.addEventListener('pause', updateMusicButton);

  /* Set correct initial button state before any playback */
  updateMusicButton();

  /* ---- Manual toggle ---------------------------------------- */
  toggle.addEventListener('click', function () {
    if (music.paused) {
      music.play().catch(function () {});
    } else {
      music.pause();
    }
  });

  /* Music starts only when the visitor clicks "Open Your Gift".
     openGift() calls music.play(), which fires the 'play' event
     above and updates the button automatically. */

})();
