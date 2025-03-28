import React from "react";
import { StyleSheet } from "react-native";
import MoodLab from "./MoodLab";
import LinearGradient from 'react-native-linear-gradient';

export const MoodLabScreen: React.FC = () => {
    return (
        <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#6366f1', '#818cf8', '#a5b4fc']}
            style={styles.container}
        >
            <MoodLab />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default MoodLabScreen; 