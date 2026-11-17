import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckinsProvider } from '../checkins/CheckinsContext';
import { Flow } from '../flow/Flow';
import { HomeScreen } from '../screens/HomeScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { Colors } from '../theme/colors';
import { TabBar, type Tab } from './TabBar';
import { loadHasBegun, markHasBegun } from './session';

/**
 * The app's two surfaces. The Flow is the first-run experience; Home is where
 * the Intentions set in it are lived. Which one is showing is a device fact, so
 * finishing the Flow is remembered across launches.
 */
export const AppShell: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [begun, setBegun] = useState(false);
  const [tab, setTab] = useState<Tab>('home');

  useEffect(() => {
    let alive = true;
    loadHasBegun()
      .then((value) => {
        if (alive) setBegun(value);
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const finishOnboarding = useCallback(() => {
    markHasBegun();
    setBegun(true);
    setTab('home');
  }, []);

  if (!ready) return <View style={styles.boot} />;

  if (!begun) return <Flow onFinish={finishOnboarding} />;

  return (
    <CheckinsProvider>
      <View style={styles.root}>
        <View style={styles.body}>
          {tab === 'home' ? <HomeScreen /> : <PlaceholderScreen tab={tab} />}
        </View>
        <TabBar tab={tab} onChange={setTab} />
      </View>
    </CheckinsProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.darkBg,
  },
  body: {
    flex: 1,
  },
  boot: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
});
