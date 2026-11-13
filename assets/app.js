/* PaperPop landing page — scroll story */
(function () {
  function boot() {
    const g = window.gsap, ST = window.ScrollTrigger;
    const root = document.querySelector('.pp');
    if (!root) return;
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.prototype.slice.call(root.querySelectorAll(s));
    const scr = $('.screen'), dc = $('.dc'), rig = $('.rig'), film = $('.film');
    const fit = () => { dc.style.transform = 'scale(' + (scr.offsetWidth / 1440) + ')'; };
    fit();
    if (window.ResizeObserver) { this.ro = new ResizeObserver(() => { fit(); if (ST) ST.refresh(); }); this.ro.observe(film); }
    if (!g) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (ST) g.registerPlugin(ST);
    let scroller = window;
    let p = root.parentElement;
    while (p && p !== document.body && p !== document.documentElement) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 20) { scroller = p; break; }
      p = p.parentElement;
    }
    const VH = () => film.offsetHeight;
    const VW = () => film.offsetWidth;
    this.ctx = g.context(() => {
      // rig geometry
      const mon = $('.mon');
      const scY = () => mon.offsetTop + scr.offsetTop + scr.offsetHeight / 2;
      const zoomS = () => Math.min(VW() * .96 / scr.offsetWidth, (VH() - 68) * .92 / scr.offsetHeight);
      const restY = () => Math.max(76, 68 + (VH() - 68 - rig.offsetHeight) / 2);
      const restX = () => 0;
      g.set(rig, { xPercent: -50, x: 0, y: restY, transformOrigin: () => '50% ' + scY() + 'px' });
      if (reduce) return;

      // hero intro
      g.from('.h1 .ln > span', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .09, delay: .1 });
      g.fromTo('.sq', { strokeDasharray: 230, strokeDashoffset: 230 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', delay: .8 });
      g.from('.hx', { y: 18, opacity: 0, duration: .9, ease: 'power3.out', stagger: .08, delay: .5 });
      g.from(rig, { y: () => restY() + 220, opacity: 0, duration: 1.6, ease: 'expo.out', delay: .4 });
      g.set('.charm', { transformOrigin: '50% 0%' });
      g.fromTo('.charm', { rotation: -8 }, { rotation: 8, duration: 1.7, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      // starting state of the desktop story
      const notes = ['.na', '.nb', '.nc'];
      g.set(notes, { scale: 0, opacity: 0 });
      g.set(['.w0', '.w1t', '.w2t', '.w3t'], { clipPath: 'inset(0 100% 0 0)' });
      g.set(['.t1', '.t2', '.t3'], { strokeDashoffset: 40 });
      g.set(['.s1', '.s2', '.s3', '.hlb'], { scaleX: 0 });
      g.set('.dood', { strokeDashoffset: 230 });
      g.set('.w2', { x: -1100, opacity: 1 });
      g.set(['.cap', '.caps'], { opacity: 0, y: 16 });

      const off = (el) => { let x = 0, y = 0; while (el && el !== dc) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return { x: x, y: y }; };
      const at = (sel, fx, fy) => { const el = $(sel); const o = off(el); return { x: o.x + el.offsetWidth * fx, y: o.y + el.offsetHeight * fy }; };
      const cb2 = at('.cb2', .5, .5), cb1 = at('.na .cb', .5, .5), cb3 = at('.cb3', .5, .5), bw = at('.bw', .05, .6), bw2 = at('.bw', .95, .6);
      const tbar = { x: 420 + 220, y: 330 + 20 };
      const ppi = at('.ppi', .5, .5);
      g.set('.c1', { x: 600, y: 980 }); g.set('.c2', { x: 1500, y: 300 }); g.set('.c3', { x: -60, y: 600 });
      const toTray = (sel) => { const el = $(sel); const o = off(el); return { x: ppi.x - (o.x + el.offsetWidth / 2), y: ppi.y - (o.y + el.offsetHeight / 2) }; };

      const tl = g.timeline({ defaults: { ease: 'power2.inOut' } });
      const showCap = (i, t) => {
        tl.to('.k' + i, { opacity: 1, y: 0, duration: .25 }, t);
        tl.to('.d' + i, { backgroundColor: '#FFD95A', duration: .2 }, t);
        if (i > 0) tl.to('.k' + (i - 1), { opacity: 0, y: -12, duration: .2 }, t - .05);
      };
      // 0: camera move into the screen
      tl.to('.grass, .neck, .mfoot', { opacity: 0, y: 40, duration: .6 }, .2)

        .to(rig, { y: () => (VH() + 68) / 2 - scY(), scale: zoomS, duration: 1.2 }, 0)
        .to(film, { backgroundColor: '#0E0E10', duration: .7 }, .45)

        .to('.caps', { opacity: 1, y: 0, duration: .3 }, 1.05);
      // 1: write
      showCap(0, 1.2);
      tl.to('.na', { scale: 1, opacity: 1, duration: .45, ease: 'back.out(1.6)' }, 1.3)
        .to('.w0', { clipPath: 'inset(0 0% 0 0)', duration: .3, ease: 'none' }, 1.6)
        .to('.w1t', { clipPath: 'inset(0 0% 0 0)', duration: .35, ease: 'none' }, 1.9)
        .to('.w2t', { clipPath: 'inset(0 0% 0 0)', duration: .4, ease: 'none' }, 2.25)
        .to('.w3t', { clipPath: 'inset(0 0% 0 0)', duration: .35, ease: 'none' }, 2.65);
      // 2: tick + highlight
      showCap(1, 3.1);
      tl.to('.nb', { scale: 1, opacity: 1, duration: .45, ease: 'back.out(1.6)' }, 3.1)
        .to('.c1', { opacity: 1, duration: .1 }, 3.15)
        .to('.c1', { x: cb2.x, y: cb2.y, duration: .55 }, 3.15)
        .to('.c1', { scale: .8, duration: .06, yoyo: true, repeat: 1 }, 3.72)
        .to('.t2', { strokeDashoffset: 0, duration: .22 }, 3.78)
        .to('.s2', { scaleX: 1, duration: .25 }, 3.85)
        .fromTo('.na .spk', { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: .2, stagger: .04, ease: 'back.out(3)' }, 3.85)
        .to('.na .spk', { scale: 0, duration: .2, stagger: .03 }, 4.15)
        .to('.c2', { opacity: 1, duration: .1 }, 3.5)
        .to('.c2', { x: bw.x, y: bw.y, duration: .5 }, 3.5)
        .to('.c2', { x: bw2.x, duration: .4, ease: 'none' }, 4.05)
        .to('.hlb', { scaleX: 1, duration: .4, ease: 'none' }, 4.05)
        .to('.dood', { strokeDashoffset: 0, duration: .5 }, 4.3);
      // 3: always on top
      showCap(2, 4.9);
      tl.to('.w2', { x: 0, duration: .6, ease: 'power3.out' }, 4.9)
        .to('.c3', { opacity: 1, duration: .1 }, 5.2)
        .to('.c3', { x: tbar.x, y: tbar.y, duration: .4 }, 5.2)
        .to('.c3', { scale: .85, duration: .06 }, 5.62)
        .to(['.w2', '.c3'], { x: '+=520', y: '-=60', duration: .9 }, 5.7)
        .to('.badge', { opacity: 1, y: -6, duration: .2, ease: 'back.out(2)' }, 6.1)
        .to('.c3', { scale: 1, duration: .06 }, 6.62)
        .to('.badge', { opacity: 0, duration: .2 }, 6.75);
      // 4: shortcuts
      showCap(3, 7.0);
      tl.to('.tN', { opacity: 1, y: -8, duration: .2 }, 7.0)
        .to('.nc', { scale: 1, opacity: 1, duration: .4, ease: 'back.out(1.8)' }, 7.25)
        .to('.tN', { opacity: 0, y: 0, duration: .15 }, 7.65)
        .to('.tH', { opacity: 1, y: -8, duration: .2 }, 7.8);
      notes.forEach((s, i) => { tl.to(s, { x: () => toTray(s).x, y: () => toTray(s).y, scale: .06, opacity: 0, duration: .45, ease: 'power3.in' }, 8.0 + i * .06); });
      tl.to('.charm', { y: -140, duration: .4, ease: 'power2.in' }, 8.0)
        .to('.ppi', { scale: 1.25, duration: .1, yoyo: true, repeat: 1 }, 8.45)
        .to('.tH', { opacity: 0, y: 0, duration: .15 }, 8.55)
        .to('.tS', { opacity: 1, y: -8, duration: .2 }, 8.7);
      notes.forEach((s, i) => { tl.to(s, { x: 0, y: 0, scale: 1, opacity: 1, duration: .45, ease: 'back.out(1.5)' }, 8.9 + i * .06); });
      tl.to('.charm', { y: 0, duration: .5, ease: 'bounce.out' }, 8.9)
        .to('.tS', { opacity: 0, y: 0, duration: .15 }, 9.4);
      // 5: celebrate
      showCap(4, 9.6);
      tl.to('.c1', { x: cb1.x, y: cb1.y, duration: .35 }, 9.6)
        .to('.t1', { strokeDashoffset: 0, duration: .18 }, 9.98)
        .to('.s1', { scaleX: 1, duration: .2 }, 10.02)
        .to('.c1', { x: cb3.x, y: cb3.y, duration: .3 }, 10.15)
        .to('.t3', { strokeDashoffset: 0, duration: .18 }, 10.48)
        .to('.s3', { scaleX: 1, duration: .2 }, 10.52)
        .to(['.c2', '.c3'], { opacity: 0, duration: .2 }, 10.4);
      const cfs = $$('.cf');
      tl.set(cfs, { opacity: 1, x: 0, y: 0 }, 10.7)
        .to(cfs, { x: () => g.utils.random(-420, 420), y: () => g.utils.random(-260, 380), rotation: () => g.utils.random(-600, 600), duration: .9, ease: 'power3.out' }, 10.7)
        .to(cfs, { opacity: 0, duration: .3 }, 11.4)
        .fromTo('.stamp', { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: .25, ease: 'back.out(2)' }, 10.8)
        .to('.c1', { opacity: 0, duration: .2 }, 11.0)
        .to('.caps', { opacity: 0, y: 16, duration: .3 }, 11.6)
        .to(rig, { scale: () => zoomS() * .82, duration: .6 }, 11.6)
        .to({}, { duration: .3 });

      if (ST) {
        ST.create({ trigger: film, scroller: scroller, start: 'top top', end: () => '+=' + Math.round(VH() * 6.5), pin: true, scrub: 1, animation: tl, invalidateOnRefresh: true, anticipatePin: 1 });
        g.utils.toArray(root.querySelectorAll('.rv')).forEach((el) => {
          g.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, scroller: scroller, start: 'top 88%' } });
        });
        g.fromTo(root.querySelectorAll('.pw'), { opacity: .14 }, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.pbig', scroller: scroller, start: 'top 80%', end: 'bottom 45%', scrub: true } });
        ['.f1', '.f2', '.f3', '.f4'].forEach((s, i) => {
          g.to(s, { y: (i % 2 ? -1 : 1) * 70, rotation: (i % 2 ? 6 : -6), ease: 'none', scrollTrigger: { trigger: '.dlc', scroller: scroller, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      } else {
        tl.repeat(-1).repeatDelay(1);
      }
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => { if (!ST || ST.getAll().every((t) => t.progress === 0)) g.set(rig, { x: restX(), y: restY() }); if (ST) ST.refresh(); });
      }
    }, root);
  }
  boot.call({});
})();
