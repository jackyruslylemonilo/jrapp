import React from 'react';
import {Button, SafeAreaView, Text, useColorScheme} from 'react-native';
import codePush from 'react-native-code-push';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Text>Code Push Update Test</Text>
      <Button title="Restart App" onPress={() => codePush.restartApp()} />
    </SafeAreaView>
  );
};

export default App;
