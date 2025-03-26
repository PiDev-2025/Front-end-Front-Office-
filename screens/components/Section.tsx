import React from "react";
import { StyleSheet, useColorScheme, View, Button } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import {Colors} from 'react-native/Libraries/NewAppScreen';
// import {GIT_TAG, API_URL} from '@env';

type RootStackParamList = {
    [key: string]: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SectionProps {
    title: string;
    children?: React.ReactNode;
}

function Section({ title, children }: SectionProps): React.JSX.Element {
    const navigation = useNavigation<NavigationProp>();
    const isDarkMode = useColorScheme() === "dark";

    return (
        <View style={styles.sectionContainer}>
            <Button
                title={title}
                onPress={() => navigation.navigate(title)}
                // color={isDarkMode ? Colors.white : Colors.black}
            />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600",
    },
});

export default Section;
