import { 
    Smile, 
    Frown, 
    Meh, 
    Angry, 
    Laugh, 
    Heart,
    Brain,
    Zap,
    Star,
    Target,
    Lightbulb,
    Coffee,
    Sparkles,
    LucideIcon,
    Scale,
    Leaf,
    Circle,
    AlertTriangle,
    AlertCircle,
    AlertOctagon,
    Moon,
    AlertSquare,
    Sun,
    Cloud,
    Wind,
    Droplets,
    Flame,
    Shield,
    Trophy,
    Medal,
    Award,
    Clock,
    Timer,
    Calendar,
    CalendarDays,
    CalendarCheck,
    CalendarX,
    CalendarClock,
    CalendarHeart,
    CalendarStar,
    CalendarPlus,
    CalendarMinus,
    Eye,
    Anchor,
    HelpCircle
} from "lucide-react-native";

// Import gradients from professional styles
import { professionalStyles } from './professionalStyles';

// Mood types enum
export const MoodTypes = {
    VERY_BAD: "Very Bad",
    BAD: "Bad",
    NEUTRAL: "Neutral",
    GOOD: "Good",
    VERY_GOOD: "Very Good",
    EXCELLENT: "Excellent"
} as const;

export type MoodType = typeof MoodTypes[keyof typeof MoodTypes];

// Emotion types enum
export const EmotionTypes = {
    SMART: "Smart",
    EXCITED: "Excited",
    ENERGIZED: "Energized",
    FOCUSED: "Focused",
    CREATIVE: "Creative",
    CALM: "Calm",
    HAPPY: "Happy",
    CONFIDENT: "Confident",
    PEACEFUL: "Peaceful",
    GRATEFUL: "Grateful"
} as const;

export type EmotionType = typeof EmotionTypes[keyof typeof EmotionTypes];

// Helper function to convert readonly array to mutable array
const toMutableArray = <T>(arr: readonly T[]): T[] => [...arr];

// Mood options with icons and styles
export const moodOptions = [
    { 
        value: 0, 
        icon: Angry, 
        label: MoodTypes.VERY_BAD,
        style: {
            color: "#e60b43",
            gradient: toMutableArray(professionalStyles.PSYCHANALYSTE.gradient),
            text: "#FFFFFF"
        }
    },
    { 
        value: 20, 
        icon: Frown, 
        label: MoodTypes.BAD,
        style: {
            color: "#ff8500",
            gradient: toMutableArray(professionalStyles.SHIATSU.gradient),
            text: "#333333"
        }
    },
    { 
        value: 40, 
        icon: Meh, 
        label: MoodTypes.NEUTRAL,
        style: {
            color: "#c7aa74",
            gradient: toMutableArray(professionalStyles.COACH_VIE.gradient),
            text: "#333333"
        }
    },
    { 
        value: 60, 
        icon: Smile, 
        label: MoodTypes.GOOD,
        style: {
            color: "#6b9080",
            gradient: toMutableArray(professionalStyles.NATUROPATHE.gradient),
            text: "#FFFFFF"
        }
    },
    { 
        value: 80, 
        icon: Laugh, 
        label: MoodTypes.VERY_GOOD,
        style: {
            color: "#87bfff",
            gradient: toMutableArray(professionalStyles.MUSICOTHERAPEUTE.gradient),
            text: "#333333"
        }
    },
    { 
        value: 100, 
        icon: Heart, 
        label: MoodTypes.EXCELLENT,
        style: {
            color: "#f84aa7",
            gradient: toMutableArray(professionalStyles.SAGE_FEMME.gradient),
            text: "#FFFFFF"
        }
    }
] as const;

