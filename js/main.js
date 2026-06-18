/* ============================================
   师承未来  ·  主脚本  —  克制动效
   ============================================ */
(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const contactForm = document.getElementById('contactForm');

    /* ======== 导航栏 ======== */
    function onScroll() {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        updateActiveNav(y);
        toggleBackToTop(y);
    }

    function updateActiveNav(y) {
        const sections = document.querySelectorAll('section[id], .hero[id]');
        const links = document.querySelectorAll('.nav-menu a');
        let current = '';
        sections.forEach(function (sec) {
            if (y >= sec.offsetTop - 140) current = sec.getAttribute('id');
        });
        links.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    }

    /* ======== 移动端菜单 ======== */
    navToggle.addEventListener('click', function () {
        const open = navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', open);
    });
    navMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { navMenu.classList.remove('open'); });
    });

    /* ======== 返回顶部 ======== */
    let backBtn = null;
    function toggleBackToTop(y) {
        if (y > 500) {
            if (!backBtn) { backBtn = createBackToTop(); }
            backBtn.classList.add('show');
        } else if (backBtn) {
            backBtn.classList.remove('show');
        }
    }
    function createBackToTop() {
        const b = document.createElement('button');
        b.className = 'back-to-top';
        b.innerHTML = '↑';
        b.title = '返回顶部';
        b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        document.body.appendChild(b);
        return b;
    }

    /* ======== 滚动显示 ======== */
    const revealEls = document.querySelectorAll('.endorse-card, .biz-card, .member-card, .solution-card, .case-card, .news-card, .adv-item');
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });

    /* ======== Hero 滚动指示器 ======== */
    const heroScroll = document.getElementById('heroScroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', function () {
            const brand = document.getElementById('brand');
            if (brand) {
                window.scrollTo({ top: brand.offsetTop - 80, behavior: 'smooth' });
            }
        });
    }

    /* ======== 表单 ======== */
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = '提交中...';
            btn.disabled = true;
            setTimeout(function () {
                btn.textContent = '✓ 已收到，我们会尽快联系您';
                btn.style.background = '#10b981';
                btn.style.pointerEvents = 'none';
                contactForm.reset();
                setTimeout(function () {
                    btn.textContent = orig;
                    btn.style.background = '';
                    btn.style.pointerEvents = '';
                    btn.disabled = false;
                }, 3500);
            }, 800);
        });
    }

    /* ======== 平滑滚动 ======== */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var t = document.querySelector(id);
            if (!t) return;
            e.preventDefault();
            window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        });
    });

    /* ======== 启动 ======== */
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();
