import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import LinearGradient from 'react-native-linear-gradient';

// Individual GlueStack UI imports from components/ui
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";

// Types
interface Program {
    id: string;
    name: string;
    image: string;
    description: string;
    duration: string;
    level: string;
    price: string;
    [key: string]: unknown;
}

// Jotai atoms
const programsAtom = atomWithStorage<Program[]>("programs", []);

// Program Card Component
interface ProgramCardProps {
    program: Program;
}

const ProgramCard = memo(({ program }: ProgramCardProps) => {
    return (
        <Card className="py-5 pr-5 rounded-lg my-3 relative">
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
                    colors={['#0892a5', '#06908f', '#0ca4a5']}
                    style={StyleSheet.absoluteFill}
                />
            </Box>

            <VStack space="md">
                <HStack space="md" style={{ alignItems: 'flex-start' }}>
                    <VStack space="xs" style={{ width: 110 }}>
                        <Box className="rounded-lg overflow-hidden">
                            <Image
                                source={{
                                    uri: program.image || "https://via.placeholder.com/150",
                                }}
                                alt={`${program.name}'s image`}
                                style={{
                                    width: 110,
                                    height: 110,
                                }}
                            />
                        </Box>
                    </VStack>
                    <VStack space="xs" style={{ flex: 1 }}>
                        <Heading size="md">
                            {program.name}
                        </Heading>
                        <Text size="sm" italic>
                            {program.description}
                        </Text>
                        <HStack space="md">
                            <Text size="xs" bold>Duration:</Text>
                            <Text size="xs">{program.duration}</Text>
                        </HStack>
                        <HStack space="md">
                            <Text size="xs" bold>Level:</Text>
                            <Text size="xs">{program.level}</Text>
                        </HStack>
                        <HStack space="md">
                            <Text size="xs" bold>Price:</Text>
                            <Text size="xs">{program.price}</Text>
                        </HStack>
                    </VStack>
                </HStack>
            </VStack>
        </Card>
    );
});

ProgramCard.displayName = 'ProgramCard';

// Main Program Component
const Program = memo(() => {
    const [programs, setPrograms] = useAtom(programsAtom);

    // Mock data for development
    const mockPrograms: Program[] = [
        {
            id: "1",
            name: "Mindful Meditation",
            image: "https://picsum.photos/200",
            description: "Learn the art of mindfulness and meditation",
            duration: "8 weeks",
            level: "Beginner",
            price: "$99"
        },
        {
            id: "2",
            name: "Stress Management",
            image: "https://picsum.photos/201",
            description: "Effective techniques for managing daily stress",
            duration: "6 weeks",
            level: "Intermediate",
            price: "$79"
        },
        {
            id: "3",
            name: "Personal Growth",
            image: "https://picsum.photos/202",
            description: "Journey to self-discovery and personal development",
            duration: "12 weeks",
            level: "Advanced",
            price: "$149"
        }
    ];

    return (
        <Box className="p-4">
            <VStack space="md">
                {(programs.length > 0
                    ? programs
                    : mockPrograms
                ).map((program) => (
                    <ProgramCard
                        key={program.id}
                        program={program}
                    />
                ))}
            </VStack>
        </Box>
    );
});

Program.displayName = 'Program';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
});

export default Program;
