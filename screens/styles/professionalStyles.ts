import { 
    Briefcase, 
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
    Hand,
    Activity,
    Eye,
    Zap,
    Apple,
    LucideIcon,
    DumbbellIcon,
    PillIcon,
    GraduationCapIcon,
    BookOpenIcon,
    UsersIcon,
    BriefcaseIcon,
    HomeIcon,
    BookMarkedIcon,
    BookOpenCheckIcon,
    BookOpenTextIcon,
    ScaleIcon,
    AppleIcon,
    BabyIcon,
    BrainIcon,
    HeartIcon
} from "lucide-react-native";

// Professional types enum
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
    SAGE_FEMME: "Sage-femme",
    PUERICULTRICE: "Puéricultrice",
    KINESITHERAPEUTE: "Kinésithérapeute",
    PHARMACIEN: "Pharmacien",
    COACH: "Coach",
    AVOCAT: "Avocat",
    PROFESSEUR: "Professeur",
    ASSISTANTE_SOCIALE: "Assistante sociale",
    CONSEILLER_ORIENTATION: "Conseiller en orientation",
    MEDECIN: "Médecin",
    INFIRMIER: "Infirmier",
    ORTHOPHONISTE: "Orthophoniste",
    ERGOTHERAPEUTE: "Ergothérapeute",
    PSYCHOMOTRICIEN: "Psychomotricien",
    OSTEOPATHE: "Ostéopathe",
    ACUPUNCTEUR: "Acupuncteur"
} as const;

export type ProfessionalType = typeof ProfessionalTypes[keyof typeof ProfessionalTypes];

