import { motion } from "framer-motion";

/*
  NEX3 wordmark reconstructed from geometric segments so each piece can
  "assemble" into place like a machine building itself.
  viewBox: -24 -24 588 188  (letters span x:0..540, y:0..140)
*/

const T = 22; // bar thickness
const H = 140;

const SEGMENTS = [
  // N (x 0..110)
  { id: "n-l", d: `M0 0 h${T} v${H} h-${T} Z`, from: { x: -160, y: -60, r: -40 } },
  { id: "n-d", d: `M0 0 L30 0 L110 ${H} L80 ${H} Z`, from: { x: 0, y: -180, r: 30 } },
  { id: "n-r", d: `M88 0 h${T} v${H} h-${T} Z`, from: { x: -120, y: 120, r: 25 } },

  // E (x 150..250)
  { id: "e-v", d: `M150 0 h${T} v${H} h-${T} Z`, from: { x: -60, y: -160, r: -25 } },
  { id: "e-t", d: `M150 0 h100 v${T} h-100 Z`, from: { x: 140, y: -120, r: 20 } },
  { id: "e-m", d: `M150 59 h86 v${T} h-86 Z`, from: { x: 200, y: 0, r: -30 } },
  { id: "e-b", d: `M150 118 h100 v${T} h-100 Z`, from: { x: 120, y: 150, r: 18 } },

  // X (x 290..400)
  { id: "x-1", d: `M290 0 L318 0 L400 ${H} L372 ${H} Z`, from: { x: 0, y: -200, r: -45 } },
  { id: "x-2", d: `M372 0 L400 0 L318 ${H} L290 ${H} Z`, from: { x: 0, y: 200, r: 45 } },

  // 3  (x 440..540)  right vertical + three bars
  { id: "t-v", d: `M518 0 h${T} v${H} h-${T} Z`, from: { x: 180, y: -40, r: 35 } },
  { id: "t-t", d: `M440 0 h100 v${T} h-100 Z`, from: { x: 160, y: -140, r: -22 } },
  { id: "t-m", d: `M452 59 h88 v${T} h-88 Z`, from: { x: 220, y: 20, r: 28 } },
  { id: "t-b", d: `M440 118 h100 v${T} h-100 Z`, from: { x: 150, y: 160, r: -18 } },
];

export default function Nex3Logo({
  animate = true,
  className = "",
  color = "#F4F3EE",
  delay = 0.2,
  testId = "nex3-logo",
}) {
  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.055, delayChildren: delay },
    },
  };

  const seg = {
    hidden: (c) => ({
      opacity: 0,
      x: c.from.x,
      y: c.from.y,
      rotate: c.from.r,
      scale: 0.6,
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 140, damping: 15, mass: 0.9 },
    },
  };

  return (
    <svg
      data-testid={testId}
      className={className}
      viewBox="-24 -24 588 188"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="NEX3"
    >
      <motion.g
        variants={animate ? container : undefined}
        initial={animate ? "hidden" : false}
        animate={animate ? "visible" : false}
      >
        {SEGMENTS.map((s) => (
          <motion.path
            key={s.id}
            d={s.d}
            custom={s}
            variants={animate ? seg : undefined}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </motion.g>
    </svg>
  );
}
