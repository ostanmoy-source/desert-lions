/* =============================================
   IRONFIELD FC — Main JavaScript
   ============================================= */

'use strict';

// ── NAVIGATION ──────────────────────────────
const navToggle = document.querySelector('.nav__toggle');
const navMobile = document.querySelector('.nav__mobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMobile.contains(e.target)) {
      navMobile.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    }
  });
}

// Highlight active page
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href')?.split('/').pop();
  if (href === currentPath) link.classList.add('nav__link--active');
});

// ── SCROLL TO TOP ────────────────────────────
const scrollBtn = document.querySelector('.scroll-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── DATA FETCHER ─────────────────────────────
async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Failed to load ${path}:`, err);
    return null;
  }
}

// ── DATE FORMATTER ───────────────────────────
function formatDate(str) {
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}
function formatDateShort(str) {
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ── HOME PAGE ────────────────────────────────
async function initHome() {
  const [fixtures, news] = await Promise.all([
    fetchJSON('data/fixtures.json'),
    fetchJSON('data/news.json')
  ]);

  // Next Match
  if (fixtures?.upcoming?.length) {
    const m = fixtures.upcoming[0];
    const card = document.getElementById('next-match');
    if (card) {
      card.innerHTML = `
        <div class="match-meta"><strong>${m.competition}</strong> &nbsp;·&nbsp; ${formatDate(m.date)} at ${m.time}</div>
        <div class="match-teams">
          <span class="match-team">${m.home}</span>
          <span class="match-vs">vs</span>
          <span class="match-team">${m.away}</span>
        </div>
        <div class="match-meta">📍 ${m.venue}</div>
      `;
    }
  }

  // Latest News
  if (news?.length) {
    const container = document.getElementById('latest-news');
    if (container) {
      container.innerHTML = news.slice(0, 3).map(n => `
        <article class="news-card">
          <img class="news-card__img" src="${n.image}" alt="${n.title}" loading="lazy">
          <div class="news-card__body">
            <div class="news-card__category">${n.category}</div>
            <h3 class="news-card__title"><a href="pages/news.html#${n.id}">${n.title}</a></h3>
            <p class="news-card__excerpt">${n.excerpt}</p>
            <div class="news-card__meta">${formatDate(n.date)} · ${n.author}</div>
          </div>
        </article>
      `).join('');
    }
  }
}

// ── FIXTURES PAGE ────────────────────────────
async function initFixtures() {
  const data = await fetchJSON('../data/fixtures.json');
  if (!data) return;

  const upcomingEl = document.getElementById('upcoming-fixtures');
  if (upcomingEl) {
    if (data.upcoming.length === 0) {
      upcomingEl.innerHTML = '<p style="color:var(--text-muted)">No upcoming fixtures scheduled.</p>';
    } else {
      upcomingEl.innerHTML = data.upcoming.map(m => `
        <div class="fixture-item ${m.isHome ? 'fixture-item--home' : ''}">
          <div class="fixture-date">
            <strong>${formatDateShort(m.date)}</strong>
            ${m.time}
          </div>
          <div>
            <div class="fixture-teams">${m.home} <span class="vs">vs</span> ${m.away}</div>
            <div class="fixture-comp">${m.competition} · ${m.isHome ? 'Home' : 'Away'} · ${m.venue}</div>
          </div>
          <div></div>
        </div>
      `).join('');
    }
  }

  const pastEl = document.getElementById('past-fixtures');
  if (pastEl) {
    if (data.results.length === 0) {
      pastEl.innerHTML = '<p style="color:var(--text-muted)">No results yet.</p>';
    } else {
      pastEl.innerHTML = data.results.map(m => {
        const ironWin = (m.isHome && m.homeScore > m.awayScore) || (!m.isHome && m.awayScore > m.homeScore);
        const draw = m.homeScore === m.awayScore;
        const cls = draw ? 'fixture-score--draw' : ironWin ? 'fixture-score--win' : 'fixture-score--loss';
        return `
          <div class="fixture-item ${m.isHome ? 'fixture-item--home' : ''}">
            <div class="fixture-date">
              <strong>${formatDateShort(m.date)}</strong>
            </div>
            <div>
              <div class="fixture-teams">${m.home} <span class="vs">vs</span> ${m.away}</div>
              <div class="fixture-comp">${m.competition} · ${m.isHome ? 'Home' : 'Away'}</div>
              ${m.report ? `<details style="margin-top:0.5rem"><summary style="font-size:0.8rem;cursor:pointer;color:var(--green)">Match report</summary><p style="font-size:0.85rem;margin-top:0.5rem;color:var(--text-muted)">${m.report}</p></details>` : ''}
            </div>
            <div class="fixture-score ${cls}">${m.homeScore}–${m.awayScore}</div>
          </div>
        `;
      }).join('');
    }
  }
}

// ── STANDINGS PAGE ───────────────────────────
async function initStandings() {
  const data = await fetchJSON('../data/standings.json');
  if (!data) return;

  const info = document.getElementById('standings-info');
  if (info) info.textContent = `${data.competition} · ${data.season} · Updated ${formatDate(data.lastUpdated)}`;

  const tbody = document.getElementById('standings-body');
  if (tbody) {
    tbody.innerHTML = data.table.map(row => `
      <tr class="${row.highlight ? 'highlight' : ''}">
        <td>${row.pos}</td>
        <td>${row.team}</td>
        <td>${row.p}</td>
        <td>${row.w}</td>
        <td>${row.d}</td>
        <td>${row.l}</td>
        <td>${row.gf}</td>
        <td>${row.ga}</td>
        <td>${row.gd > 0 ? '+' : ''}${row.gd}</td>
        <td><strong>${row.pts}</strong></td>
      </tr>
    `).join('');
  }
}

// ── TEAM PAGE ────────────────────────────────
async function initTeam() {
  const players = await fetchJSON('../data/players.json');
  if (!players) return;

  const grid = document.getElementById('players-grid');
  const modal = document.getElementById('player-modal');
  if (!grid) return;

  function renderCards(list) {
    grid.innerHTML = list.map(p => `
      <div class="player-card" data-id="${p.id}" tabindex="0" role="button" aria-label="View ${p.name} profile">
        <div class="player-card__img-wrap">
          <img class="player-card__img" src="${p.photo}" alt="${p.name}" loading="lazy">
          <span class="player-card__number">${p.number}</span>
          ${p.captain ? '<span class="player-card__captain-badge">Captain</span>' : ''}
        </div>
        <div class="player-card__body">
          <div class="player-card__position">${p.position}</div>
          <h3 class="player-card__name">${p.name}</h3>
          <div class="player-card__stats">
            <div class="player-stat"><strong>${p.stats.appearances}</strong> Apps</div>
            ${p.stats.goals !== undefined ? `<div class="player-stat"><strong>${p.stats.goals}</strong> Goals</div>` : ''}
            ${p.stats.assists !== undefined ? `<div class="player-stat"><strong>${p.stats.assists}</strong> Assists</div>` : ''}
            ${p.stats.cleanSheets !== undefined ? `<div class="player-stat"><strong>${p.stats.cleanSheets}</strong> Clean Sheets</div>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Attach events
    grid.querySelectorAll('.player-card').forEach(card => {
      const openModal = () => {
        const id = parseInt(card.dataset.id);
        const p = players.find(x => x.id === id);
        if (!p || !modal) return;
        modal.querySelector('.modal__img').src = p.photo;
        modal.querySelector('.modal__img').alt = p.name;
        modal.querySelector('.modal__title').textContent = p.name;
        modal.querySelector('.modal__pos').textContent = `#${p.number} · ${p.position}`;
        modal.querySelector('.modal__bio').textContent = p.bio;
        const statsEl = modal.querySelector('.modal__stats');
        statsEl.innerHTML = Object.entries(p.stats).map(([k, v]) => `
          <div class="modal__stat">
            <div class="modal__stat-val">${v}</div>
            <div class="modal__stat-label">${k.replace(/([A-Z])/g, ' $1').trim()}</div>
          </div>
        `).join('');
        modal.parentElement.classList.add('open');
        modal.parentElement.focus();
      };
      card.addEventListener('click', openModal);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); } });
    });
  }

  renderCards(players);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      const pos = btn.dataset.pos;
      renderCards(pos === 'all' ? players : players.filter(p => p.position === pos));
    });
  });

  // Modal close
  if (modal) {
    const overlay = modal.parentElement;
    modal.querySelector('.modal__close').addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') overlay.classList.remove('open'); });
  }
}

