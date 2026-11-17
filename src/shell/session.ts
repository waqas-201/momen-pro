import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'momen-pro:begun:v1';

/** Whether the Flow has been finished on this device. */
export async function loadHasBegun(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === '1';
  } catch {
    return false;
  }
}

export async function markHasBegun(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, '1');
  } catch {
    // The person simply sees the Splash again next launch; nothing is lost.
  }
}
