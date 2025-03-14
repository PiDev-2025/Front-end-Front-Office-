import { 
  Apple,
  Brain,
  Flower,
  Heart,
  Sparkles,
  Dumbbell,
  Star,
  PenTool,
  Magnet,
  Leaf,
  Music,
  Hash,
  BrainCircuit,
  Zap,
  Hand,
  Activity,
  Eye,
} from "lucide-react-native";

export const ProfessionalTypes = {
  DIETETICIEN: "Diététicien",
  SOPHROLOGUE: "Sophrologue",
  AROMATHERAPEUTE: "Aromathérapeute",
  COACH_VIE: "Coach de vie",
  COACH_SEDUCTION: "Coach en séduction",
  COACH_SPORTIF: "Coach sportif",
  ASTROLOGUE: "Astrologue",
  GRAPHOLOGUE: "Graphologue",
  MAGNETISEUR: "Magnétiseur",
  NATUROPATHE: "Naturopathe",
  MUSICOTHERAPEUTE: "Musicothérapeute",
  NUMEROLOGUE: "Numérologue",
  PSYCHANALYSTE: "Psychanalyste",
  PSYCHOLOGUE: "Psychologue",
  PSYCHOPRATICIEN: "Psycho praticien",
  BIO_ENERGETICIEN: "Bio énergéticien",
  REIKI: "Reiki",
  SHIATSU: "Shiatsu",
  YOGA_THERAPEUTE: "Yoga thérapeute",
  HYPNOTISEUR: "Hypnotiseur",
  PHYTOTHERAPEUTE: "Phytothérapeute",
} as const;

export type ProfessionalType = typeof ProfessionalTypes[keyof typeof ProfessionalTypes];

interface ProfessionalStyle {
  icon: any; // This is a React component
  color: string;
  gradient: string[];
  text: string;
}

export const professionalStyles: Record<keyof typeof ProfessionalTypes, ProfessionalStyle> = {
  DIETETICIEN: {
    icon: Apple,
    color: "#0ca4a5",
    gradient: ["#0892a5", "#06908f", "#0ca4a5"],
    text: "#FFFFFF"
  },
  SOPHROLOGUE: {
    icon: Brain,
    color: "#0ca4a5",
    gradient: ["#f84aa7", "#a74482", "#0ca4a5"],
    text: "#FFFFFF"
  },
  AROMATHERAPEUTE: {
    icon: Flower,
    color: "#d6a184",
    gradient: ["#fec196", "#ffa686", "#d6a184"],
    text: "#333333"
  },
  COACH_VIE: {
    icon: Heart,
    color: "#cad178",
    gradient: ["#c7aa74", "#d3d57c", "#cad178"],
    text: "#333333"
  },
  COACH_SEDUCTION: {
    icon: Sparkles,
    color: "#e8d7f1",
    gradient: ["#a167a5", "#d3bccc", "#e8d7f1"],
    text: "#333333"
  },
  COACH_SPORTIF: {
    icon: Dumbbell,
    color: "#ff9505",
    gradient: ["#ffc971", "#ffb627", "#ff9505"],
    text: "#333333"
  },
  ASTROLOGUE: {
    icon: Star,
    color: "#21295c",
    gradient: ["#065a82", "#1b3b6f", "#21295c"],
    text: "#FFFFFF"
  },
  GRAPHOLOGUE: {
    icon: PenTool,
    color: "#ecf8f8",
    gradient: ["#e7d8c9", "#eee4e1", "#ecf8f8"],
    text: "#333333"
  },
  MAGNETISEUR: {
    icon: Magnet,
    color: "#cce3de",
    gradient: ["#f6fff8", "#eaf4f4", "#cce3de"],
    text: "#333333"
  },
  NATUROPATHE: {
    icon: Leaf,
    color: "#6b9080",
    gradient: ["#cce3de", "#a4c3b2", "#6b9080"],
    text: "#FFFFFF"
  },
  MUSICOTHERAPEUTE: {
    icon: Music,
    color: "#87bfff",
    gradient: ["#2667ff", "#3f8efc", "#87bfff"],
    text: "#333333"
  },
  NUMEROLOGUE: {
    icon: Hash,
    color: "#fbf7f0",
    gradient: ["#a47c41", "#f1e5d7", "#fbf7f0"],
    text: "#FFFFFF"
  },
  PSYCHANALYSTE: {
    icon: BrainCircuit,
    color: "#3f020b",
    gradient: ["#e60b43", "#670117", "#3f020b"],
    text: "#FFFFFF"
  },
  PSYCHOLOGUE: {
    icon: Brain,
    color: "#e0e2db",
    gradient: ["#b8bdb5", "#d2d4c8", "#e0e2db"],
    text: "#333333"
  },
  PSYCHOPRATICIEN: {
    icon: Brain,
    color: "#fdffe8",
    gradient: ["#fff9c5", "#ffdcc6", "#fdffe8"],
    text: "#333333"
  },
  BIO_ENERGETICIEN: {
    icon: Zap,
    color: "#7bdff2",
    gradient: ["#eff7f6", "#b2f7ef", "#7bdff2"],
    text: "#333333"
  },
  REIKI: {
    icon: Sparkles,
    color: "#e3f2fd",
    gradient: ["#90caf9", "#bbdefb", "#e3f2fd"],
    text: "#333333"
  },
  SHIATSU: {
    icon: Hand,
    color: "#ff8500",
    gradient: ["#ff9e00", "#ff9100", "#ff8500"],
    text: "#333333"
  },
  YOGA_THERAPEUTE: {
    icon: Activity,
    color: "#240046",
    gradient: ["#5a189a", "#3c096c", "#240046"],
    text: "#FFFFFF"
  },
  HYPNOTISEUR: {
    icon: Eye,
    color: "#590d22",
    gradient: ["#a4133c", "#800f2f", "#590d22"],
    text: "#FFFFFF"
  },
  PHYTOTHERAPEUTE: {
    icon: Leaf,
    color: "#355070",
    gradient: ["#b56576", "#6d597a", "#355070"],
    text: "#FFFFFF"
  }
}; 