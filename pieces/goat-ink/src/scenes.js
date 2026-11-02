// =====================================================================
//  SCENES — NBA GOAT, crosshatch ink. World 1080x1080; TT on 2s; ev / popS for events.
// =====================================================================
// the hero: the style's ink dot turned into a basketball (seams inked over it); original character
function ballHero(x, y, r, o = {}) {
  const P = dotHero(x, y, r, o);
  const k = (o.key ?? 'hero') + 'seam';
  ink(arcPts(x - r * 1.35, y, r * 1.05, -0.62, 0.62, 18), { w: r * 0.055, color: C.ink, key: k + 'l', amt: 0.4 });
  ink(arcPts(x + r * 1.35, y, r * 1.05, Math.PI - 0.62, Math.PI + 0.62, 18), { w: r * 0.055, color: C.ink, key: k + 'r', amt: 0.4 });
  ink([[x - r * 0.96, y + r * 0.25], [x, y + r * 0.34], [x + r * 0.96, y + r * 0.25]], { w: r * 0.055, color: C.ink, key: k + 'h', amt: 0.4 });
  return P;
}
// a jersey: shoulders, sleeves, body; hatched shadow; number in hand lettering
function jersey(x, y, w, fill, num, key, o = {}) {
  const h = w * 1.1, s = o.s ?? 1; if (s <= 0.01) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s);
  const P = resample([[-w * 0.28, -h / 2], [-w * 0.1, -h / 2 + w * 0.08], [w * 0.1, -h / 2 + w * 0.08], [w * 0.28, -h / 2], [w / 2, -h / 2 + w * 0.16], [w * 0.36, -h / 2 + w * 0.36], [w * 0.3, -h / 2 + w * 0.3], [w * 0.3, h / 2], [-w * 0.3, h / 2], [-w * 0.3, -h / 2 + w * 0.3], [-w * 0.36, -h / 2 + w * 0.36], [-w / 2, -h / 2 + w * 0.16]], true, 60);
  paint(P, { fill, key, line: o.dark ? C.peri : C.ink, w: 3.5, tex: [{ k: 'hatch', a: 0.8, gap: 5, al: 0.35, dens: (px, py) => clamp((px + py) / w + 0.4) }, { k: 'pencil', c: '#fff6e0', al: 0.25, per: 60 }] });
  handText(num, -handW(num, w * 0.42) / 2, w * 0.22, w * 0.42, o.numColor ?? C.cream, { key: key + 'n' });
  ctx.restore();
}
function sceneAsk() {
  woodSurface(-40, -40, W + 40, H + 40, 'desk', {});
  ctx.save(); ctx.translate(150, 120); ctx.rotate(-0.04);
  paint(box(0, 0, 780, 300), { fill: C.yellowL, key: 'note', w: 3, tex: [{ k: 'pencil', c: C.yellow, al: 0.5, per: 80 }] });
  handText("who's your", 50, 120, 76, C.ink, { key: 'q1', frac: ev(Q.who + 0.2, 0.6) });
  handText('NBA GOAT?', 50, 230, 104, C.red, { key: 'q2', frac: ev(Q.who + 0.8, 0.7) });
  planInk(ellipsePts(270, 195, 260, 70, -0.03, 40), { closed: true, key: 'ring', frac: ev(Q.who + 1.5, 0.5) });
  ctx.restore();
  const bounce = Math.abs(Math.sin(TT * 4.2)) * 70 * clamp(1 - (TT - Q.who) / 2.5, 0.15, 1);
  ballHero(540, 640 - bounce, 120, { key: 'hero', mood: TT > Q.who + 1 ? 'wow' : 'smile' });
  inkMug(900, 820, 90, 'mug');
}
function sceneOptions() {
  paperSheet('board');
  const cards = [['23', '#5b3a8c', 'LeBron?'], ['24', '#4b2a74', 'Kobe?'], ['30', '#2a5aa8', 'Steph?']];
  cards.forEach(([n, c, l], i) => {
    const x = 200 + i * 340, y = 300, t = Q.greatest + 0.15 + i * 0.25;
    jersey(x, y, 240, c, n, 'j' + i, { s: popS(t), rot: [-0.06, 0.04, -0.03][i] });
    if (TT > t + 0.15) handText(l, x - handW(l, 54) / 2, y + 230, 54, C.ink, { key: 'l' + i, frac: ev(t + 0.15, 0.4) });
    asterisk(x, y - 160, 8, 18, 6, 0, C.red, 4);
  });
  const look = Math.floor((TT - Q.greatest) / 0.5) % 3;
  ballHero(540, 860, 95, { key: 'hero', mood: 'smile' });
  planInk(ellipsePts(200 + look * 340, 300, 160, 170, 0, 40), { closed: true, key: 'pick' + look, frac: ev(Q.greatest + 0.5 * Math.floor((TT - Q.greatest) / 0.5), 0.35) });
}
function sceneThink() {
  darkWorld('inside');
  hexGrid({ x0: -40, y0: 820, x1: W + 40, y1: H + 40 }, 60, { key: 'hex' });
  for (let i = 0; i < 26; i++) { const R = RNG('st', i); star4(R.r(30, 1050), R.r(30, 800), R.r(3, 8) * (0.7 + 0.3 * ((B + i) % 2)), C.white); }
  const spd = 0.9 + (TT - 8.6) * 0.55;
  [['23', '#5b3a8c'], ['24', '#4b2a74'], ['30', '#2a5aa8']].forEach(([n, c], i) => {
    const a = (TT - 8.6) * spd + (i / 3) * TAU;
    jersey(540 + Math.cos(a) * 330, 450 + Math.sin(a) * 150, 150, c, n, 'oj' + i, { dark: true });
  });
  ballHero(540, 450, 105, { key: 'hero', dark: true, mood: 'smile' });
  // a clock whose hand spins faster
  const cx = 880, cy = 160;
  ink(ellipsePts(cx, cy, 80, 80, 0, 40), { closed: true, w: 5, color: C.peri, key: 'clock' });
  const ang = (TT - 8.6) * (2 + (TT - 8.6) * 2);
  ink([[cx, cy], [cx + Math.sin(ang) * 62, cy - Math.cos(ang) * 62]], { w: 6, color: C.cyan, key: 'hand' });
  monoText(`thinking… ${(TT - Q.think + 0.6).toFixed(1)}s`, 70, 130, 44, C.white, { key: 'tk' });
}
function sceneReveal() {
  paperSheet('reveal');
  if (TT < Q.della - 0.15) {
    handText('gotta be…', 260, 420, 110, C.ink, { key: 'gb', frac: ev(Q.gotta + 0.1, 0.6) });
    ballHero(540, 720, 100, { key: 'hero', mood: 'smile' });
    return;
  }
  sparkBurst(540, 330, 300, { key: 'burst', t0: Q.della - 0.1 });
  jersey(540, 330, 300, '#8a1c2c', '8', 'della', { s: popS(Q.della - 0.15), rot: -0.04, numColor: C.yellow });
  handText('Dellavedova?!', 540 - handW('Dellavedova?!', 96) / 2, 640, 96, C.red, { key: 'dn', frac: ev(Q.della + 0.25, 0.7) });
  planInk(ellipsePts(540, 330, 250, 260, 0, 48), { closed: true, key: 'circ', frac: ev(Q.della + 0.6, 0.5) });
  const fall = clamp((TT - Q.della - 0.3) / 0.5);
  ctx.save(); ctx.translate(880, 860); ctx.rotate(fall * 1.4); ballHero(0, 0, 80, { key: 'hero', mood: 'wow' }); ctx.restore();
}
function sceneTension() {
  woodSurface(-40, -40, W + 40, H + 40, 'desk2', {});
  const j = Math.sin(TT * 60) * 6;
  for (let i = 0; i < 4; i++) ink([[120 + i * 40, 520 + i * 70], [220 + i * 40, 490 + i * 70], [320 + i * 40, 540 + i * 70], [420 + i * 40, 500 + i * 70]], { w: 5, color: C.red, key: 'zz' + i });
  for (let i = 0; i < 4; i++) ink([[960 - i * 40, 520 + i * 70], [860 - i * 40, 490 + i * 70], [760 - i * 40, 540 + i * 70], [660 - i * 40, 500 + i * 70]], { w: 5, color: C.red, key: 'zr' + i });
  ballHero(540 + j, 600, 140, { key: 'hero', mood: 'wow' });
  const d = (TT * 1.8) % 1; ctx.fillStyle = C.sky; ctx.beginPath(); ctx.ellipse(700 + j, 470 + d * 120, 14, 22, 0, 0, TAU); ctx.fill();
  handText('the tension…', 220, 220, 110, C.red, { key: 'tn', frac: ev(16.6, 0.7) });
}
