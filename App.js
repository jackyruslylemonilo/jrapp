import React, {useCallback, useEffect, useState} from 'react';
import {Button, SafeAreaView, Text, useColorScheme, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import codePush from 'react-native-code-push';

const centerStyle = {alignItems: 'center', justifyContent: 'center'};

const OnBoarding = ({setAppToReady}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    codePush.sync(
      {
        updateDialog: false,
        installMode: codePush.InstallMode.IMMEDIATE,
      },
      status => {
        if (status === codePush.SyncStatus.UPDATE_INSTALLED) {
          setAppToReady();
        }
      },
      progress => {
        setPercentage(Math.ceil(progress.receivedBytes / progress.totalBytes));
      },
    );
  }, [setAppToReady]);

  return (
    <View style={centerStyle}>
      <Text>Downloading {percentage}%</Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isReady, setIsReady] = useState(false);
  const [isOnBoarding, setIsOnboarding] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const setAppToReady = useCallback(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    async function init() {
      const launchStatus = await AsyncStorage.getItem('LAUNCH_STATUS');
      const isFirstLaunch = launchStatus === null;

      if (isFirstLaunch) {
        AsyncStorage.setItem('LAUNCH_STATUS', '1');

        setIsOnboarding(true);
      } else {
        codePush.sync(
          {
            updateDialog: true,
            installMode: codePush.InstallMode.ON_NEXT_RESTART,
          },
          status => {
            if (status === codePush.SyncStatus.UPDATE_INSTALLED) {
              setIsUpdateAvailable(true);
            }
          },
        );

        setIsReady(true);
      }
    }

    init();
  }, []);

  if (!isReady) {
    return null;
  }

  if (isOnBoarding) {
    return <OnBoarding setAppToReady={setAppToReady} />;
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <Text>Code Push Update Test</Text>

      {isUpdateAvailable && (
        <View>
          Please update your app
          <Button
            title="Update App"
            onPress={() => codePush.restartApp(true)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;
