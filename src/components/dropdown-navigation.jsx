import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Phone } from "lucide-react";

export function DropdownNavigation({ navItems }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHover, setIsHover] = useState(null);
  const [currentPath, setCurrentPath] = useState("");

  const handleHover = (menuLabel) => {
    setOpenMenu(menuLabel);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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

  const contactItem = navItems.find(item => item.label === "Kontakt");
  const desktopItems = navItems.filter(item => item.label !== "Kontakt");
  
  return (
    <main className="relative w-full flex items-center justify-end md:justify-between px-4">
      {/* DESKTOP MENU */}
      <div className="hidden md:flex relative gap-12 flex-col items-center justify-center flex-1">
        <ul className="relative flex items-center gap-10">
          {desktopItems.map((navItem) => {
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

      {contactItem && (
        <a 
          href="kontakt.html" 
          className="hidden md:flex bg-primary text-white font-bold h-14 px-10 items-center justify-center rounded-full text-lg shrink-0 ml-8 transition-transform active:scale-95 shadow-lg shadow-primary/20 hover:scale-105"
        >
          Kontakt
        </a>
      )}

      {/* MOBILE HEADER UTILS (Contact + Burger) */}
      <div className="flex md:hidden items-center gap-3">
         {contactItem && (
            <a 
              href="kontakt.html"
              className="flex items-center justify-center bg-primary text-white rounded-full p-2 w-10 h-10 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              aria-label="Kontakt"
            >
              <Phone className="w-5 h-5" />
            </a>
         )}
         <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center justify-center bg-surface border border-white/10 text-white rounded-full p-2 w-10 h-10 active:scale-95 transition-transform"
         >
            <Menu className="w-6 h-6" />
         </button>
      </div>

      {/* MOBILE HAMBURGER MENU OVERLAY */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                  key="mobile-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm md:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Floating Menu Window */}
              <motion.div
                  key="mobile-menu"
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[100] w-full h-full bg-[#0a0a0a] md:hidden overflow-hidden flex flex-col"
              >
                  {/* Header (Close only) */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                    <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Menu</span>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Menu Items */}
                  <div className="p-4 flex flex-col gap-1">
                    
                    {/* DOMOV Button */}
                    <div className="border-b border-white/5 last:border-0">
                         <a 
                            href="index.html"
                            className="text-sm font-bold uppercase tracking-wide cursor-pointer flex items-center justify-between py-2 text-white hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            DOMOV
                          </a>
                    </div>

                    {navItems.map((item) => {
                   const active = isActive(item);
                   return (
                     <div key={item.label} className="border-b border-white/5 last:border-0">
                       {item.subMenus ? (
                         <details className="group" open>
                           <summary className={`text-sm font-bold uppercase tracking-wide cursor-pointer flex items-center justify-between py-2 ${active ? "text-primary" : "text-white"}`}>
                             <a 
                               href={item.link || "#"}
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setIsMobileMenuOpen(false);
                               }}
                               className="hover:text-primary"
                             >
                               {item.label}
                             </a>
                           </summary>
                           <div className="pb-2 pl-3 flex flex-col gap-1">
                              {item.subMenus.flatMap(sub => sub.items).map(subItem => (
                                 <a 
                                    href={subItem.link} 
                                    key={subItem.label}
                                    className="text-white/60 hover:text-primary text-xs font-medium block py-1 transition-colors flex items-center gap-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                 >
                                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                    {subItem.label}
                                 </a>
                              ))}
                           </div>
                         </details>
                       ) : (
                         <a 
                           href={item.link || "#"}
                           className={`text-sm font-bold uppercase tracking-wide block py-2 ${active ? "text-primary" : "text-white"}`}
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           {item.label}
                         </a>
                       )}
                     </div>
                   );
                 })}
                 
                  </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </main>
  );
}
