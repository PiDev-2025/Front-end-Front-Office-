import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { 
    UserRoundIcon, 
    Star, 
    MessageSquare, 
    Target, 
    Clock, 
    MapPin, 
    Phone, 
    Mail,
    Calendar,
    GraduationCap,
    Award,
    Heart
} from 'lucide-react-native';

// Import UI components
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Grid, GridItem } from "@/components/ui/grid";

interface ProfessionalProfileProps {
    name: string;
    title: string;
    rating: number;
    reviewCount: number;
    specialties: string[];
    experience: number;
    location: string;
    phone: string;
    email: string;
    availability: string;
    education: string[];
    certifications: string[];
    bio: string;
    onContact: () => void;
    onBook: () => void;
}

export function ProfessionalProfile({
    name,
    title,
    rating,
    reviewCount,
    specialties,
    experience,
    location,
    phone,
    email,
    availability,
    education,
    certifications,
    bio,
    onContact,
    onBook
}: ProfessionalProfileProps): React.JSX.Element {
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
                        {/* Profile Header */}
                        <Card className="p-6 rounded-xl bg-white/10 border-white/20">
                            <VStack space="md">
                                <HStack space="md" className="items-center">
                                    <Box className="p-2 rounded-full bg-white/10">
                                        <UserRoundIcon size={24} color="#ffffff" />
                                    </Box>
                                    <VStack space="xs">
                                        <Heading size="lg" style={{ color: "#ffffff" }}>
                                            {name}
                                        </Heading>
                                        <Text size="sm" style={{ color: "#ffffff80" }}>
                                            {title}
                                        </Text>
                                    </VStack>
                                </HStack>
                                
                                <HStack space="md" className="items-center">
                                    <Badge size="md" variant="solid" action="warning">
                                        <BadgeIcon as={Star} className="ml-2" />
                                        <BadgeText className="ml-2">{rating.toFixed(1)}</BadgeText>
                                    </Badge>
                                    <Text size="sm" style={{ color: "#ffffff80" }}>
                                        ({reviewCount} avis)
                                    </Text>
                                </HStack>
                            </VStack>
                        </Card>

                        {/* Specialties */}
                        <Card className="p-6 rounded-xl bg-white/10 border-white/20">
                            <VStack space="md">
                                <Heading size="md" style={{ color: "#ffffff" }}>
                                    Spécialités
                                </Heading>
                                <Grid className="gap-2 grid-cols-2" _extra={{ className: "grid-cols-2" }}>
                                    {specialties.map((specialty, index) => (
                                        <GridItem key={index} _extra={{ className: "col-span-1" }}>
                                            <Badge size="md" variant="solid" action="info">
                                                <BadgeIcon as={Target} className="ml-2" />
                                                <BadgeText className="ml-2">{specialty}</BadgeText>
                                            </Badge>
                                        </GridItem>
                                    ))}
                                </Grid>
                            </VStack>
                        </Card>

                        {/* Contact Information */}
                        <Card className="p-6 rounded-xl bg-white/10 border-white/20">
                            <VStack space="md">
                                <Heading size="md" style={{ color: "#ffffff" }}>
                                    Informations de contact
                                </Heading>
                                <VStack space="sm">
                                    <HStack space="md" className="items-center">
                                        <MapPin size={20} color="#ffffff80" />
                                        <Text style={{ color: "#ffffff" }}>{location}</Text>
                                    </HStack>
                                    <HStack space="md" className="items-center">
                                        <Phone size={20} color="#ffffff80" />
                                        <Text style={{ color: "#ffffff" }}>{phone}</Text>
                                    </HStack>
                                    <HStack space="md" className="items-center">
                                        <Mail size={20} color="#ffffff80" />
                                        <Text style={{ color: "#ffffff" }}>{email}</Text>
                                    </HStack>
                                    <HStack space="md" className="items-center">
                                        <Clock size={20} color="#ffffff80" />
                                        <Text style={{ color: "#ffffff" }}>{availability}</Text>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Card>

                        {/* Experience & Education */}
                        <Card className="p-6 rounded-xl bg-white/10 border-white/20">
                            <VStack space="md">
                                <Heading size="md" style={{ color: "#ffffff" }}>
                                    Expérience & Formation
                                </Heading>
                                <VStack space="md">
                                    <HStack space="md" className="items-center">
                                        <GraduationCap size={20} color="#ffffff80" />
                                        <Text style={{ color: "#ffffff" }}>{experience} ans d'expérience</Text>
                                    </HStack>
                                    {education.map((edu, index) => (
                                        <HStack key={index} space="md" className="items-center">
                                            <GraduationCap size={20} color="#ffffff80" />
                                            <Text style={{ color: "#ffffff" }}>{edu}</Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </VStack>
                        </Card>

                        {/* Certifications */}
                        <Card className="p-6 rounded-xl bg-white/10 border-white/20">
                            <VStack space="md">
                                <Heading size="md" style={{ color: "#ffffff" }}>
                                    Certifications
                                </Heading>
                                <VStack space="sm">
                                    {certifications.map((cert, index) => (
                                        <HStack key={index} space="md" className="items-center">
                                            <Award size={20} color="#ffffff80" />
                                            <Text style={{ color: "#ffffff" }}>{cert}</Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </VStack>
                        </Card>

                        {/* Bio */}
                        <Card className="p-6 rounded-xl bg-white/10 border-white/20">
                            <VStack space="md">
                                <Heading size="md" style={{ color: "#ffffff" }}>
                                    À propos
                                </Heading>
                                <Text style={{ color: "#ffffff" }}>{bio}</Text>
                            </VStack>
                        </Card>

                        {/* Action Buttons */}
                        <HStack space="md">
                            <Button
                                variant="solid"
                                size="md"
                                className="flex-1"
                                onPress={onContact}
                            >
                                <ButtonText>Contacter</ButtonText>
                            </Button>
                            <Button
                                variant="outline"
                                size="md"
                                className="flex-1"
                                onPress={onBook}
                            >
                                <ButtonText>Prendre RDV</ButtonText>
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </ScrollView>
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    contentContainer: {
        paddingBottom: 24,
    },
});
