// Wiring: game loop + UI controls.
const ctx = document.getElementById('c').getContext('2d');
const $ = (id) => document.getElementById(id);

$('rate').oninput  = (e) => { Sim.rate = +e.target.value;  $('rv').textContent = Sim.rate.toFixed(1); };
$('speed').oninput = (e) => { Sim.speed = +e.target.value; $('sv').textContent = Sim.speed; };
$('pause').onclick = (e) => { Sim.paused = !Sim.paused; e.target.textContent = Sim.paused ? 'Resume' : 'Pause'; };
$('clear').onclick = () => { Sim.cars = []; };

let last = performance.now();
function loop(t) {
  const dt = Math.min((t - last) / 1000, 0.05); last = t;
  Sim.step(dt);
  render(ctx);
  $('on').textContent = Sim.cars.length;
  $('done').textContent = Sim.passed;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
