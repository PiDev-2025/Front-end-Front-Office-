import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Colors, LearnMoreLinks} from 'react-native/Libraries/NewAppScreen';
// import {Button as PaperButton} from 'react-native-paper';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {GIT_TAG, API_URL} from '@env';

function Section({title}: {title: string}): React.JSX.Element {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Button
        title={title}
        onPress={() => navigation.navigate(title)}
        color={isDarkMode ? Colors.white : Colors.black}
      />
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
    fontWeight: '600',
  },
});
