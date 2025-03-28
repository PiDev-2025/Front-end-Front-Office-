import React, { memo, useState } from "react";
import { StyleSheet, Platform, PermissionsAndroid, NativeModules, Pressable } from "react-native";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import LinearGradient from 'react-native-linear-gradient';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// Individual GlueStack UI imports from components/ui
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Checkbox, CheckboxIndicator } from "@/components/ui/checkbox";
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
    LucideIcon 
} from "lucide-react-native";

// Types
interface MoodEntry {
    id: string;
    timestamp: string;
    value: number;
    emotions: string[];
    audioNote?: string;
}

// Jotai atoms
const moodEntriesAtom = atomWithStorage<MoodEntry[]>("moodEntries", []);
const currentMoodAtom = atomWithStorage<number>("currentMood", 50);

// Audio recorder instance
const audioRecorderPlayer = new AudioRecorderPlayer();

// Mood options with icons
const MOOD_OPTIONS = [
    { value: 0, icon: Angry, label: "Very Bad" },
    { value: 20, icon: Frown, label: "Bad" },
    { value: 40, icon: Meh, label: "Neutral" },
    { value: 60, icon: Smile, label: "Good" },
    { value: 80, icon: Laugh, label: "Very Good" },
    { value: 100, icon: Heart, label: "Excellent" }
];

// Emotion options with icons
const EMOTION_OPTIONS = [
    { id: "smart", icon: Brain, label: "Smart" },
    { id: "excited", icon: Zap, label: "Excited" },
    { id: "energized", icon: Star, label: "Energized" },
    { id: "focused", icon: Target, label: "Focused" },
    { id: "creative", icon: Lightbulb, label: "Creative" },
    { id: "calm", icon: Coffee, label: "Calm" },
    { id: "happy", icon: Smile, label: "Happy" },
    { id: "confident", icon: Sparkles, label: "Confident" },
    { id: "peaceful", icon: Heart, label: "Peaceful" },
    { id: "grateful", icon: Star, label: "Grateful" }
];

// Mood Card Component
interface MoodCardProps {
    entry: MoodEntry;
}

const MoodCard = memo(({ entry }: MoodCardProps) => {
    const getMoodIcon = (value: number) => {
        if (value >= 70) return Smile;
        if (value <= 30) return Frown;
        return Meh;
    };

    const getMoodColor = (value: number) => {
        if (value >= 70) return "#22C55E"; // Green
        if (value <= 30) return "#EF4444"; // Red
        return "#F59E0B"; // Yellow
    };

    const getMoodGradient = (value: number) => {
        if (value >= 70) return ["#22C55E", "#16A34A", "#15803D"];
        if (value <= 30) return ["#EF4444", "#DC2626", "#B91C1C"];
        return ["#F59E0B", "#D97706", "#B45309"];
    };

    const Icon = getMoodIcon(entry.value);
    const color = getMoodColor(entry.value);
    const gradient = getMoodGradient(entry.value);

    return (
        <Card className="py-5 pr-5 rounded-lg my-3 relative bg-white/10 border-white/20">
            <Box
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: 3,
                    top: 0,
                    overflow: 'hidden',
                }}
            >
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    colors={gradient}
                    style={StyleSheet.absoluteFill}
                />
            </Box>

            <VStack space="md">
                <HStack space="md" style={{ alignItems: 'center' }}>
                    <Box className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
                        <Icon size={24} color={color} />
                    </Box>
                    <VStack space="xs" style={{ flex: 1 }}>
                        <HStack space="sm" style={{ alignItems: 'center' }}>
                            <Text size="sm" bold style={{ color: color }}>
                                {entry.value}%
                            </Text>
                            <Text size="xs" style={{ color: "#ffffff80" }}>
                                {new Date(entry.timestamp).toLocaleString()}
                            </Text>
                        </HStack>
                        {entry.audioNote && (
                            <Text size="sm" italic style={{ color: "#ffffff80" }}>
                                Audio note: {entry.audioNote}
                            </Text>
                        )}
                    </VStack>
                </HStack>
            </VStack>
        </Card>
    );
});

