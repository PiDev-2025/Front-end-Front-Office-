import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import EnvironmentScreen from './screens/Environment';
import QCTScreen from './screens/QCTScreen';

const Stack = createStackNavigator();

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="QCT">
        <Stack.Screen name="QCT" component={QCTScreen} />
        <Stack.Screen name="Environment" component={EnvironmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
