/* ============================================
   师承未来  ·  主脚本  —  克制动效 + 3D粒子
   ============================================ */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

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

    /* ============================================
       3D 粒子场景  —  Three.js + UnrealBloomPass
       ============================================ */
    initParticles();

    function initParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // --- 粒子数量（移动端减半） ---
        const isMobile = window.innerWidth < 768;
        const COUNT = isMobile ? 4000 : 12000;

        // --- Scene / Camera / Renderer ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, hero.clientWidth / hero.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 32);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(hero.clientWidth, hero.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.domElement.id = 'particleCanvas';
        hero.insertBefore(renderer.domElement, hero.firstChild);

        // --- 粒子几何体 ---
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(COUNT * 3);
        const basePositions = new Float32Array(COUNT * 3); // 保存初始位置
        const colors = new Float32Array(COUNT * 3);

        for (let i = 0; i < COUNT; i++) {
            // 球形分布 + 随机偏移，形成云团感
            const r = 8 + Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = Math.sin(phi) * Math.cos(theta) * r + (Math.random() - 0.5) * 12;
            const y = Math.sin(phi) * Math.sin(theta) * r * 0.6 + (Math.random() - 0.5) * 10;
            const z = Math.cos(phi) * r * 0.7 + (Math.random() - 0.5) * 8;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            basePositions[i * 3] = x;
            basePositions[i * 3 + 1] = y;
            basePositions[i * 3 + 2] = z;

            // 蓝-青色渐变
            const mix = Math.random();
            colors[i * 3] = 0.15 + mix * 0.25;
            colors[i * 3 + 1] = 0.35 + mix * 0.4;
            colors[i * 3 + 2] = 0.55 + mix * 0.45;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // --- 发光圆形贴图 ---
        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = 64;
        spriteCanvas.height = 64;
        const ctx = spriteCanvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.06, 'rgba(180,210,255,0.85)');
        gradient.addColorStop(0.25, 'rgba(80,140,255,0.35)');
        gradient.addColorStop(0.55, 'rgba(30,80,220,0.06)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        const sprite = new THREE.CanvasTexture(spriteCanvas);

        // --- 材质 ---
        const material = new THREE.PointsMaterial({
            size: 0.28,
            map: sprite,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
            transparent: true,
            vertexColors: true,
            opacity: 0.75,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // --- 后期：辉光 ---
        const renderPass = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(hero.clientWidth, hero.clientHeight),
            1.3,   // strength
            0.5,   // radius
            0.2    // threshold
        );
        bloomPass.renderToScreen = true;

        const composer = new EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);

        // --- 鼠标交互 ---
        let targetMX = 0, targetMY = 0;
        let smoothMX = 0, smoothMY = 0;

        document.addEventListener('mousemove', function (e) {
            targetMX = (e.clientX / window.innerWidth) * 2 - 1;
            targetMY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // --- 响应式 ---
        window.addEventListener('resize', function () {
            const w = hero.clientWidth;
            const h = hero.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
        });

        // --- 动画循环 ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const dt = Math.min(clock.getDelta(), 0.1);
            const time = performance.now() * 0.001;

            // 鼠标平滑跟随
            smoothMX += (targetMX - smoothMX) * 0.04;
            smoothMY += (targetMY - smoothMY) * 0.04;

            // 粒子云整体缓慢旋转
            particles.rotation.y += dt * 0.06;
            particles.rotation.x += dt * 0.025;
            particles.rotation.z += dt * 0.015;

            // 整体浮动
            particles.position.y = Math.sin(time * 0.35) * 0.6;
            particles.position.x = Math.cos(time * 0.28) * 0.4;

            // 逐粒子位置更新：鼠标引力 + 正弦浮动
            const posArr = geometry.attributes.position.array;
            for (let i = 0; i < COUNT; i++) {
                const i3 = i * 3;
                const bx = basePositions[i3];
                const by = basePositions[i3 + 1];
                const bz = basePositions[i3 + 2];

                // 鼠标引力偏移（距离越远引力越弱）
                const dist = Math.sqrt(bx * bx + by * by + bz * bz) / 30;
                const influence = Math.max(0, 1 - dist) * 3.5;

                posArr[i3] = bx + smoothMX * influence;
                posArr[i3 + 1] = by + Math.sin(time * 0.7 + i * 0.008) * 0.35 + smoothMY * influence * 0.5;
                posArr[i3 + 2] = bz + smoothMY * influence;
            }
            geometry.attributes.position.needsUpdate = true;

            // 相机微动
            camera.position.x += (smoothMX * 3.5 - camera.position.x) * 0.03;
            camera.position.y += (-smoothMY * 2 - camera.position.y) * 0.03;
            camera.lookAt(0, 0, 0);

            composer.render();
        }

        animate();
    }
})();