MoodCard.displayName = 'MoodCard';

// Main MoodLab Component
const MoodLab = memo(() => {
    const [moodEntries, setMoodEntries] = useAtom(moodEntriesAtom);
    const [currentMood, setCurrentMood] = useAtom(currentMoodAtom);
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordPath, setRecordPath] = useState('');
    const [textNote, setTextNote] = useState('');

    const handleSaveMood = () => {
        const newEntry: MoodEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            value: currentMood,
            emotions: selectedEmotions,
            audioNote: recordPath || undefined
        };

        setMoodEntries(prev => [newEntry, ...prev]);
        setSelectedEmotions([]);
        setRecordPath('');
        setTextNote('');
    };

    // Request microphone permission
    const requestPermission = async () => {
        try {
            if (Platform.OS === 'ios') {
                // For iOS, we need to handle permissions in the native layer
                // The app should request microphone permissions when it starts
                // We'll just check if we can record
                return true;
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
        } catch (err) {
            console.warn('Permission error:', err);
            return false;
        }
    };

    // Start recording
    const onStartRecord = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
            console.log('Microphone permission denied');
            return;
        }

        const path = 'recording.m4a';
        const audioSet = {
            AudioEncoder: AudioRecorderPlayer.AudioEncoderAAC,
            AudioSamplingRate: 44100,
            AudioQuality: 'High',
            AudioChannels: 2,
        };

        try {
            const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
            setRecordPath(uri);
            setIsRecording(true);
            audioRecorderPlayer.addRecordBackListener((e) => {
                console.log('Recording time:', e.currentPosition);
            });
        } catch (error) {
            console.error('Start recording error:', error);
        }
    };

    // Stop recording
    const onStopRecord = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            setIsRecording(false);
            console.log('Recording stopped, file saved at:', result);
        } catch (error) {
            console.error('Stop recording error:', error);
        }
    };

    const toggleEmotion = (emotionId: string) => {
        setSelectedEmotions(prev => {
            if (prev.includes(emotionId)) {
                return prev.filter(id => id !== emotionId);
            }
            if (prev.length >= 3) {
                return prev;
            }
            return [...prev, emotionId];
        });
    };

    const getMoodColor = (value: number) => {
        if (value >= 70) return "#22C55E"; // Green
        if (value <= 30) return "#EF4444"; // Red
        return "#F59E0B"; // Yellow
    };

    const getMoodGradient = (value: number) => {
        if (value >= 70) return ["#22C55E", "#16A34A", "#15803D"];
        if (value <= 30) return ["#EF4444", "#DC2626", "#B91C1C"];
        return ["#F59E0B", "#D97706", "#B45309"];
    };

    const currentColor = getMoodColor(currentMood);
    const currentGradient = getMoodGradient(currentMood);

    return (
        <Box className="p-4">
            <VStack space="xl">
                {/* Current Mood Section */}
                <Card className="p-6 rounded-xl bg-white/10 border-white/20">
                    <VStack space="md">
                        <Heading size="lg" style={{ color: "#ffffff" }}>
                            Comment vous sentez-vous ?
                        </Heading>
                        
                        <VStack space="md">
                            <Box>
                                <HStack space="sm" className="mb-2">
                                    <Text size="sm" style={{ color: "#ffffff" }}>Mood:</Text>
                                    <Text size="sm" bold style={{ color: currentColor }}>
                                        {currentMood}%
                                    </Text>
                                </HStack>
                                <Box style={{ position: 'relative' }}>
                                    <Progress size="lg" value={100}>
                                        <ProgressFilledTrack>
                                            <LinearGradient
                                                start={{x: 0, y: 0}}
                                                end={{x: 1, y: 0}}
                                                colors={["#EF4444", "#F59E0B", "#22C55E"]}
                                                style={StyleSheet.absoluteFill}
                                            />
                                        </ProgressFilledTrack>
                                    </Progress>
                                    <Box style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                                        <Progress size="lg" value={currentMood}>
                                            <ProgressFilledTrack>
                                                <LinearGradient
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 1, y: 0}}
                                                    colors={currentGradient}
                                                    style={StyleSheet.absoluteFill}
                                                />
                                            </ProgressFilledTrack>
                                        </Progress>
                                    </Box>
                                </Box>

                                {/* Hidden Mood Selection Icons */}
                                <HStack space="md" className="mt-4 justify-between">
                                    {MOOD_OPTIONS.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = currentMood === option.value;
                                        const iconColor = isSelected ? currentColor : "#ffffff80";
                                        
                                        return (
                                            <Pressable
                                                key={option.value}
                                                onPress={() => setCurrentMood(option.value)}
                                                className="p-2 rounded-full"
                                                style={{
                                                    backgroundColor: isSelected ? `${currentColor}20` : 'transparent',
                                                    borderWidth: isSelected ? 1 : 0,
                                                    borderColor: currentColor
                                                }}
                                            >
                                                <Icon size={24} color={iconColor} />
                                            </Pressable>
                                        );
                                    })}
                                </HStack>
                            </Box>

                            <Box className="mt-4">
                                <Text size="sm" style={{ color: "#ffffff" }} className="mb-2">
                                    Sélectionnez jusqu'à 3 émotions
                                </Text>
                                <HStack space="md" style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                    {EMOTION_OPTIONS.map((emotion) => {
                                        const Icon = emotion.icon;
                                        const isSelected = selectedEmotions.includes(emotion.id);
                                        return (
                                            <Checkbox
                                                key={emotion.id}
                                                value={isSelected ? "checked" : "unchecked"}
                                                onChange={() => toggleEmotion(emotion.id)}
                                                size="sm"
                                                isDisabled={!isSelected && selectedEmotions.length >= 3}
                                                style={{ borderWidth: 0 }}
                                            >
                                                <CheckboxIndicator style={{ borderWidth: 0 }}>
                                                    <Box 
                                                        className="p-2 rounded-full" 
                                                        style={{ 
                                                            backgroundColor: isSelected ? `${currentColor}20` : 'transparent',
                                                            borderWidth: isSelected ? 1 : 0,
                                                            borderColor: currentColor
                                                        }}
                                                    >
                                                        <Icon 
                                                            size={24} 
                                                            color={isSelected ? currentColor : "#ffffff80"} 
                                                        />
                                                    </Box>
                                                </CheckboxIndicator>
                                            </Checkbox>
                                        );
                                    })}
                                </HStack>
                            </Box>

                            <Box>
                                <Text size="sm" style={{ color: "#ffffff" }} className="mb-2">
                                    Note (optionnel)
                                </Text>
                                <VStack space="sm">
                                    <Input>
                                        <InputField
                                            value={textNote}
                                            onChangeText={setTextNote}
                                            placeholder="Écrivez votre note ici..."
                                            style={{ color: "#ffffff" }}
                                            placeholderTextColor="#ffffff80"
                                        />
                                    </Input>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onPress={isRecording ? onStopRecord : onStartRecord}
                                        style={{
                                            borderColor: "#ffffff",
                                        }}
                                    >
                                        <ButtonText style={{ color: "#ffffff" }}>
                                            {isRecording ? 'Arrêter l\'enregistrement' : 'Enregistrer une note vocale'}
                                        </ButtonText>
                                    </Button>
                                </VStack>
                            </Box>

                            <Button
                                variant="solid"
                                size="md"
                                onPress={handleSaveMood}
                                style={{
                                    backgroundColor: "#ffffff",
                                }}
                            >
                                <ButtonText style={{ color: "#6366f1" }}>
                                    Enregistrer
                                </ButtonText>
                            </Button>
                        </VStack>
                    </VStack>
                </Card>

                {/* Mood History Section */}
                <VStack space="md">
                    <Heading size="md" style={{ color: "#ffffff" }}>
                        Historique
                    </Heading>
                    {moodEntries.map((entry) => (
                        <MoodCard
                            key={entry.id}
                            entry={entry}
                        />
                    ))}
                </VStack>
            </VStack>
        </Box>
    );
});

MoodLab.displayName = 'MoodLab';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
});

export default MoodLab; 