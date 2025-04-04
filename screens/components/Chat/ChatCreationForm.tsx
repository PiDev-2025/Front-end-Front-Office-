import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { jwtDecodedAtom } from '../../states/user';
import { User, Users, Hash, Briefcase, BookOpen, LifeBuoy, MessageSquare, Plus, X } from 'lucide-react-native';
import {
    Box,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField,
    Text,
    Textarea,
    TextareaInput,
    VStack,
    HStack,
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
    Badge,
    BadgeText,
    BadgeIcon
} from "../../../components/ui";

interface JwtDecoded {
    ID: string;
    [key: string]: any;
}

interface ChatCreationFormProps {
    type: 'group' | 'theme' | 'pro';
    onClose: () => void;
    onSubmit: (data: {
        type: 'group' | 'theme' | 'pro';
        name?: string;
        description?: string;
        activityType?: string;
        theme?: string;
        professionalType?: string;
        styles?: {
            main_bg?: string;
            other_bubble?: string;
            my_bubble?: string;
        };
    }) => void;
}

const activityTypes = [
    "Sortir",
    "Culture",
    "Sport",
    "Voyage",
    "Gastronomie",
    "Art",
    "Musique",
    "Cinéma",
    "Lecture",
    "Jeux",
    "Technologie",
    "Nature",
    "Bien-être",
    "Mode",
    "Photographie"
];

const professionalTypes = [
    "Psychologue",
    "Coach",
    "Médecin",
    "Nutritionniste",
    "Kinésithérapeute",
    "Ostéopathe",
    "Sophrologue",
    "Thérapeute",
    "Conseiller",
    "Mentor"
];

const themes = [
    "difficulte_professionnelle",
    "sport_et_bien_etre",
    "sante_mentale",
    "relations_sociales",
    "developpement_personnel",
    "gestion_du_stress",
    "equilibre_vie_pro_perso",
    "parentalite",
    "couple",
    "addictions"
];

export const ChatCreationForm: React.FC<ChatCreationFormProps> = ({
    type,
    onClose,
    onSubmit
}) => {
    const [jwtDecoded] = useAtom(jwtDecodedAtom) as [JwtDecoded, any];
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        activityType: '',
        theme: '',
        professionalType: '',
        styles: {
            main_bg: '#ffffff',
            other_bubble: '#f3f4f6',
            my_bubble: '#3b82f6'
        }
    });

    const handleSubmit = () => {
        onSubmit({
            type,
            ...formData
        });
    };

    return (
        <Box className="p-4">
            <VStack space="md">
                <HStack space="md" className="justify-between items-center">
                    <Text className="text-xl font-semibold">
                        {type === 'group' && 'Create Group Chat'}
                        {type === 'theme' && 'Create Thematic Chat'}
                        {type === 'pro' && 'Create Professional Chat'}
                    </Text>
                    <Button variant="outline" onPress={onClose}>
                        <X size={24} />
                    </Button>
                </HStack>

                {type === 'group' && (
                    <>
                        <Box>
                            <Text className="text-sm font-medium mb-1">Nom du groupe</Text>
                            <Input>
                                <InputField
                                    placeholder="Entrez le nom du groupe"
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                />
                            </Input>
                        </Box>
                        <Box>
                            <Text className="text-sm font-medium mb-1">Type d'activité</Text>
                            <Select
                                selectedValue={formData.activityType}
                                onValueChange={(value) => setFormData({ ...formData, activityType: value })}
                            >
                                <SelectTrigger>
                                    <SelectInput placeholder="Sélectionnez un type d'activité" />
                                    <SelectIcon />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {activityTypes.map((type) => (
                                            <SelectItem key={type} label={type} value={type} />
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        </Box>
                    </>
                )}

                {type === 'theme' && (
                    <Box>
                        <Text className="text-sm font-medium mb-1">Thème</Text>
                        <Select
                            selectedValue={formData.theme}
                            onValueChange={(value) => setFormData({ ...formData, theme: value })}
                        >
                            <SelectTrigger>
                                <SelectInput placeholder="Sélectionnez un thème" />
                                <SelectIcon />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    {themes.map((theme) => (
                                        <SelectItem key={theme} label={theme} value={theme} />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </Box>
                )}

                {type === 'pro' && (
                    <>
                        <Box>
                            <Text className="text-sm font-medium mb-1">Nom du professionnel</Text>
                            <Input>
                                <InputField
                                    placeholder="Entrez le nom du professionnel"
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                />
                            </Input>
                        </Box>
                        <Box>
                            <Text className="text-sm font-medium mb-1">Type de professionnel</Text>
                            <Select
                                selectedValue={formData.professionalType}
                                onValueChange={(value) => setFormData({ ...formData, professionalType: value })}
                            >
                                <SelectTrigger>
                                    <SelectInput placeholder="Sélectionnez un type de professionnel" />
                                    <SelectIcon />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {professionalTypes.map((type) => (
                                            <SelectItem key={type} label={type} value={type} />
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        </Box>
                    </>
                )}

                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>Description</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea>
                        <TextareaInput
                            placeholder="Entrez une description"
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                        />
                    </Textarea>
                </FormControl>

                <Box>
                    <Text className="text-sm font-medium mb-1">Style de la conversation</Text>
                    <HStack space="sm" className="flex-wrap">
                        <Box className="w-1/3">
                            <Text className="text-xs mb-1">Fond principal</Text>
                            <Input>
                                <InputField
                                    placeholder="#ffffff"
                                    value={formData.styles.main_bg}
                                    onChangeText={(color) => setFormData({
                                        ...formData,
                                        styles: { ...formData.styles, main_bg: color }
                                    })}
                                />
                            </Input>
                        </Box>
                        <Box className="w-1/3">
                            <Text className="text-xs mb-1">Bulles des autres</Text>
                            <Input>
                                <InputField
                                    placeholder="#f3f4f6"
                                    value={formData.styles.other_bubble}
                                    onChangeText={(color) => setFormData({
                                        ...formData,
                                        styles: { ...formData.styles, other_bubble: color }
                                    })}
                                />
                            </Input>
                        </Box>
                        <Box className="w-1/3">
                            <Text className="text-xs mb-1">Mes bulles</Text>
                            <Input>
                                <InputField
                                    placeholder="#3b82f6"
                                    value={formData.styles.my_bubble}
                                    onChangeText={(color) => setFormData({
                                        ...formData,
                                        styles: { ...formData.styles, my_bubble: color }
                                    })}
                                />
                            </Input>
                        </Box>
                    </HStack>
                </Box>

                <HStack space="sm" className="mt-4">
                    <Button variant="outline" onPress={onClose} className="flex-1">
                        <ButtonText>Annuler</ButtonText>
                    </Button>
                    <Button onPress={handleSubmit} className="flex-1">
                        <ButtonText>Créer</ButtonText>
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
}; 