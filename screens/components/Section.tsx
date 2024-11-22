import React from 'react';
import {StyleSheet, useColorScheme, View, Button} from 'react-native';

import {useNavigation} from '@react-navigation/native';
// import {Colors} from 'react-native/Libraries/NewAppScreen';
// import {GIT_TAG, API_URL} from '@env';

function Section({title}: {title: string}): React.JSX.Element {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Button
        title={title}
        onPress={() => navigation.navigate(title)}
        // color={isDarkMode ? Colors.white : Colors.black}
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

export default Section;
