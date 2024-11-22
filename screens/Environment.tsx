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

function EnvironmentScreen(): React.JSX.Element {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 20}}>Environment Screen</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

export default EnvironmentScreen;
