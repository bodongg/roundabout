// All tunable constants live here.
const CONFIG = {
  cx: 400, cy: 300,          // roundabout center
  R: 110,                    // ring lane radius
  LANE: 7,                   // lane offset from road centerline
  LEN: 330,                  // arm length from center
  ROAD_W: 50,                // road width
  CAR_GAP: 28,               // min gap between queued cars
  YIELD_DIST: 24,            // stop-line distance before the ring
  TAU: Math.PI * 2,
  ARMS: [0, Math.PI / 2, Math.PI, -Math.PI / 2], // E, S, W, N
};
