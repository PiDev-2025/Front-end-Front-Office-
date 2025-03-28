import React, { memo, useState } from "react";
import { StyleSheet, Platform, PermissionsAndroid, NativeModules, ScrollView, Modal, View } from "react-native";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import LinearGradient from 'react-native-linear-gradient';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useToast } from "@/components/ui/toast";

// Import styles
import { moodOptions, emotionOptions, getMoodStyle, getEmotionStyle } from "@/screens/styles/moodLabStyles";

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
import { Pressable } from "@/components/ui/pressable";
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
    Pen,
    Mic,
    X
} from "lucide-react-native";
import { MoodChart } from './MoodChart';

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

// Mood Card Component
interface MoodCardProps {
    entry: MoodEntry;
}

const MoodCard = memo(({ entry }: MoodCardProps) => {
    const moodStyle = getMoodStyle(entry.value);
    const Icon = moodOptions.find(m => m.value === entry.value)?.icon || Meh;

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
                    colors={moodStyle.gradient}
                    style={StyleSheet.absoluteFill}
                />
            </Box>

            <VStack space="md">
                <HStack space="md" style={{ alignItems: 'center' }}>
                    <Box className="p-2 rounded-full" style={{ backgroundColor: `${moodStyle.color}20` }}>
                        <Icon size={24} color={moodStyle.color} />
                    </Box>
                    <VStack space="xs" style={{ flex: 1 }}>
                        <HStack space="sm" style={{ alignItems: 'center' }}>
                            <Text size="sm" bold style={{ color: moodStyle.color }}>
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
    const [activeTab, setActiveTab] = useState<'good' | 'neutral' | 'bad'>('good');
    const [showTextDialog, setShowTextDialog] = useState(false);
    const toast = useToast();

    const currentMoodStyle = getMoodStyle(currentMood);

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
                toast.show({
                    placement: "top",
                    render: () => (
                        <Box className="bg-white p-4 rounded-lg mx-4 mt-4 shadow-lg">
                            <Text style={{ color: "#1a1c2e" }}>
                                Vous ne pouvez sélectionner que 3 émotions maximum
                            </Text>
                        </Box>
                    ),
                });
                return prev;
            }
            return [...prev, emotionId];
        });
    };

    return (
        <Box style={styles.container}>
            <LinearGradient
                colors={['#1a1c2e', '#2d1b3d', '#1f2937']}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
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
                                            <Text size="sm" bold style={{ color: currentMoodStyle.color }}>
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
                                                            colors={currentMoodStyle.gradient}
                                                            style={StyleSheet.absoluteFill}
                                                        />
                                                    </ProgressFilledTrack>
                                                </Progress>
                                            </Box>
                                        </Box>

                                        {/* Hidden Mood Selection Icons */}
                                        <HStack space="md" className="mt-4 justify-between">
                                            {moodOptions.map((option) => {
                                                const Icon = option.icon;
                                                const isSelected = currentMood === option.value;
                                                const style = option.style;
                                                
                                                return (
                                                    <Pressable
                                                        key={option.value}
                                                        onPress={() => setCurrentMood(option.value)}
                                                        className="p-2 rounded-full"
                                                        style={{
                                                            backgroundColor: isSelected ? `${style.color}20` : 'transparent',
                                                            borderWidth: isSelected ? 1 : 0,
                                                            borderColor: style.color
                                                        }}
                                                    >
                                                        <Icon size={24} color={isSelected ? style.color : "#ffffff80"} />
                                                    </Pressable>
                                                );
                                            })}
                                        </HStack>
                                    </Box>

                                    <Box className="mt-4">
                                        <Text size="sm" style={{ color: "#ffffff" }} className="mb-2">
                                            Sélectionnez jusqu'à 3 émotions
                                        </Text>
                                        
                                        {/* Emotion Category Tabs */}
                                        <HStack space="md" className="mb-4 justify-center">
                                            <Pressable
                                                onPress={() => setActiveTab('good')}
                                                className={`px-6 py-3 rounded-full ${activeTab === 'good' ? 'bg-white/20' : 'bg-white/10'}`}
                                                style={{ minWidth: 100 }}
                                            >
                                                <Text size="md" style={{ color: activeTab === 'good' ? '#ffffff' : '#ffffff80' }}>
                                                    Positives
                                                </Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => setActiveTab('neutral')}
                                                className={`px-6 py-3 rounded-full ${activeTab === 'neutral' ? 'bg-white/20' : 'bg-white/10'}`}
                                                style={{ minWidth: 100 }}
                                            >
                                                <Text size="md" style={{ color: activeTab === 'neutral' ? '#ffffff' : '#ffffff80' }}>
                                                    Neutres
                                                </Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => setActiveTab('bad')}
                                                className={`px-6 py-3 rounded-full ${activeTab === 'bad' ? 'bg-white/20' : 'bg-white/10'}`}
                                                style={{ minWidth: 100 }}
                                            >
                                                <Text size="md" style={{ color: activeTab === 'bad' ? '#ffffff' : '#ffffff80' }}>
                                                    Négatives
                                                </Text>
                                            </Pressable>
                                        </HStack>

                                        {/* Emotion Grid */}
                                        <VStack space="sm">
                                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                                <HStack key={rowIndex} space="sm" style={{ justifyContent: 'space-between' }}>
                                                    {emotionOptions[activeTab].slice(rowIndex * 2, rowIndex * 2 + 2).map((emotion) => {
                                                        const Icon = emotion.icon;
                                                        const isSelected = selectedEmotions.includes(emotion.id);
                                                        const style = emotion.style;
                                                        const gradient = isSelected ? style.gradient : ["#ffffff10", "#ffffff05"];
                                                        
                                                        return (
                                                            <Pressable
                                                                key={emotion.id}
                                                                onPress={() => toggleEmotion(emotion.id)}
                                                                style={{
                                                                    flex: 1,
                                                                    height: 60,
                                                                    borderRadius: 12,
                                                                    overflow: 'hidden',
                                                                    opacity: !isSelected && selectedEmotions.length >= 3 ? 0.5 : 1,
                                                                    backgroundColor: 'transparent',
                                                                }}
                                                            >
                                                                <HStack 
                                                                    space="sm" 
                                                                    style={{ 
                                                                        flex: 1, 
                                                                        alignItems: 'center', 
                                                                        paddingHorizontal: 12,
                                                                        borderWidth: isSelected ? 1 : 0,
                                                                        borderColor: style.color,
                                                                        borderRadius: 12,
                                                                        backgroundColor: 'transparent',
                                                                    }}
                                                                >
                                                                    <Box 
                                                                        className="p-2 rounded-full"
                                                                        style={{
                                                                            backgroundColor: isSelected ? `${style.color}20` : 'transparent',
                                                                        }}
                                                                    >
                                                                        <Icon 
                                                                            size={24} 
                                                                            color={isSelected ? style.color : "#ffffff80"} 
                                                                        />
                                                                    </Box>
                                                                    <Text 
                                                                        size="sm" 
                                                                        style={{ 
                                                                            color: isSelected ? style.color : "#ffffff80",
                                                                            flex: 1
                                                                        }}
                                                                    >
                                                                        {emotion.label}
                                                                    </Text>
                                                                </HStack>
                                                            </Pressable>
                                                        );
                                                    })}
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </Box>

                                    <Box>
                                        <Text size="sm" style={{ color: "#ffffff" }} className="mb-2">
                                            Note (optionnel)
                                        </Text>
                                        <HStack space="md" className="justify-center">
                                            <Pressable
                                                onPress={() => setShowTextDialog(true)}
                                                className={`px-6 py-3 rounded-full ${textNote ? 'bg-white/20' : 'bg-white/10'}`}
                                                style={{ minWidth: 100 }}
                                            >
                                                <HStack space="sm" style={{ alignItems: 'center' }}>
                                                    <Pen size={20} color={textNote ? "#ffffff" : "#ffffff80"} />
                                                    <Text size="md" style={{ color: textNote ? '#ffffff' : '#ffffff80' }}>
                                                        Texte
                                                    </Text>
                                                </HStack>
                                            </Pressable>
                                            <Pressable
                                                onPress={isRecording ? onStopRecord : onStartRecord}
                                                className={`px-6 py-3 rounded-full ${isRecording ? 'bg-red-500/20' : 'bg-white/10'}`}
                                                style={{ minWidth: 100 }}
                                            >
                                                <HStack space="sm" style={{ alignItems: 'center' }}>
                                                    <Mic 
                                                        size={20} 
                                                        color={isRecording ? "#ef4444" : "#ffffff80"} 
                                                    />
                                                    <Text 
                                                        size="md" 
                                                        style={{ 
                                                            color: isRecording ? '#ef4444' : '#ffffff80'
                                                        }}
                                                    >
                                                        Audio
                                                    </Text>
                                                </HStack>
                                            </Pressable>
                                        </HStack>

                                        {/* Text Note Modal */}
                                        <Modal
                                            visible={showTextDialog}
                                            transparent
                                            animationType="fade"
                                            onRequestClose={() => setShowTextDialog(false)}
                                        >
                                            <View style={styles.modalOverlay}>
                                                <Card className="p-6 rounded-xl bg-white" style={styles.modalContent}>
                                                    <VStack space="md" style={{ height: '100%' }}>
                                                        <HStack space="md" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Text size="lg" style={{ color: "#1a1c2e" }}>
                                                                Ajouter une note
                                                            </Text>
                                                            <Pressable onPress={() => setShowTextDialog(false)}>
                                                                <X size={24} color="#1a1c2e" />
                                                            </Pressable>
                                                        </HStack>
                                                        
                                                        <Input style={{ flex: 1 }}>
                                                            <InputField
                                                                value={textNote}
                                                                onChangeText={setTextNote}
                                                                placeholder="Écrivez votre note ici..."
                                                                multiline
                                                                numberOfLines={4}
                                                                style={{ 
                                                                    color: "#1a1c2e",
                                                                    textAlignVertical: 'top',
                                                                    height: '100%'
                                                                }}
                                                                placeholderTextColor="#1a1c2e80"
                                                            />
                                                        </Input>

                                                        <Button
                                                            variant="outline"
                                                            onPress={() => setShowTextDialog(false)}
                                                        >
                                                            <ButtonText style={{ color: "#1a1c2e" }}>
                                                                Fermer
                                                            </ButtonText>
                                                        </Button>
                                                    </VStack>
                                                </Card>
                                            </View>
                                        </Modal>
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
                            
                            {/* Mood Chart */}
                            <Card className="p-4 rounded-xl bg-white/10 border-white/20">
                                <MoodChart moodEntries={moodEntries} />
                            </Card>

                            {/* Mood Entries List */}
                            {moodEntries.map((entry) => (
                                <MoodCard
                                    key={entry.id}
                                    entry={entry}
                                />
                            ))}
                        </VStack>
                    </VStack>
                </Box>
            </ScrollView>
        </Box>
    );
});

MoodLab.displayName = 'MoodLab';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    contentContainer: {
        flexGrow: 1,
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 0,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '40%',
        margin: 0,
        borderRadius: 20,
        position: 'absolute',
        top: '30%',
    },
});

export default MoodLab; 