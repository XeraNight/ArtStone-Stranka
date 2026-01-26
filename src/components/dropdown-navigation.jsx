import { useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function DropdownNavigation({ navItems }) {
  const [openMenu, setOpenMenu] = React.useState(null);

  const handleHover = (menuLabel) => {
    setOpenMenu(menuLabel);
  };




  const [isHover, setIsHover] = useState(null);
  
  return (
    <main className="relative w-full flex items-start md:items-center justify-center px-4 py-2">
      <div className="relative gap-5 flex flex-col items-center justify-center">
        <ul className="relative flex items-center space-x-0">
          {navItems.map((navItem) => (
            <li
              key={navItem.label}
              className="relative"
              onMouseEnter={() => handleHover(navItem.label)}
              onMouseLeave={() => handleHover(null)}
            >
              <a
                href={navItem.link || "#"}
                className="text-sm py-1.5 px-4 flex cursor-pointer group transition-colors duration-300 items-center justify-center gap-1 text-slate-900/60 dark:text-white/60 hover:text-slate-900 dark:hover:text-white relative"
                onMouseEnter={() => setIsHover(navItem.id)}
                onMouseLeave={() => setIsHover(null)}
              >
                <span>{navItem.label}</span>
                {navItem.subMenus && (
                  <ChevronDown
                    className={`h-4 w-4 group-hover:rotate-180 duration-300 transition-transform
                      ${openMenu === navItem.label ? "rotate-180" : ""}`}
                  />
                )}
                {(isHover === navItem.id || openMenu === navItem.label) && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute inset-0 size-full bg-primary/10"
                    style={{ borderRadius: 99 }}
                  />
                )}
              </a>

              <AnimatePresence>
                {openMenu === navItem.label && navItem.subMenus && (
                  <div className="w-auto absolute left-0 top-full pt-2 z-50">
                    <motion.div
                      className="bg-background-light dark:bg-surface border border-slate-200 dark:border-border-muted p-4 w-max shadow-xl"
                      style={{ borderRadius: 16 }}
                      layoutId="menu"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-fit shrink-0 flex space-x-9 overflow-hidden">
                        {navItem.subMenus.map((sub) => (
                          <motion.div layout className="w-full" key={sub.title}>
                            <h3 className="mb-4 text-sm font-medium capitalize text-slate-900/60 dark:text-white/60">
                              {sub.title}
                            </h3>
                            <ul className="space-y-6">
                              {sub.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <li key={item.label}>
                                    <a
                                      href={item.link || "#"}
                                      className="flex items-start space-x-3 group"
                                    >
                                      <div className="border border-slate-200 dark:border-border-muted text-slate-900 dark:text-white rounded-md flex items-center justify-center size-9 shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                                        <Icon className="h-5 w-5 flex-none" />
                                      </div>
                                      <div className="leading-5 w-max">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white shrink-0">
                                          {item.label}
                                        </p>
                                        <p className="text-xs text-slate-900/60 dark:text-white/60 shrink-0 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                                          {item.description}
                                        </p>
                                      </div>
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
