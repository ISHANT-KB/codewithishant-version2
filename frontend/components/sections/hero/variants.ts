import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 44, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.215, 0.61, 0.355, 1] },
  },
};

export const watermarkVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 0.032,
    scale: 1,
    transition: { duration: 2, ease: "easeOut" },
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, delay: 0.75 } },
};
