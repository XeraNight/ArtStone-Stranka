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
    id: 2,
    label: "Naše výhody",
    link: "technicke-parametre.html",
  },
  {
    id: 3,
    label: "Proces spolupráce",
    link: "proces-spoluprace.html",
    subMenus: [
      {
        title: "Spolupráca",
        items: [
          {
            label: "Montáž",
            link: "montaz.html",
            icon: Hammer,
            desc: "Inštalácia a technické info"
          }
        ]
      }
    ]
  },
  {
    id: 5,
    label: "Realizácie",
    link: "realizacie.html",
  },
  {
    id: 6,
    label: "Katalóg",
    link: "katalog.html",
  },
  {
    id: 7,
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
