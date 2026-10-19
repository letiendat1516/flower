/* =====================================================================
 *  💐 CẤU HÌNH — chỉ cần sửa phần này để đổi tên và lời nhắn
 * ===================================================================== */
const CONFIG = {
  recipient: 'Em yêu',   // Tên / cách gọi người nhận
  sender: 'Anh',         // Tên người gửi (ký cuối thư)

  // Lời chúc ngắn hiện dưới bó hoa
  wish: 'Chúc em luôn xinh đẹp, rạng rỡ và hạnh phúc như những đóa hoa này.',

  // Tiêu đề và nội dung lá thư (mỗi phần tử là một đoạn)
  letterTitle: 'Gửi em, người con gái anh thương',
  letter: [
    'Chúc mừng ngày Phụ nữ Việt Nam 20/10, em nhé!',
    'Cảm ơn em đã đến bên anh, mang theo nụ cười làm những ngày bình thường của anh trở nên dịu dàng hơn.',
    'Anh không giỏi nói lời hoa mỹ, nên gửi em bó hoa này — mỗi bông là một điều anh mong cho em: luôn khỏe mạnh, luôn vui vẻ và luôn được yêu thương thật nhiều.',
    'Hôm nay và cả những ngày sau này, em vẫn luôn là đóa hoa đẹp nhất của anh.'
  ],
  signOff: 'Thương em thật nhiều,'
};