// Emotion options with icons and styles
export const emotionOptions = {
    good: [
        {
            id: 'smart',
            label: 'Smart',
            icon: Brain,
            style: {
                color: '#22C55E',
                gradient: ['#22C55E', '#16A34A']
            }
        },
        {
            id: 'excited',
            label: 'Excited',
            icon: Zap,
            style: {
                color: '#F59E0B',
                gradient: ['#F59E0B', '#D97706']
            }
        },
        {
            id: 'energized',
            label: 'Energized',
            icon: Star,
            style: {
                color: '#EC4899',
                gradient: ['#EC4899', '#DB2777']
            }
        },
        {
            id: 'focused',
            label: 'Focused',
            icon: Target,
            style: {
                color: '#8B5CF6',
                gradient: ['#8B5CF6', '#7C3AED']
            }
        },
        {
            id: 'creative',
            label: 'Creative',
            icon: Lightbulb,
            style: {
                color: '#06B6D4',
                gradient: ['#06B6D4', '#0891B2']
            }
        },
        {
            id: 'confident',
            label: 'Confident',
            icon: Shield,
            style: {
                color: '#3B82F6',
                gradient: ['#3B82F6', '#2563EB']
            }
        },
        {
            id: 'accomplished',
            label: 'Accomplished',
            icon: Trophy,
            style: {
                color: '#F59E0B',
                gradient: ['#F59E0B', '#D97706']
            }
        },
        {
            id: 'grateful',
            label: 'Grateful',
            icon: Heart,
            style: {
                color: '#EC4899',
                gradient: ['#EC4899', '#DB2777']
            }
        },
        {
            id: 'inspired',
            label: 'Inspired',
            icon: Flame,
            style: {
                color: '#F97316',
                gradient: ['#F97316', '#EA580C']
            }
        },
        {
            id: 'optimistic',
            label: 'Optimistic',
            icon: Sun,
            style: {
                color: '#EAB308',
                gradient: ['#EAB308', '#CA8A04']
            }
        }
    ],
    neutral: [
        {
            id: 'calm',
            label: 'Calm',
            icon: Coffee,
            style: {
                color: '#6B7280',
                gradient: ['#6B7280', '#4B5563']
            }
        },
        {
            id: 'peaceful',
            label: 'Peaceful',
            icon: Sparkles,
            style: {
                color: '#9CA3AF',
                gradient: ['#9CA3AF', '#6B7280']
            }
        },
        {
            id: 'balanced',
            label: 'Balanced',
            icon: Scale,
            style: {
                color: '#A1A1AA',
                gradient: ['#A1A1AA', '#71717A']
            }
        },
        {
            id: 'mindful',
            label: 'Mindful',
            icon: Leaf,
            style: {
                color: '#94A3B8',
                gradient: ['#94A3B8', '#64748B']
            }
        },
        {
            id: 'centered',
            label: 'Centered',
            icon: Circle,
            style: {
                color: '#CBD5E1',
                gradient: ['#CBD5E1', '#94A3B8']
            }
        },
        {
            id: 'present',
            label: 'Present',
            icon: Clock,
            style: {
                color: '#9CA3AF',
                gradient: ['#9CA3AF', '#6B7280']
            }
        },
        {
            id: 'aware',
            label: 'Aware',
            icon: Eye,
            style: {
                color: '#A1A1AA',
                gradient: ['#A1A1AA', '#71717A']
            }
        },
        {
            id: 'grounded',
            label: 'Grounded',
            icon: Anchor,
            style: {
                color: '#94A3B8',
                gradient: ['#94A3B8', '#64748B']
            }
        },
        {
            id: 'steady',
            label: 'Steady',
            icon: Wind,
            style: {
                color: '#CBD5E1',
                gradient: ['#CBD5E1', '#94A3B8']
            }
        },
        {
            id: 'content',
            label: 'Content',
            icon: Cloud,
            style: {
                color: '#9CA3AF',
                gradient: ['#9CA3AF', '#6B7280']
            }
        }
    ],
    bad: [
        {
            id: 'anxious',
            label: 'Anxious',
            icon: AlertTriangle,
            style: {
                color: '#EF4444',
                gradient: ['#EF4444', '#DC2626']
            }
        },
        {
            id: 'frustrated',
            label: 'Frustrated',
            icon: AlertCircle,
            style: {
                color: '#F97316',
                gradient: ['#F97316', '#EA580C']
            }
        },
        {
            id: 'overwhelmed',
            label: 'Overwhelmed',
            icon: AlertOctagon,
            style: {
                color: '#F43F5E',
                gradient: ['#F43F5E', '#E11D48']
            }
        },
        {
            id: 'tired',
            label: 'Tired',
            icon: Moon,
            style: {
                color: '#6B7280',
                gradient: ['#6B7280', '#4B5563']
            }
        },
        {
            id: 'stressed',
            label: 'Stressed',
            icon: AlertSquare,
            style: {
                color: '#EAB308',
                gradient: ['#EAB308', '#CA8A04']
            }
        },
        {
            id: 'worried',
            label: 'Worried',
            icon: Droplets,
            style: {
                color: '#3B82F6',
                gradient: ['#3B82F6', '#2563EB']
            }
        },
        {
            id: 'disappointed',
            label: 'Disappointed',
            icon: CalendarX,
            style: {
                color: '#8B5CF6',
                gradient: ['#8B5CF6', '#7C3AED']
            }
        },
        {
            id: 'confused',
            label: 'Confused',
            icon: HelpCircle,
            style: {
                color: '#F59E0B',
                gradient: ['#F59E0B', '#D97706']
            }
        },
        {
            id: 'irritated',
            label: 'Irritated',
            icon: Flame,
            style: {
                color: '#F97316',
                gradient: ['#F97316', '#EA580C']
            }
        },
        {
            id: 'sad',
            label: 'Sad',
            icon: Cloud,
            style: {
                color: '#6B7280',
                gradient: ['#6B7280', '#4B5563']
            }
        }
    ]
};

// Helper function to get mood style by value
export const getMoodStyle = (value: number) => {
    const mood = moodOptions.find(m => m.value === value) || moodOptions[2]; // Default to neutral
    return mood.style;
};

// Helper function to get emotion style by id
export const getEmotionStyle = (id: string) => {
    const emotion = emotionOptions.find(e => e.id === id) || emotionOptions[0];
    return emotion.style;
}; 