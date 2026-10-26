import { animate, hover, inView, scroll, stagger } from 'motion';

export function setupExperience() {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector<HTMLElement>('.site-header');
  const progressBar = document.querySelector<HTMLElement>('.reading-progress-bar');
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.desktop-nav a[href^="#"]'));
  const ease: [number, number, number, number] = [.22, 1, .36, 1];
  const cleanups: Array<() => void> = [];
  let clearMotion = () => {};

  cleanups.push(scroll(progress => {
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  }));

  if ('IntersectionObserver' in window) {
    const activeSections = new Map<string, number>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activeSections.set(entry.target.id, entry.intersectionRatio);
        else activeSections.delete(entry.target.id);
      });
      const active = [...activeSections].sort((a, b) => b[1] - a[1])[0]?.[0];
      links.forEach(link => {
        const current = link.hash === `#${active}`;
        link.classList.toggle('is-current', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -50% 0px', threshold: [0, .1, .3] });
    links.forEach(link => {
      const section = document.getElementById(link.hash.slice(1));
      if (section) observer.observe(section);
    });
    cleanups.push(() => observer.disconnect());
  }

  function mountMotion() {
    clearMotion();
    if (preference.matches || !('IntersectionObserver' in window)) return;

    const animations = new Set<ReturnType<typeof animate>>();
    const stops: Array<() => void> = [];
    const track = (animation: ReturnType<typeof animate>) => {
      animations.add(animation);
      void animation.then(() => { animations.delete(animation); });
      return animation;
    };
    const heroLines = Array.from(document.querySelectorAll<HTMLElement>('.hero-line'));
    const heroDetails = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-detail]'));
    if (heroLines.length) track(animate(heroLines, {
      opacity: [0, 1], y: [30, 0], filter: ['blur(7px)', 'blur(0px)'],
    }, { duration: .85, delay: stagger(.1, { startDelay: .06 }), ease }));
    if (heroDetails.length) track(animate(heroDetails, {
      opacity: [0, 1], y: [16, 0],
    }, { duration: .65, delay: stagger(.09, { startDelay: .34 }), ease }));

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    stops.push(inView(revealElements, element => {
      track(animate(element, { opacity: [0, 1], y: [22, 0] }, { duration: .7, ease }));
    }, { margin: '0px 0px -40px 0px' }));

    const hero = document.querySelector<HTMLElement>('.hero');
    const heroImage = document.querySelector<HTMLImageElement>('.hero-visual img');
    if (hero && heroImage && finePointer.matches && window.innerWidth > 900) {
      stops.push(scroll(track(animate(heroImage, { y: [0, 44] }, { ease: 'linear' })), {
        target: hero, offset: ['start start', 'end start'],
      }));
    }

    const seen = new WeakSet<Element>();
    let stopCardViews = () => {};
    let stopCardHover = () => {};
    const mountCards = () => {
      stopCardViews();
      stopCardHover();
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.vehicle-card'));
      stopCardViews = inView(cards, element => {
        if (seen.has(element)) return;
        seen.add(element);
        const index = cards.indexOf(element as HTMLElement);
        track(animate(element, { opacity: [0, 1], y: [18, 0] }, {
          duration: .55, delay: (index % (window.innerWidth < 641 ? 1 : 3)) * .065, ease,
        }));
      }, { margin: '0px 0px -20px 0px' });
      if (finePointer.matches) stopCardHover = hover(cards, element => {
        track(animate(element, { y: -5 }, { type: 'spring', stiffness: 250, damping: 24 }));
        return () => { track(animate(element, { y: 0 }, { type: 'spring', stiffness: 250, damping: 24 })); };
      });
    };
    mountCards();
    document.addEventListener('v4:catalog-rendered', mountCards);
    stops.push(() => {
      stopCardViews(); stopCardHover();
      document.removeEventListener('v4:catalog-rendered', mountCards);
    });

    const onDialog = (event: Event) => {
      const dialog = (event as CustomEvent<HTMLDialogElement>).detail;
      if (dialog?.open) track(animate(dialog, { opacity: [0, 1], y: [16, 0], scale: [.985, 1] }, { duration: .24, ease }));
    };
    const onFavorite = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('.favorite-button') : null;
      const heart = target?.querySelector('svg');
      if (heart?.isConnected) track(animate(heart, { scale: [1, 1.25, 1] }, { duration: .32, ease }));
    };
    document.addEventListener('v4:dialog-opened', onDialog);
    document.addEventListener('click', onFavorite);
    stops.push(() => {
      document.removeEventListener('v4:dialog-opened', onDialog);
      document.removeEventListener('click', onFavorite);
    });

    clearMotion = () => {
      stops.forEach(stop => stop());
      animations.forEach(animation => animation.stop());
      animations.clear();
      document.querySelectorAll<HTMLElement>('.hero-line, [data-hero-detail], [data-reveal], .vehicle-card, .hero-visual img, dialog').forEach(element => {
        element.style.removeProperty('opacity');
        element.style.removeProperty('transform');
        element.style.removeProperty('filter');
      });
    };
  }

  mountMotion();
  preference.addEventListener('change', mountMotion);
  return () => {
    clearMotion();
    cleanups.forEach(cleanup => cleanup());
    preference.removeEventListener('change', mountMotion);
  };
}
