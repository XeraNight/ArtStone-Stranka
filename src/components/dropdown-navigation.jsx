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
  const [currentPath, setCurrentPath] = useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const isActive = (navItem) => {
    const link = navItem.link;
    if (!link) return false;
    // Normalize path to handle trailing slashes or full URLs if necessary
    const path = currentPath.split("/").pop() || "index.html"; 
    
    // Handle root path
    if (path === "" && link === "index.html") return true; 
    
    // Exact match for the filename
    if (path === link) return true;

    // Check submenus
    if (navItem.subMenus) {
      return navItem.subMenus.some(sub => 
        sub.items.some(item => {
           const itemLink = item.link.split("/").pop(); // Handle full paths in submenus if necessary
           return itemLink === path;
        })
      );
    }

    return false;
  };
  
  return (
    <main className="relative w-full flex items-start md:items-center justify-between px-4">
      <div className="relative gap-12 flex flex-col items-center justify-center flex-1">
        <ul className="relative flex items-center gap-10">
          {navItems.filter(item => item.label !== "Kontakt").map((navItem) => {
            const active = isActive(navItem);
            return (
            <li
              key={navItem.label}
              className="relative"
              onMouseEnter={() => {
                if (navItem.subMenus) {
                  handleHover(navItem.label);
                }
              }}
              onMouseLeave={() => handleHover(null)}
            >
              <a
                href={navItem.link || "#"}
                className={`text-xl font-bold py-3 px-3 flex cursor-pointer group transition-all duration-300 items-center justify-center gap-1 relative whitespace-nowrap
                  ${active 
                    ? "text-primary scale-110" 
                    : "text-slate-900/80 dark:text-white/80 hover:text-primary dark:hover:text-primary"
                  }`}
                onMouseEnter={() => {
                  if (navItem.subMenus) {
                    setIsHover(navItem.id);
                  }
                }}
                onMouseLeave={() => setIsHover(null)}
              >
                <span>{navItem.label}</span>
                {navItem.subMenus && (
                  <ChevronDown
                    className={`h-5 w-5 group-hover:rotate-180 duration-300 transition-transform
                      ${openMenu === navItem.label ? "rotate-180" : ""}`}
                  />
                )}
                {(isHover === navItem.id || openMenu === navItem.label) && navItem.subMenus && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute inset-0 size-full bg-primary/10"
                    style={{ borderRadius: 99 }}
                  />
                )}
              </a>

              <AnimatePresence>
                {openMenu === navItem.label && navItem.subMenus && (
                  <div className="w-auto absolute left-0 top-full pt-4 z-50">
                    <motion.div
                      className="bg-background-light dark:bg-surface border border-slate-200 dark:border-border-muted p-6 w-max shadow-2xl"
                      style={{ borderRadius: 24 }}
                      layoutId="menu"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-fit shrink-0 flex space-x-12 overflow-hidden">
                        {navItem.subMenus.map((sub) => (
                          <motion.div layout className="w-full" key={sub.title}>
                            <h3 className="mb-6 text-base font-bold capitalize text-slate-900/60 dark:text-white/60 tracking-wider">
                              {sub.title}
                            </h3>
                            <ul className="space-y-6">
                              {sub.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <li key={item.label}>
                                    <a
                                      href={item.link || "#"}
                                      className="flex items-start space-x-4 group"
                                    >
                                      <div className="border border-slate-200 dark:border-border-muted text-slate-900 dark:text-white rounded-lg flex items-center justify-center size-10 shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                                        <Icon className="h-5 w-5 flex-none" />
                                      </div>
                                      <div className="leading-5 w-max">
                                        <p className="text-base font-bold text-slate-900 dark:text-white shrink-0 mb-1">
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
            );
          })}
        </ul>
      </div>

      {navItems.find(item => item.label === "Kontakt") && (
        <a 
          href="kontakt.html" 
          className="bg-primary text-white font-bold h-14 px-10 flex items-center justify-center rounded-full text-lg shrink-0 ml-8 transition-transform active:scale-95 shadow-lg shadow-primary/20 hover:scale-105"
        >
          Kontakt
        </a>
      )}
    </main>
  );
}
