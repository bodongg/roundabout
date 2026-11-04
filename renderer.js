// Drawing only: reads Sim, never changes it.
function render(ctx) {
  const { cx, cy, R, ROAD_W, ARMS, TAU } = CONFIG;
  ctx.fillStyle = cssVar('--grass'); ctx.fillRect(0, 0, 800, 600);

  ctx.strokeStyle = cssVar('--road'); ctx.lineWidth = ROAD_W;
  for (const a of ARMS) {
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * 400, cy + Math.sin(a) * 400); ctx.stroke();
  }
  ctx.lineWidth = ROAD_W + 2;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();

  ctx.fillStyle = cssVar('--island');
  ctx.beginPath(); ctx.arc(cx, cy, R - 26, 0, TAU); ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; ctx.setLineDash([10, 10]);
  for (const a of ARMS) {
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (R + 26), cy + Math.sin(a) * (R + 26));
    ctx.lineTo(cx + Math.cos(a) * 400, cy + Math.sin(a) * 400); ctx.stroke();
  }
  ctx.setLineDash([]);

  for (const c of Sim.cars) {
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.hd);
    ctx.fillStyle = c.color; ctx.fillRect(-9, -5, 18, 10);
    ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillRect(2, -4, 4, 8); // windshield
    ctx.restore();
  }
}