// Color and icon mappings for each professional type
export const professionalStyles = {
    DIETETICIEN: {
        icon: AppleIcon,
        color: "#0ca4a5",
        gradient: ["#0892a5", "#06908f", "#0ca4a5"],
        text: "#FFFFFF" // Luminance: ~94 (dark color)
    },
    SOPHROLOGUE: {
        icon: GraduationCapIcon,
        color: "#0ca4a5",
        gradient: ["#f84aa7", "#a74482", "#0ca4a5"],
        text: "#FFFFFF" // Luminance: ~94 (dark color)
    },
    AROMATHERAPEUTE: {
        icon: Flower,
        color: "#d6a184",
        gradient: ["#fec196", "#ffa686", "#d6a184"],
        text: "#333333" // Luminance: ~171 (light color)
    },
    COACH_VIE: {
        icon: HeartIcon,
        color: "#cad178",
        gradient: ["#c7aa74", "#d3d57c", "#cad178"],
        text: "#333333" // Luminance: ~188 (light color)
    },
    COACH_SEDUCTION: {
        icon: Sparkles,
        color: "#e8d7f1",
        gradient: ["#a167a5", "#d3bccc", "#e8d7f1"],
        text: "#333333" // Luminance: ~219 (light color)
    },
    COACH_SPORTIF: {
        icon: DumbbellIcon,
        color: "#ff9505",
        gradient: ["#ffc971", "#ffb627", "#ff9505"],
        text: "#333333" // Luminance: ~165 (light color)
    },
    ASTROLOGUE: {
        icon: Star,
        color: "#21295c",
        gradient: ["#065a82", "#1b3b6f", "#21295c"],
        text: "#FFFFFF" // Luminance: ~38 (dark color)
    },
    GRAPHOLOGUE: {
        icon: PenTool,
        color: "#ecf8f8",
        gradient: ["#e7d8c9", "#eee4e1", "#ecf8f8"],
        text: "#333333" // Luminance: ~241 (light color)
    },
    MAGNETISEUR: {
        icon: Magnet,
        color: "#cce3de",
        gradient: ["#f6fff8", "#eaf4f4", "#cce3de"],
        text: "#333333" // Luminance: ~215 (light color)
    },
    NATUROPATHE: {
        icon: Leaf,
        color: "#6b9080",
        gradient: ["#cce3de", "#a4c3b2", "#6b9080"],
        text: "#FFFFFF" // Luminance: ~132 (slightly dark, but close to threshold)
    },
    MUSICOTHERAPEUTE: {
        icon: Music,
        color: "#87bfff",
        gradient: ["#2667ff", "#3f8efc", "#87bfff"],
        text: "#333333" // Luminance: ~175 (light color)
    },
    NUMEROLOGUE: {
        icon: Hash,
        color: "#fbf7f0",
        gradient: ["#a47c41", "#f1e5d7", "#fbf7f0"],
        text: "#FFFFFF" // Luminance: ~245 (light color)
    },
    PSYCHANALYSTE: {
        icon: BrainCircuit,
        color: "#3f020b",
        gradient: ["#e60b43", "#670117", "#3f020b"],
        text: "#FFFFFF" // Luminance: ~19 (dark color)
    },
    PSYCHOLOGUE: {
        icon: HeartIcon,
        color: "#e0e2db",
        gradient: ["#b8bdb5", "#d2d4c8", "#e0e2db"],
        text: "#333333" // Luminance: ~225 (light color)
    },
    PSYCHOPRATICIEN: {
        icon: Brain,
        color: "#fdffe8",
        gradient: ["#fff9c5", "#ffdcc6", "#fdffe8"],
        text: "#333333" // Luminance: ~252 (light color)
    },
    BIO_ENERGETICIEN: {
        icon: Zap,
        color: "#7bdff2",
        gradient: ["#eff7f6", "#b2f7ef", "#7bdff2"],
        text: "#333333" // Luminance: ~198 (light color)
    },
    REIKI: {
        icon: Sparkles,
        color: "#e3f2fd",
        gradient: ["#90caf9", "#bbdefb", "#e3f2fd"],
        text: "#333333" // Luminance: ~235 (light color)
    },
    SHIATSU: {
        icon: Hand,
        color: "#ff8500",
        gradient: ["#ff9e00", "#ff9100", "#ff8500"],
        text: "#333333" // Luminance: ~149 (light color)
    },
    YOGA_THERAPEUTE: {
        icon: Activity,
        color: "#240046",
        gradient: ["#5a189a", "#3c096c", "#240046"],
        text: "#FFFFFF" // Luminance: ~15 (dark color)
    },
    HYPNOTISEUR: {
        icon: Eye,
        color: "#590d22",
        gradient: ["#a4133c", "#800f2f", "#590d22"],
        text: "#FFFFFF" // Luminance: ~34 (dark color)
    },
    PHYTOTHERAPEUTE: {
        icon: Leaf,
        color: "#355070",
        gradient: ["#b56576", "#6d597a", "#355070"],
        text: "#FFFFFF" // Luminance: ~74 (dark color)
    },
    SAGE_FEMME: {
        icon: BabyIcon,
        color: "#f84aa7",
        gradient: ["#f84aa7", "#a74482", "#0ca4a5"],
        text: "#ffffff"
    },
    PUERICULTRICE: {
        icon: BabyIcon,
        color: "#fec196",
        gradient: ["#fec196", "#ffa686", "#d6a184"],
        text: "#ffffff"
    },
    KINESITHERAPEUTE: {
        icon: DumbbellIcon,
        color: "#a167a5",
        gradient: ["#a167a5", "#d3bccc", "#e8d7f1"],
        text: "#ffffff"
    },
    PHARMACIEN: {
        icon: PillIcon,
        color: "#0892a5",
        gradient: ["#0892a5", "#06908f", "#0ca4a5"],
        text: "#ffffff"
    },
    COACH: {
        icon: GraduationCapIcon,
        color: "#f84aa7",
        gradient: ["#f84aa7", "#a74482", "#0ca4a5"],
        text: "#ffffff"
    },
    AVOCAT: {
        icon: ScaleIcon,
        color: "#fec196",
        gradient: ["#fec196", "#ffa686", "#d6a184"],
        text: "#ffffff"
    },
    PROFESSEUR: {
        icon: BookOpenIcon,
        color: "#c7aa74",
        gradient: ["#c7aa74", "#d3d57c", "#cad178"],
        text: "#ffffff"
    },
    ASSISTANTE_SOCIALE: {
        icon: UsersIcon,
        color: "#a167a5",
        gradient: ["#a167a5", "#d3bccc", "#e8d7f1"],
        text: "#ffffff"
    },
    CONSEILLER_ORIENTATION: {
        icon: BriefcaseIcon,
        color: "#0892a5",
        gradient: ["#0892a5", "#06908f", "#0ca4a5"],
        text: "#ffffff"
    },
    MEDECIN: {
        icon: HeartIcon,
        color: "#f84aa7",
        gradient: ["#f84aa7", "#a74482", "#0ca4a5"],
        text: "#ffffff"
    },
    INFIRMIER: {
        icon: HeartIcon,
        color: "#fec196",
        gradient: ["#fec196", "#ffa686", "#d6a184"],
        text: "#ffffff"
    },
    ORTHOPHONISTE: {
        icon: BookOpenCheckIcon,
        color: "#c7aa74",
        gradient: ["#c7aa74", "#d3d57c", "#cad178"],
        text: "#ffffff"
    },
    ERGOTHERAPEUTE: {
        icon: BookOpenTextIcon,
        color: "#a167a5",
        gradient: ["#a167a5", "#d3bccc", "#e8d7f1"],
        text: "#ffffff"
    },
    PSYCHOMOTRICIEN: {
        icon: BookMarkedIcon,
        color: "#0892a5",
        gradient: ["#0892a5", "#06908f", "#0ca4a5"],
        text: "#ffffff"
    },
    OSTEOPATHE: {
        icon: BriefcaseIcon,
        color: "#f84aa7",
        gradient: ["#f84aa7", "#a74482", "#0ca4a5"],
        text: "#ffffff"
    },
    ACUPUNCTEUR: {
        icon: HomeIcon,
        color: "#fec196",
        gradient: ["#fec196", "#ffa686", "#d6a184"],
        text: "#ffffff"
    }
} as const;

// Helper function to get random professional style
export const getRandomProfessionalStyle = () => {
    const styles = Object.values(professionalStyles);
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    return {
        colors: randomStyle.gradient,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 }
    };
}; 