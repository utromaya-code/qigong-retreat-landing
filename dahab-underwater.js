/*
  DAHAB UNDERWATER ATMOSPHERE — JS
  Пузырьки, глубина фона, козтиксы
*/

(function () {
  'use strict';

  /* ──────────────────────────────
     1. BUBBLES CANVAS
  ────────────────────────────── */

  function initBubbles() {
    var canvas = document.getElementById('bubbles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var bubbles = [];
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { canvas.style.display = 'none'; return; }

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function Bubble() {
      this.reset();
    }
    Bubble.prototype.reset = function () {
      /* Пузырьки только по краям — 20% ширины слева исправа */
      var side = Math.random() < 0.5 ? 'left' : 'right';
      this.x = side === 'left'
        ? Math.random() * canvas.width * 0.18
        : canvas.width - Math.random() * canvas.width * 0.18;
      this.y = canvas.height + Math.random() * 80;
      this.r = 2 + Math.random() * 5;          /* радиус 2-7px */
      this.speed = 0.35 + Math.random() * 0.6; /* медленно */
      this.drift = (Math.random() - 0.5) * 0.4; /* лёгкое боковое движение */
      this.alpha = 0.08 + Math.random() * 0.18;
    };
    Bubble.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,' + this.alpha + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
      /* Небольшой блик */
      ctx.beginPath();
      ctx.arc(this.x - this.r * 0.25, this.y - this.r * 0.25, this.r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + (this.alpha * 0.7) + ')';
      ctx.fill();
    };
    Bubble.prototype.update = function () {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -20) this.reset();
    };

    /* Создаём 38 пузырьков */
    for (var i = 0; i < 38; i++) {
      var b = new Bubble();
      b.y = Math.random() * canvas.height; /* распределение при запуске */
      bubbles.push(b);
    }

    var raf;
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var j = 0; j < bubbles.length; j++) {
        bubbles[j].update();
        bubbles[j].draw();
      }
      raf = requestAnimationFrame(loop);
    }
    loop();
  }

  /* ──────────────────────────────
     2. SCROLL DEPTH: активация пузырьков и caustics после hero
  ────────────────────────────── */

  function initScrollDepth() {
    var hero = document.getElementById('hero');
    if (!hero) return;
    var heroH = hero.offsetHeight;

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          var sy = window.scrollY;
          var body = document.body;

          /* past hero — включаем пузырьки и caustics */
          if (sy > heroH * 0.7) {
            body.classList.add('past-hero');
          } else {
            body.classList.remove('past-hero');
          }

          /* Глубина цвета фона */
          var maxScroll = document.body.scrollHeight - window.innerHeight;
          var pct = Math.min(sy / (maxScroll * 0.65), 1);
          body.classList.remove('depth-1', 'depth-2', 'depth-3', 'depth-4');
          if (pct > 0.75)      body.classList.add('depth-4');
          else if (pct > 0.5)  body.classList.add('depth-3');
          else if (pct > 0.25) body.classList.add('depth-2');
          else if (pct > 0.05) body.classList.add('depth-1');

          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ──────────────────────────────
     3. СЦЕНА ПОД ВОДОЙ — Intersection Observer
  ────────────────────────────── */

  function initUnderwaterReveal() {
    if (!('IntersectionObserver' in window)) return;
    var scenes = document.querySelectorAll('.fish-svg, .coral-svg');
    if (!scenes.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          e.target.style.opacity = e.target.dataset.opacity || '0.72';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.15 });

    scenes.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      io.observe(el);
    });
  }

  /* ──────────────────────────────
     4. INIT
  ────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initBubbles();
    initScrollDepth();
    initUnderwaterReveal();
  });

}());
