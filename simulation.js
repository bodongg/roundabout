// Simulation state + rules (no drawing here).
const Sim = {
  cars: [], speed: 90, rate: 1, paused: false, spawnT: 0, passed: 0,

  spawn() {
    const arm = Math.floor(Math.random() * 4);
    if (this.cars.some(c => c.phase === 'approach' && c.arm === arm && c.d > CONFIG.LEN - 40)) return;
    let exit;
    do { exit = Math.floor(Math.random() * 4); } while (exit === arm);
    this.cars.push({
      arm, exit, phase: 'approach', d: CONFIG.LEN, th: 0,
      rem: mod(CONFIG.ARMS[arm] - CONFIG.ARMS[exit]), // angle left to travel in ring
      x: 0, y: 0, hd: 0,
      color: `hsl(${Math.floor(Math.random() * 360)} 65% 55%)`,
    });
  },

  // Yield to any ring car approaching this car's entry point.
  mustYield(c) {
    const a = CONFIG.ARMS[c.arm];
    return this.cars.some(o => {
      if (o.phase !== 'ring') return false;
      const delta = mod(o.th - a);
      return delta < 1.0 || delta > CONFIG.TAU - 0.15;
    });
  },

  update(dt) {
    const { R, YIELD_DIST, CAR_GAP, LEN, cx, cy, LANE, ARMS } = CONFIG;
    for (const c of this.cars) {
      const a = ARMS[c.arm];
      if (c.phase === 'approach') {
        let gap = Infinity;
        for (const o of this.cars)
          if (o !== c && o.phase === 'approach' && o.arm === c.arm && o.d < c.d)
            gap = Math.min(gap, c.d - o.d);
        if (gap > CAR_GAP) {
          let nd = c.d - this.speed * dt;
          if (nd <= R + YIELD_DIST && c.d > R + YIELD_DIST && this.mustYield(c)) nd = R + YIELD_DIST;
          else if (c.d <= R + YIELD_DIST && c.d > R && nd < R + YIELD_DIST && this.mustYield(c)) nd = c.d;
          c.d = nd;
          if (c.d <= R) { c.phase = 'ring'; c.th = a; }
        }
      } else if (c.phase === 'ring') {
        const step = (this.speed / R) * dt;
        c.th -= step; c.rem -= step;            // counterclockwise
        if (c.rem <= 0) { c.phase = 'exit'; c.d = R; }
      } else {
        c.d += this.speed * dt;
        if (c.d > LEN) c.dead = true;
      }

      // position + heading
      let x, y;
      if (c.phase === 'ring') {
        x = cx + R * Math.cos(c.th); y = cy + R * Math.sin(c.th);
      } else {
        const ang = c.phase === 'approach' ? a : ARMS[c.exit];
        const ux = Math.cos(ang), uy = Math.sin(ang);
        const f = clamp((c.d - R) / 50, 0, 1), s = c.phase === 'approach' ? 1 : -1;
        x = cx + ux * c.d + uy * LANE * f * s;
        y = cy + uy * c.d - ux * LANE * f * s;
      }
      if (c.x || c.y) {
        const dx = x - c.x, dy = y - c.y;
        if (dx * dx + dy * dy > 0.01) c.hd = Math.atan2(dy, dx);
      } else c.hd = Math.atan2(cy - y, cx - x);
      c.x = x; c.y = y;
    }
    const before = this.cars.length;
    this.cars = this.cars.filter(c => !c.dead);
    this.passed += before - this.cars.length;
  },

  step(dt) {
    if (this.paused) return;
    this.spawnT += dt;
    if (this.spawnT > 1 / this.rate) { this.spawnT = 0; this.spawn(); }
    this.update(dt);
  },
};
