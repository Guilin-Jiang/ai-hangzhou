/* ============================================
   北师大科技集团 · AI杭州教育基地  —  主脚本
   ============================================ */

(function () {
    'use strict';

    // ==================== DOM 元素 ====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const contactForm = document.getElementById('contactForm');
    const heroStats = document.querySelector('.hero-stats');

    // ==================== 导航栏滚动效果 ====================
    function onScroll() {
        const scrollY = window.scrollY;

        // 导航栏样式切换
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 活跃链接高亮
        updateActiveLink();

        // 返回顶部按钮
        const backBtn = document.querySelector('.back-to-top');
        if (scrollY > 500) {
            if (!backBtn) createBackToTop();
            document.querySelector('.back-to-top').classList.add('show');
        } else if (backBtn) {
            backBtn.classList.remove('show');
        }
    }

    // ==================== 活跃导航链接 ====================
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-links a');
        let current = '';

        sections.forEach(function (sec) {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id');
            }
        });

        links.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // ==================== 移动端菜单 ====================
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // 点击菜单项后关闭
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // 点击菜单外关闭
    document.addEventListener('click', function (e) {
        if (navLinks.classList.contains('open') &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // ==================== 返回顶部按钮 ====================
    function createBackToTop() {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = '↑';
        btn.title = '返回顶部';
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(btn);
    }

    // ==================== 数字滚动动画 ====================
    function animateCount(el, target, duration) {
        const start = 0;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // 使用 IntersectionObserver 监听统计数字
    let statsAnimated = false;
    if (heroStats) {
        const statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    const numbers = heroStats.querySelectorAll('.stat-number');
                    numbers.forEach(function (num) {
                        const target = parseInt(num.getAttribute('data-count'));
                        if (target) {
                            animateCount(num, target, 1800);
                        }
                    });
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }

    // ==================== 滚动显示动画 ====================
    const revealElements = document.querySelectorAll(
        '.about-card, .course-card, .advantage-item, .team-card, .contact-card'
    );

    revealElements.forEach(function (el) {
        el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    // ==================== 表单提交 ====================
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach(function (val, key) {
                const input = contactForm.querySelector('[placeholder="' + key + '"]') ||
                              contactForm.querySelector('select') ||
                              contactForm.querySelector('textarea');
                // 简单收集
            });

            // 模拟提交
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;

            setTimeout(function () {
                submitBtn.textContent = '✓ 提交成功！';
                submitBtn.style.background = '#10b981';
                contactForm.reset();

                setTimeout(function () {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1000);
        });
    }

    // ==================== 平滑滚动（Safari 兼容） ====================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 16;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ==================== 初始化 ====================
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初始检查

    console.log('🚀 北师大科技集团 · AI杭州教育基地 — 网站已就绪');
})();
