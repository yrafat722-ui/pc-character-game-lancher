/*
 * Live game catalog synchronization for the desktop launcher.
 * Only game data is read from the website. Cards are rebuilt with the
 * launcher's existing CSS classes, so remote website layout changes do not
 * control the desktop app's interface.
 */
(() => {
  'use strict';
  const SITE_URL = 'https://pccharactergame.netlify.app/';

  function absoluteAssetUrl(value) {
    if (!value) return '';
    try { return new URL(value, SITE_URL).href; }
    catch { return ''; }
  }

  function readGame(sourceCard) {
    const title = sourceCard.querySelector('.game-info h3, h3');
    const image = sourceCard.querySelector('img');
    const category = sourceCard.querySelector('.meta span');
    const rating = sourceCard.querySelector('.meta b');
    const description = sourceCard.querySelector('.game-info p, p');
    const link = sourceCard.querySelector('.game-info a.download, a.download, a[href]');
    if (!title || !title.textContent.trim()) return null;

    const rawHref = link?.getAttribute('href') || '#games';
    let href = rawHref;
    if (!rawHref.startsWith('#') && !rawHref.startsWith('javascript:')) {
      href = absoluteAssetUrl(rawHref) || '#games';
    }
    return {
      title: title.textContent.trim(),
      image: absoluteAssetUrl(image?.getAttribute('src')),
      alt: image?.getAttribute('alt') || title.textContent.trim(),
      category: category?.textContent.trim() || '',
      rating: rating?.textContent.trim() || '',
      description: description?.textContent.trim() || '',
      href,
      download: Boolean(link?.hasAttribute('download')),
      search: sourceCard.getAttribute('data-search') || title.textContent.trim()
    };
  }

  function buildGameCard(game) {
    const card = document.createElement('article');
    card.className = 'game';
    card.dataset.search = game.search;

    if (game.image) {
      const image = document.createElement('img');
      image.src = game.image;
      image.alt = game.alt;
      image.loading = 'lazy';
      card.appendChild(image);
    }

    const info = document.createElement('div');
    info.className = 'game-info';
    const title = document.createElement('h3');
    title.textContent = game.title;
    info.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const category = document.createElement('span');
    category.textContent = game.category;
    const rating = document.createElement('b');
    rating.textContent = game.rating;
    if (game.category) meta.appendChild(category);
    if (game.rating) meta.appendChild(rating);
    if (meta.childElementCount) info.appendChild(meta);

    if (game.description) {
      const description = document.createElement('p');
      description.textContent = game.description;
      info.appendChild(description);
    }

    const button = document.createElement('a');
    button.className = 'download';
    button.href = game.href;
    button.textContent = game.download ? 'تحميل　⇩' : 'التفاصيل　➜';
    if (game.download) button.setAttribute('download', '');
    if (/^https?:\/\//i.test(game.href)) {
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
    }
    info.appendChild(button);
    card.appendChild(info);
    return card;
  }

  async function syncGames() {
    const grid = document.querySelector('.games-grid');
    if (!grid || !window.pcgLauncher?.fetchGameCatalog) return;

    try {
      const html = await window.pcgLauncher.fetchGameCatalog();
      const remoteDocument = new DOMParser().parseFromString(html, 'text/html');
      const sourceCards = remoteDocument.querySelectorAll('.games-grid .game, #games .game');
      const games = Array.from(sourceCards, readGame).filter(Boolean);
      if (!games.length) throw new Error('The website did not return any game cards.');

      const fragment = document.createDocumentFragment();
      games.forEach(game => fragment.appendChild(buildGameCard(game)));
      grid.replaceChildren(fragment);
      console.info(`[PC Character Games] Synced ${games.length} games from the official website.`);
    } catch (error) {
      // Keep the launcher's bundled cards available if the site is offline.
      console.warn('[PC Character Games] Live game sync failed; using bundled game cards.', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncGames, { once: true });
  } else {
    syncGames();
  }
})();
