import React from "react";
import ReactDOM from "react-dom/client";
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
    label: "O nás",
    link: "o-nas.html",
    subMenus: [
      {
        title: "O spoločnosti",
        items: [
          { label: "Náš príbeh", description: "História a vízia Artstone", icon: History, link: "o-nas.html#pribeh" },
          { label: "Tím expertov", description: "Ľudia za našim úspechom", icon: Users, link: "o-nas.html#tim" },
          { label: "Kariéra", description: "Pridajte sa k nám", icon: Briefcase, link: "o-nas.html#kariera" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Proces spolupráce",
    link: "proces-spoluprace.html",
    subMenus: [
      {
        title: "Ako pracujeme",
        items: [
          { label: "Konzultácia", description: "Úvodné stretnutie a zameranie", icon: MessageSquare, link: "proces-spoluprace.html#konzultacia" },
          { label: "Návrh", description: "3D vizualizácia na mieru", icon: PenTool, link: "proces-spoluprace.html#navrh" },
          { label: "Realizácia", description: "Výroba a odborná montáž", icon: Hammer, link: "proces-spoluprace.html#realizacia" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Produkty",
    link: "produkty.html",
    subMenus: [
      {
        title: "Kategórie",
        items: [
          { label: "Interiérové panely", description: "Luxusné drevené a kamenné dekory", icon: LayoutTemplate, link: "produkty.html#interier" },
          { label: "Exteriérové fasády", description: "Odolné a bezúdržbové riešenia", icon: Building2, link: "produkty.html#exterier" },
          { label: "Akustické riešenia", description: "Pre dokonalé ticho domova", icon: Volume2, link: "produkty.html#akustika" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Realizácie",
    link: "realizacie.html",
    subMenus: [
      {
        title: "Projekty",
        items: [
          { label: "Rezidenčné", description: "Vily a byty", icon: LayoutTemplate, link: "realizacie.html#rezidencne" },
          { label: "Komerčné", description: "Hotely a kancelárie", icon: Building2, link: "realizacie.html#komercne" },
          { label: "Exteriér", description: "Fasády a terasy", icon: Image, link: "realizacie.html#exterier" },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Montáž",
    link: "montaz.html",
    subMenus: [
      {
        title: "Podpora",
        items: [
          { label: "Video návody", description: "Krok za krokom", icon: PlayCircle, link: "montaz.html#navody" },
          { label: "Technická dokumentácia", description: "Parametre a certifikáty", icon: FileText, link: "montaz.html#dokumentacia" },
          { label: "FAQ", description: "Často kladené otázky", icon: HelpCircle, link: "montaz.html#faq" },
        ],
      },
    ],
  },
  {
    id: 6,
    label: "Inšpirácie",
    link: "inspiracie.html",
    subMenus: [
      {
        title: "Galéria",
        items: [
          { label: "Realizácie", description: "Ukážky našich projektov", icon: Image, link: "realizacie.html" },
          { label: "Pred a Po", description: "Transformácie priestorov", icon: ArrowLeftRight, link: "inspiracie.html#premeny" },
          { label: "Social", description: "Sledujte nás na Instagrame", icon: Instagram, link: "https://instagram.com" },
        ],
      },
    ],
  },
  {
    id: 7,
    label: "Technické parametre",
    link: "technicke-parametre.html",
    subMenus: [
      {
        title: "Dáta & Parametre",
        items: [
          { label: "Špecifikácia", description: "Detailné technické listy", icon: Scale, link: "technicke-parametre.html#specifikacia" },
          { label: "Bezpečnosť", description: "Nehorľavosť A2 a certifikáty", icon: Shield, link: "technicke-parametre.html#bezpecnost" },
          { label: "Zloženie", description: "Materiálová báza", icon: Layers, link: "technicke-parametre.html#zlozenie" },
          { label: "Benefity", description: "Prečo práve Artstone", icon: Zap, link: "technicke-parametre.html#vyhody" },
        ],
      },
    ],
  },
  {
    id: 8,
    label: "Kontakt",
    link: "kontakt.html",
    subMenus: [
      {
        title: "Kontaktujte nás",
        items: [
          { label: "Napíšte nám", description: "Kontaktný formulár", icon: Mail, link: "kontakt.html#form-section" },
          { label: "Showroomy", description: "Navštívte nás osobne", icon: MapPin, link: "#showrooms" },
          { label: "Zavolajte", description: "+421 900 000 000", icon: Phone, link: "tel:+421900000000" },
        ],
      },
    ],
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
