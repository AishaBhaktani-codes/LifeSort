export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    reveal: 650,
  },
  stagger: {
    item: 80,
    section: 120,
  },
  springConfig: {
    gentle: {
      damping: 15,
      mass: 0.8,
      stiffness: 100,
    },
    bouncy: {
      damping: 10,
      mass: 1,
      stiffness: 120,
    },
    /** Acctual-like smooth settle */
    smooth: {
      damping: 20,
      mass: 0.9,
      stiffness: 90,
    },
  },
};
