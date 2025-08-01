"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathName}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
