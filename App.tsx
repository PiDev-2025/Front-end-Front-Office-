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

import {
  Colors,
  Header,
  LearnMoreLinks,
} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ReloadInstructions,
  QCTInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Stack = createStackNavigator();

function Section({
  title,
  children,
  navigation,
}: {
  title: string;
  children?: React.ReactNode;
  navigation: any;
}): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      {/* <Text
        style={[
          styles.sectionTitle,
          {color: isDarkMode ? Colors.white : Colors.black},
        ]}>
        {title}
      </Text> */}
      <Button
        title={title}
        onPress={() => navigation.navigate('Environment')}
      />
      {/* <Text
        style={[
          styles.sectionDescription,
          {color: isDarkMode ? Colors.light : Colors.dark},
        ]}>
        {children}
      </Text> */}
    </View>
  );
}

function QCTScreen({navigation}: {navigation: any}): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {/* <Header /> */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={{fontSize: 20, textAlign: 'center', marginTop: 20}}>
            SympathyWorld - 0.0.1
          </Text>
          <Section title="Environment" navigation={navigation}></Section>

          <Section title="See Your Changes" navigation={navigation}>
            <ReloadInstructions />
          </Section>
          <Section title="QCT" navigation={navigation}>
            <QCTInstructions />
          </Section>
          <Section title="Learn More" navigation={navigation}>
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function EnvironmentScreen({navigation}: {navigation: any}): React.JSX.Element {
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 20}}>Environment Screen</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

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

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});
