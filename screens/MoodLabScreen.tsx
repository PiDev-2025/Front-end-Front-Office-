import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MoodLab } from './components/MoodLab/MoodLab';

export const MoodLabScreen = () => {
    return (
        <LinearGradient
            colors={['#6366f1', '#818cf8', '#a5b4fc']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <MoodLab />
        </LinearGradient>
    );
};

MoodLabScreen.displayName = 'MoodLabScreen';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
}); 