// ── NEWS PAGE ────────────────────────────────
async function initNews() {
  const news = await fetchJSON('../data/news.json');
  if (!news) return;

  const container = document.getElementById('news-list');
  if (!container) return;

  container.innerHTML = news.map(n => `
    <article class="news-card" id="${n.id}">
      <img class="news-card__img" src="${n.image}" alt="${n.title}" loading="lazy">
      <div class="news-card__body">
        <div class="news-card__category">${n.category}</div>
        <h2 class="news-card__title">${n.title}</h2>
        <p class="news-card__meta">${formatDate(n.date)} · ${n.author}</p>
        <div style="margin-top:1rem;font-size:0.95rem;color:var(--text-muted);line-height:1.8">${n.content}</div>
      </div>
    </article>
  `).join('');

  // Scroll to hash
  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  }
}

// ── GALLERY PAGE ─────────────────────────────
async function initGallery() {
  const gallery = await fetchJSON('../data/gallery.json');
  if (!gallery) return;

  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = gallery.map((item, i) => `
    <div class="gallery-item" data-index="${i}" tabindex="0" role="button" aria-label="${item.caption}">
      <img src="${item.thumb}" alt="${item.caption}" loading="lazy">
      <div class="gallery-item__overlay">
        <p class="gallery-item__caption">${item.caption}</p>
      </div>
    </div>
  `).join('');

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  let currentIdx = 0;

  function openLightbox(idx) {
    currentIdx = idx;
    const item = gallery[idx];
    lbImg.src = item.src;
    lbImg.alt = item.caption;
    lbCaption.textContent = item.caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function navigate(dir) {
    currentIdx = (currentIdx + dir + gallery.length) % gallery.length;
    openLightbox(currentIdx);
  }

  grid.querySelectorAll('.gallery-item').forEach(item => {
    const openFn = () => openLightbox(parseInt(item.dataset.index));
    item.addEventListener('click', openFn);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFn(); } });
  });

  if (lightbox) {
    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', () => navigate(-1));
    document.getElementById('lb-next').addEventListener('click', () => navigate(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }
}

// ── SPONSORS PAGE ────────────────────────────
async function initSponsors() {
  const sponsors = await fetchJSON('../data/sponsors.json');
  if (!sponsors) return;
  const grid = document.getElementById('sponsors-grid');
  if (!grid) return;
  grid.innerHTML = sponsors.map(s => `
    <a class="sponsor-card" href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.name}">
      <div class="sponsor-tier">${s.tier} Sponsor</div>
      <img src="${s.logo}" alt="${s.name} logo">
      <div class="sponsor-card__name">${s.name}</div>
      <p class="sponsor-card__blurb">${s.blurb}</p>
    </a>
  `).join('');
}

// ── FORM HANDLING ────────────────────────────
function initForms() {
  document.querySelectorAll('[data-formspree]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const msgEl = form.querySelector('.form-msg');
      btn.disabled = true;
      btn.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          if (msgEl) { msgEl.className = 'form-msg form-msg--success'; msgEl.textContent = 'Message sent! We\'ll be in touch soon.'; }
        } else {
          throw new Error('Server error');
        }
      } catch {
        if (msgEl) { msgEl.className = 'form-msg form-msg--error'; msgEl.textContent = 'Something went wrong. Please email us directly.'; }
      }
      btn.disabled = false;
      btn.textContent = 'Send Message';
    });
  });
}

// ── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  initForms();
  switch(page) {
    case 'home':     initHome(); break;
    case 'fixtures': initFixtures(); break;
    case 'standings':initStandings(); break;
    case 'team':     initTeam(); break;
    case 'news':     initNews(); break;
    case 'gallery':  initGallery(); break;
    case 'sponsors': initSponsors(); break;
  }
});
