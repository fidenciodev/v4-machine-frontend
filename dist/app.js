(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escape = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const normalize = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  const icon = (name, attributes = '') => {
    const paths = {
      arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
      right: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
      close: '<path d="m6 6 12 12M6 18 18 6"/>',
      heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
      whatsapp: '<path d="M21 11.6a9 9 0 0 1-13.4 7.8L3 21l1.5-4.6A9 9 0 1 1 21 11.6Z"/><path d="M8 8.1c.3 3.4 2.6 5.7 6 6l1.2-1.3-2-1-1 1c-1.3-.6-2.1-1.4-2.7-2.7l1-1-1-2Z"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
      gauge: '<path d="M4 18a9 9 0 1 1 16 0H4Z"/><path d="m12 14 4-5M7 8l1 1M5 13h2m10 0h2M11 5h2"/>',
      gear: '<path d="M6 4v16M18 4v7M6 11h12M12 4v16"/><circle cx="6" cy="4" r="1"/><circle cx="12" cy="20" r="1"/><circle cx="18" cy="4" r="1"/>',
    };
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${attributes}>${paths[name] || paths.arrow}</svg>`;
  };

  let stock = [];
  let phone = '';
  let demo = false;
  let visibleCount = 6;
  let category = 'all';
  let favoritesOnly = false;
  let favoriteIds = new Set();
  let toastTimeout;
  const favoritesKey = 'v4machine-favorites-v1';

  try {
    const saved = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    if (Array.isArray(saved)) favoriteIds = new Set(saved.filter((id) => typeof id === 'string' || typeof id === 'number').map(String));
  } catch { /* Browsers with storage disabled can still use favorites for this visit. */ }

  function toast(message) {
    let element = $('.toast');
    if (!element) {
      element = document.createElement('div');
      element.className = 'toast';
      element.setAttribute('role', 'status');
      element.setAttribute('aria-live', 'polite');
      document.body.append(element);
    }
    clearTimeout(toastTimeout);
    element.innerHTML = `${icon('check')}<span>${escape(message)}</span>`;
    element.classList.add('is-visible');
    toastTimeout = setTimeout(() => element.classList.remove('is-visible'), 2800);
  }

  function persistFavorites() {
    try { localStorage.setItem(favoritesKey, JSON.stringify([...favoriteIds])); } catch { /* Session favorites remain available. */ }
  }

  function whatsappLink(message) {
    return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : '';
  }

  function vehicleName(car) {
    return `${car.brand} ${car.model}`.trim();
  }

  function kilometers(car) {
    if (typeof car.km === 'number') return `${new Intl.NumberFormat('pt-BR').format(car.km)} km`;
    return car.km ? String(car.km) : 'Consulte';
  }

  function carPrice(car) {
    return Number(car.price) > 0 ? money(Number(car.price)) : 'Sob consulta';
  }

  function card(car, index) {
    const isFavorite = favoriteIds.has(String(car.id));
    const name = vehicleName(car);
    const label = car.tag || (demo ? 'Referência visual' : car.featured ? 'Seleção V4' : 'Disponível');
    return `<article class="vehicle-card" style="--card-index:${index % 3}">
      <div class="vehicle-media">
        <button class="vehicle-image-button" type="button" data-open-vehicle="${escape(car.id)}" aria-label="Conhecer ${escape(name)}">
          <img class="vehicle-img" src="${escape(car.image)}" alt="${escape(name)} ${escape(car.year)}" width="720" height="480" loading="lazy" decoding="async">
        </button>
        <span class="vehicle-tag">${escape(label)}</span>
        <button class="favorite-button${isFavorite ? ' is-favorite' : ''}" type="button" data-favorite="${escape(car.id)}" aria-pressed="${isFavorite}" aria-label="${isFavorite ? 'Remover' : 'Adicionar'} ${escape(name)} ${isFavorite ? 'dos' : 'aos'} favoritos">${icon('heart')}</button>
      </div>
      <div class="vehicle-body">
        <p class="vehicle-brand">${escape(car.brand)}</p>
        <h3 class="vehicle-title">${escape(car.model)}</h3>
        <p class="vehicle-version">${escape(car.version || '')}</p>
        <div class="vehicle-specs">
          <span>${icon('calendar')}<span>${escape(car.year || 'Consulte')}</span></span>
          <span>${icon('gauge')}<span>${escape(kilometers(car))}</span></span>
          <span>${icon('gear')}<span>${escape(car.transmission || 'Consulte')}</span></span>
        </div>
        <div class="vehicle-price-row">
          <strong class="vehicle-price">${demo && Number(car.price) > 0 ? '<small>Valor ilustrativo</small>' : ''}${escape(carPrice(car))}</strong>
          <button class="vehicle-details" type="button" data-open-vehicle="${escape(car.id)}" aria-label="Ver detalhes de ${escape(name)}">${icon('arrow')}</button>
        </div>
      </div>
    </article>`;
  }

  function matchingStock() {
    const query = normalize($('#search-input')?.value.trim() || '');
    const brand = $('#brand-filter')?.value || '';
    const priceLimit = Number($('#price-filter')?.value || 0);
    return stock.filter((car) => {
      const searchable = normalize(`${car.brand} ${car.model} ${car.version} ${car.year} ${car.category}`);
      return (!query || query.split(/\s+/).every((word) => searchable.includes(word)))
        && (!brand || car.brand === brand)
        && (!priceLimit || (Number(car.price) > 0 && Number(car.price) <= priceLimit))
        && (category === 'all' || car.category === category)
        && (!favoritesOnly || favoriteIds.has(String(car.id)));
    });
  }

  function render() {
    const grid = $('#inventory-grid');
    if (!grid) return;
    const filtered = matchingStock();
    grid.innerHTML = filtered.slice(0, visibleCount).map(card).join('');
    const count = $('#inventory-count');
    if (count) count.textContent = `${filtered.length} ${demo ? filtered.length === 1 ? 'modelo para explorar' : 'modelos para explorar' : filtered.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}`;
    const empty = $('#empty-state');
    if (empty) empty.hidden = filtered.length > 0;
    const more = $('#load-more');
    if (more) {
      more.hidden = visibleCount >= filtered.length;
      more.setAttribute('aria-label', `Mostrar mais ${Math.min(6, filtered.length - visibleCount)} veículos`);
    }
    const favoritesButton = $('#favorites-toggle');
    if (favoritesButton) {
      favoritesButton.setAttribute('aria-pressed', String(favoritesOnly));
      favoritesButton.classList.toggle('is-active', favoritesOnly);
      const countElement = $('[data-favorites-count]', favoritesButton);
      if (countElement) countElement.textContent = String(favoriteIds.size);
      favoritesButton.setAttribute('aria-label', `${favoritesOnly ? 'Exibir todos os veículos' : 'Exibir favoritos'} (${favoriteIds.size})`);
    }
    $$('[data-category]').forEach((button) => {
      const selected = button.dataset.category === category;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function filterChanged() {
    visibleCount = 6;
    render();
  }

  function scrollTo(selector) {
    const target = $(selector);
    if (!target) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function clearFilters() {
    ['#search-input', '#brand-filter', '#price-filter'].forEach((selector) => {
      const input = $(selector);
      if (input) input.value = '';
    });
    category = 'all';
    favoritesOnly = false;
    filterChanged();
  }

  function toggleFavorite(id) {
    const car = stock.find((item) => String(item.id) === String(id));
    if (!car) return;
    const key = String(car.id);
    const wasFavorite = favoriteIds.has(key);
    if (wasFavorite) favoriteIds.delete(key); else favoriteIds.add(key);
    persistFavorites();
    if (favoritesOnly) {
      render();
    } else {
      $$('[data-favorite]').filter((button) => button.dataset.favorite === key).forEach((button) => {
        button.classList.toggle('is-favorite', !wasFavorite);
        button.setAttribute('aria-pressed', String(!wasFavorite));
        button.setAttribute('aria-label', `${wasFavorite ? 'Adicionar' : 'Remover'} ${vehicleName(car)} ${wasFavorite ? 'aos' : 'dos'} favoritos`);
      });
      const count = $('[data-favorites-count]');
      if (count) count.textContent = String(favoriteIds.size);
      const button = $('#favorites-toggle');
      if (button) button.setAttribute('aria-label', `Exibir favoritos (${favoriteIds.size})`);
    }
    toast(wasFavorite ? 'Veículo removido dos favoritos.' : 'Veículo salvo nos seus favoritos.');
  }

  function openDialog(className, content, labelledBy) {
    const activeElement = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.className = className;
    dialog.setAttribute('aria-labelledby', labelledBy);
    dialog.innerHTML = `<div class="dialog-shell"><button type="button" class="dialog-close" aria-label="Fechar janela">${icon('close')}</button>${content}</div>`;
    document.body.append(dialog);
    document.documentElement.classList.add('dialog-open');
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      dialog.remove();
      if (!$('dialog[open]')) document.documentElement.classList.remove('dialog-open');
      if (activeElement instanceof HTMLElement && activeElement.isConnected) activeElement.focus({ preventScroll: true });
    }, { once: true });
    dialog.showModal();
    return dialog;
  }

  function openVehicle(id) {
    const car = stock.find((item) => String(item.id) === String(id));
    if (!car) return;
    const name = vehicleName(car);
    const images = [...new Set([car.image, ...(car.images || [])].filter(Boolean))];
    const message = demo
      ? `Olá, V4 Machines! Gostaria de conhecer o estoque atual e conversar sobre modelos como o ${name}, que vi na proposta visual do site.`
      : `Olá, V4 Machines! Tenho interesse no ${name} ${car.version || ''}, ${car.year || ''}, anunciado por ${carPrice(car)}. Gostaria de saber mais.`;
    const specs = [['Ano', car.year], ['Quilometragem', kilometers(car)], ['Câmbio', car.transmission], ['Combustível', car.fuel], ['Carroceria', ({ suv: 'SUV', sedan: 'Sedã', hatch: 'Hatch', picape: 'Picape', esportivo: 'Esportivo' })[car.category]], ['Marca', car.brand]];
    const dialog = openDialog('vehicle-dialog', `
      <div class="dialog-gallery">
        <img class="gallery-main" src="${escape(images[0])}" alt="${escape(name)} — foto 1" width="1000" height="750">
        ${images.length > 1 ? `<div class="gallery-thumbs" aria-label="Fotos do veículo">${images.map((src, index) => `<button type="button" data-gallery-index="${index}" aria-label="Ver foto ${index + 1} de ${escape(name)}" aria-current="${index === 0 ? 'true' : 'false'}"><img src="${escape(src)}" alt="" width="120" height="90" loading="lazy"></button>`).join('')}</div>` : ''}
      </div>
      <div class="dialog-content">
        <p class="dialog-eyebrow">${escape(car.brand)} · SELEÇÃO V4 MACHINES</p>
        <h2 id="vehicle-dialog-title" class="dialog-title" tabindex="-1">${escape(car.model)}</h2>
        <p class="dialog-version">${escape(car.version || '')}</p>
        <p class="dialog-price">${escape(carPrice(car))}</p>
        <dl class="dialog-specs">${specs.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value || 'Consulte')}</dd></div>`).join('')}</dl>
        <div class="dialog-actions">
          ${phone ? `<a class="button button-primary" href="${escape(whatsappLink(message))}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')} Tenho interesse ${icon('arrow')}</a>` : '<button class="button button-primary" type="button" data-contact="Atendimento">Consultar disponibilidade</button>'}
          <button class="button button-secondary" type="button" data-vehicle-consult="${escape(car.id)}">Quero oferecer meu carro na troca ${icon('right')}</button>
        </div>
        <p class="dialog-note">${demo ? 'Veículo e valor ilustrativos. Consulte o estoque e as condições atuais com a loja.' : 'Consulte a disponibilidade, os detalhes e as condições atualizadas com a equipe V4 Machines.'}</p>
      </div>`, 'vehicle-dialog-title');
    $$('[data-gallery-index]', dialog).forEach((button) => button.addEventListener('click', () => {
      const index = Number(button.dataset.galleryIndex);
      const mainImage = $('.gallery-main', dialog);
      mainImage.src = images[index];
      mainImage.alt = `${name} — foto ${index + 1}`;
      $$('[data-gallery-index]', dialog).forEach((item) => item.setAttribute('aria-current', String(item === button)));
    }));
    $('[data-vehicle-consult]', dialog)?.addEventListener('click', () => {
      dialog.close();
      openContact('Troca', car);
    });
    $('#vehicle-dialog-title', dialog).focus({ preventScroll: true });
  }

  function openContact(interest = 'Atendimento', car = null) {
    const descriptions = {
      Financiamento: ['O próximo passo é seu.', 'Converse com a equipe para conhecer as possibilidades de financiamento para o seu próximo carro.'],
      Troca: ['Um novo capítulo começa aqui.', 'Conte um pouco sobre seu veículo. A equipe V4 Machines te ajuda a encontrar o próximo.'],
      Atendimento: ['Vamos encontrar seu próximo carro?', 'Um atendimento próximo, do primeiro contato à próxima conquista.'],
    };
    const [title, description] = descriptions[interest] || descriptions.Atendimento;
    const defaultMessage = car ? demo
      ? `Gostaria de conhecer o estoque atual e conversar sobre modelos como o ${vehicleName(car)}. Também gostaria de oferecer meu carro na troca.`
      : `Tenho interesse no ${vehicleName(car)} ${car.year || ''} e gostaria de oferecer meu carro na troca.` : '';
    const dialog = openDialog('contact-dialog', `<div class="dialog-content">
      <p class="dialog-eyebrow">CONVERSE COM A V4 MACHINES</p>
      <h2 id="contact-dialog-title" class="dialog-title">${escape(title)}</h2>
      <p class="dialog-intro">${escape(description)}</p>
      <form class="contact-form">
        <div class="form-field"><label for="contact-name">Como podemos te chamar?</label><input id="contact-name" name="name" type="text" autocomplete="name" placeholder="Seu nome" minlength="2" maxlength="100" required></div>
        <div class="form-field"><label for="contact-interest">Sobre o que vamos conversar?</label><select id="contact-interest" name="interest">${['Atendimento', 'Financiamento', 'Troca'].map((option) => `<option value="${option}"${interest === option ? ' selected' : ''}>${({ Atendimento: 'Encontrar meu próximo carro', Financiamento: 'Conhecer opções de financiamento', Troca: 'Oferecer meu carro na troca' })[option]}</option>`).join('')}</select></div>
        <div class="form-field"><label for="contact-message">Conte um pouco mais <span>(opcional)</span></label><textarea id="contact-message" name="message" rows="3" maxlength="1500" placeholder="Qual carro está nos seus planos?">${escape(defaultMessage)}</textarea></div>
        <button class="button button-primary" type="submit"${phone ? '' : ' disabled'}>${icon('whatsapp')} Continuar no WhatsApp ${icon('arrow')}</button>
        <p class="dialog-note">${phone ? 'Você será direcionado ao WhatsApp da loja para continuar a conversa.' : 'O contato da loja está temporariamente indisponível. Tente novamente em instantes.'}</p>
      </form>
    </div>`, 'contact-dialog-title');
    $('.contact-form', dialog).addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity() || !phone) return;
      const formData = new FormData(form);
      const name = String(formData.get('name')).trim();
      const subject = String(formData.get('interest'));
      const details = String(formData.get('message')).trim();
      const text = `Olá, V4 Machines! Meu nome é ${name}. ${subject === 'Financiamento' ? 'Gostaria de conhecer o estoque atual e as opções de financiamento.' : subject === 'Troca' ? 'Gostaria de conhecer o estoque atual e oferecer meu carro na troca.' : 'Gostaria de conhecer o estoque atual e encontrar meu próximo carro.'}${details ? `\n\n${details}` : ''}`;
      window.open(whatsappLink(text), '_blank', 'noopener,noreferrer');
    });
  }

  function setupMobileMenu() {
    const toggle = $('#mobile-menu-toggle');
    const menu = $('#mobile-menu');
    if (!toggle || !menu) return;
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      menu.hidden = true;
    };
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(expanded));
      menu.classList.toggle('is-open', expanded);
      menu.hidden = !expanded;
    });
    $$('a, [data-contact]', menu).forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) { close(); toggle.focus(); }
    });
    const desktop = window.matchMedia('(min-width: 901px)');
    desktop.addEventListener('change', (event) => { if (event.matches) close(); });
  }

  function setupReveals() {
    const elements = $$('[data-reveal]');
    document.documentElement.classList.add('motion-ready');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
  }

  function wireEvents() {
    $('#search-input')?.addEventListener('input', filterChanged);
    const submitSearch = () => { filterChanged(); scrollTo('#inventory-grid'); };
    $('#search-submit')?.addEventListener('click', submitSearch);
    $('#search-input')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); submitSearch(); }
    });
    $('#brand-filter')?.addEventListener('change', filterChanged);
    $('#price-filter')?.addEventListener('change', filterChanged);
    $('#reset-filters')?.addEventListener('click', clearFilters);
    $('#favorites-toggle')?.addEventListener('click', () => {
      favoritesOnly = !favoritesOnly;
      filterChanged();
      scrollTo('#veiculos');
    });
    $('#load-more')?.addEventListener('click', () => {
      const previousCount = visibleCount;
      visibleCount += 6;
      render();
      const nextCard = $$('.vehicle-card')[previousCount];
      if (nextCard) $('button', nextCard)?.focus({ preventScroll: true });
    });
    $$('[data-category]').forEach((button) => button.addEventListener('click', () => { category = button.dataset.category; filterChanged(); }));
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const favorite = target?.closest('[data-favorite]');
      const vehicle = target?.closest('[data-open-vehicle]');
      const contact = target?.closest('[data-contact]');
      if (favorite) toggleFavorite(favorite.dataset.favorite);
      else if (vehicle) openVehicle(vehicle.dataset.openVehicle);
      else if (contact) { event.preventDefault(); openContact(contact.dataset.contact); }
    });
    window.addEventListener('storage', (event) => {
      if (event.key !== favoritesKey) return;
      try {
        const stored = JSON.parse(event.newValue || '[]');
        if (Array.isArray(stored)) { favoriteIds = new Set(stored.map(String)); render(); }
      } catch { /* Ignore malformed cross-tab storage. */ }
    });
    setupMobileMenu();
    setupReveals();
  }

  async function init() {
    const year = $('#current-year');
    if (year) year.textContent = String(new Date().getFullYear());
    wireEvents();
    try {
      const response = await fetch('./data/stock.json');
      if (!response.ok) throw new Error(`Stock request returned ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.cars)) throw new Error('Invalid inventory data');
      stock = data.cars.filter((car) => car && car.id != null && car.model && car.image);
      phone = String(data.whatsapp || '').replace(/\D/g, '');
      demo = data.demo === true;
      const brandFilter = $('#brand-filter');
      if (brandFilter) {
        const brands = [...new Set(stock.map((car) => car.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
        brandFilter.innerHTML = `<option value="">Todas as marcas</option>${brands.map((brand) => `<option value="${escape(brand)}">${escape(brand)}</option>`).join('')}`;
      }
      if (phone) $$('[data-whatsapp]').forEach((link) => {
        link.href = whatsappLink(link.dataset.whatsapp || 'Olá, V4 Machines! Gostaria de conhecer o estoque atual.');
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      });
      render();
      $('#inventory-grid')?.setAttribute('aria-busy', 'false');
    } catch (error) {
      const grid = $('#inventory-grid');
      if (grid) {
        grid.setAttribute('aria-busy', 'false');
        grid.innerHTML = '<div class="inventory-error" role="status"><h3>O estoque não carregou por aqui.</h3><p>Atualize a página ou fale com a equipe para consultar os veículos disponíveis.</p><button class="button button-secondary" type="button" id="retry-stock">Tentar novamente</button></div>';
        $('#retry-stock')?.addEventListener('click', () => window.location.reload());
      }
      const count = $('#inventory-count');
      if (count) count.textContent = 'Estoque temporariamente indisponível';
      const loadMore = $('#load-more');
      if (loadMore) loadMore.hidden = true;
      console.error('Não foi possível carregar o estoque V4 Machines:', error);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
