import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { DropdownNavigation } from "./components/dropdown-navigation";
import { 
  Users, History, Briefcase, 
  MessageSquare, PenTool, Hammer, 
  LayoutTemplate, Building2, Volume2, 
  Camera, PlayCircle, FileText, HelpCircle, 
  Image, ArrowLeftRight, Instagram, 
  Mail, MapPin, Phone,
  Shield, Layers, Zap, Scale
} from "lucide-react";


const navItems = [
  {
    id: 1,
    label: "Produkty",
    link: "produkty.html",
  },
  {
    id: 7,
    label: "Naše výhody",
    link: "technicke-parametre.html",
  },
  {
    id: 2,
    label: "Proces spolupráce",
    link: "proces-spoluprace.html",
    subMenus: [
      {
        title: "Spolupráca",
        items: [
           { label: "Proces spolupráce", description: "Ako pracujeme", icon: MessageSquare, link: "proces-spoluprace.html" },
           { label: "Montáž", description: "Odborná inštalácia a podpora", icon: Hammer, link: "montaz.html" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Realizácie",
    link: "realizacie.html",
  },
  {
    id: 8,
    label: "Kontakt",
    link: "kontakt.html",
  },
];

const rootElement = document.getElementById("nav-root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <DropdownNavigation navItems={navItems} />
    </React.StrictMode>
  );
}
