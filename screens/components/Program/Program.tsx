import React, { memo } from "react";
import { StyleSheet, Dimensions } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

// Individual GlueStack UI imports from components/ui
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Button, ButtonText } from "@/components/ui/button";

// Types
interface CurrentlyReadingItem {
    id: string;
    title: string;
    author: string;
    imageUrl: string;
    lastRead: string;
    progressText: string; // e.g., "62%"
    avgSession: string;   // e.g., "25 min"
    pagesRead: string;    // e.g., "213"
}

// CurrentlyReadingCard Component
interface CurrentlyReadingCardProps {
    item: CurrentlyReadingItem;
}

const CurrentlyReadingCard = memo(({ item }: CurrentlyReadingCardProps) => {
    return (
        <Box className="rounded-xl overflow-hidden my-3 shadow-lg" sx={{ w: '$full', h: 380 }}>
            <Image
                source={{ uri: item.imageUrl }}
                alt={`${item.title} background`}
                style={StyleSheet.absoluteFillObject}
                className="w-full h-full"
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
                style={StyleSheet.absoluteFillObject}
            />
            <VStack
                style={StyleSheet.absoluteFillObject}
                sx={{
                    p: '$5',
                    justifyContent: 'space-between'
                }}
            >
                <VStack space="xs">
                    <HStack sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <VStack>
                            <Heading size="xl" sx={{color: '$white'}}>{item.title}</Heading>
                            <Text size="sm" sx={{color: '$coolGray300'}}>by {item.author}</Text>
                        </VStack>
                        <VStack sx={{alignItems: 'flex-end'}}>
                            <Text size="xs" sx={{color: '$coolGray400'}}>Last Read</Text>
                            <Text size="sm" sx={{color: '$coolGray200'}}>{item.lastRead}</Text>
                        </VStack>
                    </HStack>
                </VStack>

                <VStack space="lg">
                    <HStack sx={{ justifyContent: 'space-around' }}>
                        <VStack sx={{alignItems: 'center'}} space="xs">
                            <Heading size="lg" sx={{color: '$white'}}>{item.progressText}</Heading>
                            <Text size="xs" sx={{color: '$coolGray300'}}>Progress</Text>
                        </VStack>
                        <VStack sx={{alignItems: 'center'}} space="xs">
                            <Heading size="lg" sx={{color: '$white'}}>{item.avgSession}</Heading>
                            <Text size="xs" sx={{color: '$coolGray300'}}>Avg. Session</Text>
                        </VStack>
                        <VStack sx={{alignItems: 'center'}} space="xs">
                            <Heading size="lg" sx={{color: '$white'}}>{item.pagesRead}</Heading>
                            <Text size="xs" sx={{color: '$coolGray300'}}>Pages Read</Text>
                        </VStack>
                    </HStack>
                    <Button
                        size="md"
                        variant="solid"
                        sx={{
                            bg: 'rgba(255, 255, 255, 0.2)',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            _text: { color: '$white' },
                            borderWidth: 1,
                            borderRadius: '$lg'
                        }}
                    >
                        <ButtonText>Resume Reading</ButtonText>
                    </Button>
                </VStack>
            </VStack>
        </Box>
    );
});

CurrentlyReadingCard.displayName = 'CurrentlyReadingCard';

// Main ReadingScreen Component
const ReadingScreen = memo(() => {
    // Mock data for development, reflecting the new structure
    const mockReadingItems: CurrentlyReadingItem[] = [
        {
            id: "1",
            title: "Dune Messiah",
            author: "Frank Herbert",
            imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1121&q=80", // A generic placeholder image for Dune
            lastRead: "2 Days Ago",
            progressText: "62%",
            avgSession: "25 min",
            pagesRead: "213"
        },
        // Add another item for the light card if implementing later, or more dark ones.
        // For now, one item to demonstrate the dark card style.
    ];

    return (
        <Box className="flex-1" sx={{ p: '$4', bg: '$coolGray100' }}>
            <VStack space="md" sx={{alignItems: 'center'}}>
                {mockReadingItems.map((item) => (
                    <CurrentlyReadingCard
                        key={item.id}
                        item={item}
                    />
                ))}
            </VStack>
        </Box>
    );
});

ReadingScreen.displayName = 'ReadingScreen';

// Styles are mostly handled by Gluestack utility props and classNames.
// Minimal StyleSheet usage is preferred.
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#f5f5f5", // Example, can be set on the root Box
//     },
// });

export default ReadingScreen;