(function () {
  'use strict';

  var root = document.documentElement;
  var FINAL = new URLSearchParams(location.search).has('final');
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (FINAL) root.classList.add('final');
  if (REDUCED) root.classList.add('reduced');

  // ---------- Text from CONFIG ----------
  ['recipient', 'sender', 'wish', 'letterTitle', 'signOff'].forEach(function (key) {
    document.querySelectorAll('[data-cfg="' + key + '"]').forEach(function (el) {
      el.textContent = CONFIG[key];
    });
  });

  // ---------- Deterministic random (same bouquet every load) ----------
  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var rand = rng(2010);
  function n(v) { return Math.round(v * 10) / 10; }

  var defs = '';
  var uid = 0;

  // ---------- Flower builders (each drawn around 0,0) ----------
  function petal(len, w) {
    return 'M0 0C' + n(-w) + ' ' + n(-len * .25) + ' ' + n(-w * 1.05) + ' ' + n(-len * .95) + ' 0 ' + n(-len) +
      'C' + n(w * 1.05) + ' ' + n(-len * .95) + ' ' + n(w) + ' ' + n(-len * .25) + ' 0 0Z';
  }

  function rose(r, p) {
    var id = 'rg' + (uid++);
    defs += '<radialGradient id="' + id + '" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="' + r + '">' +
      '<stop offset="0" stop-color="' + p[0] + '"/><stop offset=".55" stop-color="' + p[1] + '"/>' +
      '<stop offset="1" stop-color="' + p[2] + '"/></radialGradient>';
    var s = '<circle r="' + n(r * .9) + '" fill="' + p[1] + '"/>';
    var layers = [[6, 1, .62, 0], [5, .8, .6, 30], [5, .6, .58, 10], [4, .4, .6, 55]];
    layers.forEach(function (L) {
      for (var i = 0; i < L[0]; i++) {
        s += '<path d="' + petal(r * L[1], r * L[1] * L[2]) + '" transform="rotate(' + n(L[3] + i * 360 / L[0]) +
          ')" fill="url(#' + id + ')" stroke="' + p[0] + '" stroke-opacity=".35" stroke-width=".8"/>';
      }
    });
    s += '<circle r="' + n(r * .16) + '" fill="' + p[0] + '"/>' +
      '<path d="M' + n(-r * .1) + ' 0a' + n(r * .1) + ' ' + n(r * .1) + ' 0 1 1 ' + n(r * .13) + ' ' + n(r * .06) +
      '" fill="none" stroke="' + p[2] + '" stroke-opacity=".7" stroke-width="1.2"/>' +
      '<circle r="' + r + '" fill="url(#shine)"/>';
    return s;
  }

  function tulip(h, c) {
    var id = 'tg' + (uid++);
    defs += '<linearGradient id="' + id + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="' + c[0] +
      '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient>';
    var k = function (v) { return n(v * h); };
    return '<path d="M' + k(-.42) + ' ' + k(-.88) + 'C' + k(-.48) + ' ' + k(-.3) + ' ' + k(-.25) + ' 0 0 0C' + k(.25) +
      ' 0 ' + k(.48) + ' ' + k(-.3) + ' ' + k(.42) + ' ' + k(-.88) + 'C' + k(.3) + ' ' + k(-.72) + ' ' + k(.16) + ' ' +
      k(-.72) + ' 0 ' + k(-.98) + 'C' + k(-.16) + ' ' + k(-.72) + ' ' + k(-.3) + ' ' + k(-.72) + ' ' + k(-.42) + ' ' +
      k(-.88) + 'Z" fill="' + c[0] + '"/>' +
      '<path d="M0 0C' + k(-.32) + ' ' + k(-.04) + ' ' + k(-.34) + ' ' + k(-.72) + ' 0 ' + k(-1.02) + 'C' + k(.34) +
      ' ' + k(-.72) + ' ' + k(.32) + ' ' + k(-.04) + ' 0 0Z" fill="url(#' + id + ')" stroke="' + c[0] +
      '" stroke-opacity=".5" stroke-width=".8"/>' +
      '<path d="M0 ' + k(-.12) + 'Q' + k(-.06) + ' ' + k(-.5) + ' 0 ' + k(-.9) + '" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>';
  }

  function gerbera(r, c) {
    var s = '';
    for (var i = 0; i < 22; i++) {
      s += '<ellipse cy="' + n(-r * .55) + '" rx="' + n(r * .13) + '" ry="' + n(r * .46) + '" transform="rotate(' + n(i * 360 / 22) + ')" fill="' + c[0] + '"/>';
    }
    for (var j = 0; j < 22; j++) {
      s += '<ellipse cy="' + n(-r * .45) + '" rx="' + n(r * .1) + '" ry="' + n(r * .38) + '" transform="rotate(' + n(j * 360 / 22 + 8) + ')" fill="' + c[1] + '"/>';
    }
    s += '<circle r="' + n(r * .3) + '" fill="#6d4100"/><circle r="' + n(r * .2) + '" fill="#3b2200"/>';
    for (var d = 0; d < 12; d++) {
      var a = d * Math.PI / 6;
      s += '<circle cx="' + n(Math.cos(a) * r * .25) + '" cy="' + n(Math.sin(a) * r * .25) + '" r="' + n(r * .035) + '" fill="#ffd54f"/>';
    }
    return s;
  }

  function daisy(r) {
    var s = '';
    for (var i = 0; i < 16; i++) {
      s += '<ellipse cy="' + n(-r * .55) + '" rx="' + n(r * .16) + '" ry="' + n(r * .48) + '" transform="rotate(' + n(i * 22.5) + ')" fill="#fff" stroke="#f1d6e2" stroke-width=".8"/>';
    }
    return s + '<circle r="' + n(r * .3) + '" fill="url(#daisyC)"/>';
  }

  function babysBreath() {
    var s = '';
    for (var i = 0; i < 6; i++) {
      var a = -Math.PI / 2 + (rand() - .5) * 2.2;
      var len = 14 + rand() * 18;
      var x = Math.cos(a) * len, y = Math.sin(a) * len;
      s += '<path d="M0 0L' + n(x) + ' ' + n(y) + '" stroke="#7cb342" stroke-width="1"/>';
      for (var j = 0; j < 4; j++) {
        s += '<circle cx="' + n(x + (rand() - .5) * 10) + '" cy="' + n(y + (rand() - .5) * 10) + '" r="' + n(2 + rand() * 1.6) + '" fill="#fff" stroke="#f6dbe6" stroke-width=".6"/>';
      }
    }
    return s;
  }

  function lavender(h) {
    var s = '<path d="M0 0L0 ' + n(-h) + '" stroke="#558b2f" stroke-width="2" stroke-linecap="round"/>';
    var cols = ['#7e57c2', '#9575cd', '#b39ddb', '#8e24aa'];
    for (var i = 0; i < 11; i++) {
      var y = -h * .38 - i * h * .058;
      var sz = 1 - i * .05;
      s += '<ellipse cx="-3.5" cy="' + n(y) + '" rx="' + n(3.6 * sz) + '" ry="' + n(5.4 * sz) + '" transform="rotate(-25 -3.5 ' + n(y) + ')" fill="' + cols[i % 4] + '"/>' +
        '<ellipse cx="3.5" cy="' + n(y - 2) + '" rx="' + n(3.6 * sz) + '" ry="' + n(5.4 * sz) + '" transform="rotate(25 3.5 ' + n(y - 2) + ')" fill="' + cols[(i + 2) % 4] + '"/>';
    }
    return s;
  }

  function leaf(l) {
    var w = l * .32;
    return '<path d="M0 0C' + n(w) + ' ' + n(-l * .3) + ' ' + n(w) + ' ' + n(-l * .7) + ' 0 ' + n(-l) + 'C' + n(-w) + ' ' +
      n(-l * .7) + ' ' + n(-w) + ' ' + n(-l * .3) + ' 0 0Z" fill="url(#leafG)"/>' +
      '<path d="M0 0L0 ' + n(-l * .92) + '" stroke="#1b5e20" stroke-opacity=".45" stroke-width="1"/>';
  }

  // ---------- Composition ----------
  var G = { x: 200, y: 432 }; // where all stems meet (hidden by paper)

  var ROSE = {
    red: ['#7a0019', '#d4143b', '#ff6b81'],
    pink: ['#b0285e', '#f2649a', '#ffc2d6'],
    coral: ['#b5372a', '#ff6f59', '#ffc0a8'],
    hot: ['#9c0a52', '#e9177a', '#ff8cc0'],
    crimson: ['#5e0016', '#b3002d', '#f0466b'],
    peach: ['#c8553d', '#ff9e7a', '#ffe0cc'],
    magenta: ['#6a0b5c', '#c2187f', '#f57ad0'],
    blush: ['#c2416a', '#ff8fab', '#fff0f4']
  };

  var LEAVES = [
    [78, 236, -62, 58], [322, 234, 62, 58], [92, 172, -38, 52], [308, 166, 38, 52],
    [140, 128, -14, 46], [262, 124, 16, 46], [60, 262, -80, 46], [340, 262, 80, 46],
    [118, 262, -48, 40], [282, 262, 48, 40]
  ];

  var FLOWERS = [
    { t: 'lav', x: 120, y: 182, a: -24, s: 104 },
    { t: 'lav', x: 284, y: 176, a: 22, s: 108 },
    { t: 'lav', x: 232, y: 130, a: 8, s: 70 },
    { t: 'bb', x: 92, y: 196 }, { t: 'bb', x: 310, y: 192 },
    { t: 'bb', x: 168, y: 124 }, { t: 'bb', x: 244, y: 118 }, { t: 'bb', x: 200, y: 102 },
    { t: 'tulip', x: 146, y: 158, a: -16, s: 54, c: ['#c2185b', '#ff80ab'] },
    { t: 'tulip', x: 258, y: 152, a: 14, s: 54, c: ['#6a1b9a', '#ce93d8'] },
    { t: 'tulip', x: 196, y: 136, a: -2, s: 50, c: ['#e64a19', '#ffb74d'] },
    { t: 'gerb', x: 116, y: 206, s: 30, c: ['#ef6c00', '#ffa726'] },
    { t: 'gerb', x: 286, y: 200, s: 30, c: ['#f9a825', '#ffeb3b'] },
    { t: 'rose', x: 172, y: 170, s: 30, c: 'hot' },
    { t: 'rose', x: 230, y: 166, s: 30, c: 'crimson' },
    { t: 'rose', x: 150, y: 212, s: 34, c: 'pink' },
    { t: 'rose', x: 252, y: 208, s: 34, c: 'coral' },
    { t: 'rose', x: 200, y: 200, s: 40, c: 'red' },
    { t: 'rose', x: 106, y: 236, s: 27, c: 'peach' },
    { t: 'rose', x: 294, y: 232, s: 27, c: 'magenta' },
    { t: 'rose', x: 200, y: 240, s: 30, c: 'blush' },
    { t: 'daisy', x: 154, y: 250, s: 21 },
    { t: 'daisy', x: 248, y: 248, s: 21 }
  ];

  var stems = '', leaves = '', flowers = '';

  FLOWERS.forEach(function (f, i) {
    var dx = f.x - 200, dy = f.y - 200;
    var delay = 1.2 + Math.sqrt(dx * dx + dy * dy) / 60 + i * .03;
    var cx = n(f.x + (G.x - f.x) * .25), cy = n(f.y + (G.y - f.y) * .6);
    var w = f.t === 'rose' || f.t === 'gerb' || f.t === 'tulip' ? 3.4 : 2.2;
    stems += '<path class="stem" pathLength="1" d="M' + f.x + ' ' + f.y + 'Q' + cx + ' ' + cy + ' ' + G.x + ' ' + G.y +
      '" stroke="#2e7d32" stroke-width="' + w + '" fill="none" stroke-linecap="round" style="animation-delay:' + n(.3 + i * .03) + 's"/>';

    var body, fromBase = false;
    switch (f.t) {
      case 'rose': body = rose(f.s, ROSE[f.c]); break;
      case 'tulip': body = tulip(f.s, f.c); fromBase = true; break;
      case 'gerb': body = gerbera(f.s, f.c); break;
      case 'daisy': body = daisy(f.s); break;
      case 'bb': body = babysBreath(); fromBase = true; break;
      case 'lav': body = lavender(f.s); fromBase = true; break;
    }
    flowers += '<g transform="translate(' + f.x + ' ' + f.y + ') rotate(' + (f.a || 0) + ')"><g class="bloom' +
      (fromBase ? ' from-base' : '') + '" style="animation-delay:' + n(delay) + 's">' + body + '</g></g>';
  });

  LEAVES.forEach(function (l, i) {
    leaves += '<g transform="translate(' + l[0] + ' ' + l[1] + ') rotate(' + l[2] + ')"><g class="bloom from-base" style="animation-delay:' +
      n(.9 + i * .07) + 's">' + leaf(l[3]) + '</g></g>';
  });

  defs +=
    '<radialGradient id="shine" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="daisyC" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff59d"/><stop offset=".6" stop-color="#fbc02d"/><stop offset="1" stop-color="#e65100"/></radialGradient>' +
    '<linearGradient id="leafG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1b5e20"/><stop offset="1" stop-color="#7cb342"/></linearGradient>' +
    '<linearGradient id="paperBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3f6"/><stop offset="1" stop-color="#f5b3c6"/></linearGradient>' +
    '<linearGradient id="paperL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7aa2"/><stop offset="1" stop-color="#c2185b"/></linearGradient>' +
    '<linearGradient id="paperR" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd1df"/><stop offset="1" stop-color="#f06292"/></linearGradient>' +
    '<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b8"/><stop offset=".45" stop-color="#ffc233"/><stop offset="1" stop-color="#c77800"/></linearGradient>';

  var paperBack = '<path class="rise" d="M200 432L50 196C60 160 96 150 118 168C130 120 170 104 200 116C230 104 270 120 282 168C304 150 340 160 350 196Z" fill="url(#paperBack)" stroke="#f3a6bd" stroke-width="1"/>';

  var paperFront =
    '<g class="rise" style="animation-delay:.15s">' +
    '<path d="M48 258Q66 236 86 256Q104 232 126 258Q146 238 166 264Q184 242 200 266Q216 242 234 264Q254 238 274 258Q296 232 314 256Q334 236 352 258L344 284L56 284Z" fill="#fff7fa" stroke="#f3c1d1" stroke-width="1.2"/>' +
    '<path d="M344 262C290 296 242 304 194 300L202 530C250 450 304 345 344 262Z" fill="url(#paperR)"/>' +
    '<path d="M56 262C110 296 158 304 206 300L198 530C150 450 96 345 56 262Z" fill="url(#paperL)"/>' +
    '<path d="M200 302L199 526" stroke="#fff" stroke-opacity=".45" stroke-width="1.5"/>' +
    '<path d="M70 274C120 302 160 308 204 304" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>' +
    '</g>';

  var bow =
    '<g class="pop">' +
    '<path d="M112 372Q200 392 288 372L284 390Q200 410 116 390Z" fill="url(#gold)" stroke="#b26a00" stroke-opacity=".5"/>' +
    '<path d="M196 388C188 410 178 430 164 454L177 449L183 464C191 440 197 414 205 390Z" fill="url(#gold)" stroke="#b26a00" stroke-opacity=".5"/>' +
    '<path d="M204 388C212 410 222 430 236 454L223 449L217 464C209 440 203 414 195 390Z" fill="url(#gold)" stroke="#b26a00" stroke-opacity=".5"/>' +
    '<path d="M200 384C170 348 128 350 138 381C132 408 172 406 200 384Z" fill="url(#gold)" stroke="#b26a00" stroke-opacity=".55"/>' +
    '<path d="M200 384C230 348 272 350 262 381C268 408 228 406 200 384Z" fill="url(#gold)" stroke="#b26a00" stroke-opacity=".55"/>' +
    '<path d="M196 382C178 366 158 366 156 380" fill="none" stroke="#b26a00" stroke-opacity=".45" stroke-width="1.5"/>' +
    '<path d="M204 382C222 366 242 366 244 380" fill="none" stroke="#b26a00" stroke-opacity=".45" stroke-width="1.5"/>' +
    '<ellipse cx="200" cy="385" rx="13" ry="11" fill="url(#gold)" stroke="#b26a00" stroke-opacity=".6"/>' +
    '</g>';

  var svg = document.getElementById('bouquet');
  svg.innerHTML = '<defs>' + defs + '</defs>' + paperBack + stems + leaves + flowers + paperFront + bow;

  // ---------- Falling petals & sparkles ----------
  if (!REDUCED) {
    var petals = document.querySelector('.petals');
    var petalColors = ['#ff8fab', '#ff4d6d', '#ffb3c6', '#f06292', '#ffc2a8', '#e91e63', '#ce93d8'];
    for (var p = 0; p < 16; p++) {
      var el = document.createElement('span');
      var dur = 9 + Math.random() * 9;
      el.className = 'petal';
      el.style.left = (Math.random() * 100) + '%';
      el.style.setProperty('--size', (9 + Math.random() * 9) + 'px');
      el.style.setProperty('--color', petalColors[p % petalColors.length]);
      el.style.setProperty('--dur', dur + 's');
      el.style.setProperty('--delay', (-Math.random() * dur) + 's');
      el.style.setProperty('--drift', ((Math.random() - .5) * 160) + 'px');
      petals.appendChild(el);
    }

    var sparkles = document.querySelector('.sparkles');
    for (var s = 0; s < 12; s++) {
      var sp = document.createElement('span');
      sp.className = 'spark';
      sp.style.left = (12 + rand() * 76) + '%';
      sp.style.top = (6 + rand() * 50) + '%';
      sp.style.setProperty('--s', (10 + rand() * 12) + 'px');
      sp.style.setProperty('--dur', (2 + rand() * 2.5) + 's');
      sp.style.setProperty('--delay', (rand() * 3) + 's');
      sparkles.appendChild(sp);
    }
  }

  // ---------- Hearts ----------
  var heartLayer = document.querySelector('.hearts');
  var HEART_COLORS = ['#ff4d6d', '#ff8fab', '#e91e63', '#ff6f91', '#ffb3c6', '#f06292', '#ff5c8a'];
  function burst(x, y, count) {
    if (REDUCED) count = Math.min(count, 4);
    for (var i = 0; i < count; i++) {
      if (heartLayer.childElementCount >= 70) break;
      var h = document.createElement('span');
      var ang = -Math.PI / 2 + (Math.random() - .5) * 2.6;
      var dist = 80 + Math.random() * 140;
      h.className = 'heart';
      h.textContent = '♥';
      h.style.left = x + 'px';
      h.style.top = y + 'px';
      h.style.color = HEART_COLORS[i % HEART_COLORS.length];
      h.style.fontSize = (16 + Math.random() * 18) + 'px';
      h.style.setProperty('--dx', n(Math.cos(ang) * dist) + 'px');
      h.style.setProperty('--dy', n(Math.sin(ang) * dist - 40) + 'px');
      h.style.setProperty('--sc', (.8 + Math.random() * .8).toFixed(2));
      h.style.setProperty('--rot', ((Math.random() - .5) * 60).toFixed(0) + 'deg');
      h.style.setProperty('--t', (1.4 + Math.random() * 1) + 's');
      h.addEventListener('animationend', function () { this.remove(); });
      heartLayer.appendChild(h);
    }
  }

  var wrap = document.querySelector('.bouquet-wrap');
  wrap.addEventListener('pointerdown', function (e) { burst(e.clientX, e.clientY, 14); });
  wrap.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      var r = wrap.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 14);
    }
  });

  if (!FINAL && !REDUCED) {
    setTimeout(function () {
      var r = wrap.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height * .4, 18);
    }, 3900);
  }

  // ---------- Letter ----------
  var letter = document.getElementById('letter');
  var body = document.getElementById('letterBody');
  var sign = document.getElementById('letterSign');
  var openBtn = document.getElementById('openLetter');
  var closeBtn = document.getElementById('closeLetter');
  var fullText = CONFIG.letter.join('\n\n');
  var typingTimer = null;
  var typing = false;

  function finishTyping() {
    clearTimeout(typingTimer);
    typing = false;
    body.textContent = fullText;
    body.classList.remove('typing');
    sign.classList.add('show');
  }

  function typeLetter() {
    var i = 0;
    sign.classList.remove('show');
    if (REDUCED) { finishTyping(); return; }
    typing = true;
    body.classList.add('typing');
    (function step() {
      i++;
      body.textContent = fullText.slice(0, i);
      if (i >= fullText.length) { finishTyping(); return; }
      typingTimer = setTimeout(step, fullText.charAt(i - 1) === '\n' ? 160 : 34);
    })();
  }

  function openLetter() {
    letter.hidden = false;
    typeLetter();
    closeBtn.focus();
    burst(window.innerWidth / 2, window.innerHeight * .55, 16);
  }

  function closeLetter() {
    clearTimeout(typingTimer);
    typing = false;
    letter.hidden = true;
    openBtn.focus();
  }

  openBtn.addEventListener('click', openLetter);
  closeBtn.addEventListener('click', closeLetter);
  letter.addEventListener('click', function (e) {
    if (e.target === letter) closeLetter();
    else if (typing && e.target !== closeBtn) finishTyping();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !letter.hidden) closeLetter();
  });
})();
