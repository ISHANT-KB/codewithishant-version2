export const PRESETS = [
  {
    label: "Build Pipeline",
    V: 7,
    nodes: ["FETCH", "PARSE", "COMPILE", "TEST", "BUNDLE", "LINT", "DEPLOY"],
    edges: [
      [0, 1],
      [0, 5],
      [1, 2],
      [5, 2],
      [2, 3],
      [2, 4],
      [3, 6],
      [4, 6],
    ],
    pos: [
      [80, 170],
      [220, 80],
      [360, 170],
      [280, 290],
      [440, 290],
      [220, 280],
      [560, 200],
    ],
  },
  {
    label: "Courses",
    V: 6,
    nodes: ["CS101", "CS201", "CS301", "MATH", "CS401", "FINAL"],
    edges: [
      [0, 1],
      [0, 3],
      [1, 2],
      [3, 2],
      [2, 4],
      [3, 4],
      [4, 5],
      [2, 5],
    ],
    pos: [
      [80, 170],
      [230, 80],
      [380, 170],
      [230, 280],
      [530, 170],
      [680, 170],
    ],
  },
  {
    label: "Tasks",
    V: 8,
    nodes: ["A", "B", "C", "D", "E", "F", "G", "H"],
    edges: [
      [0, 2],
      [0, 3],
      [1, 3],
      [1, 4],
      [2, 5],
      [3, 5],
      [3, 6],
      [4, 6],
      [5, 7],
      [6, 7],
    ],
    pos: [
      [80, 170],
      [80, 310],
      [240, 100],
      [240, 250],
      [240, 370],
      [400, 170],
      [400, 310],
      [560, 240],
    ],
  },
];

export const WHITE = 0;
export const GRAY = 1;
export const BLACK = 2;

export const getSpeedMs = (sliderValue: number): number => 1050 - sliderValue * 110;