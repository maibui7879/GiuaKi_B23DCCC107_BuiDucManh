import React, {createContext, useContext, useEffect, useState, useRef} from 'react';
import {ActivityIndicator, Alert, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors as lightColors} from './colors';
import {palettes, PaletteId} from './palettes';
import {useNotifications} from '../../shared/components/NotificationContext';

type Preferences = {theme: PaletteId; largeText: boolean; compact: boolean; showNotes: boolean};
const defaults: Preferences = {theme: 'sand', largeText: false, compact: false, showNotes: false};
const Context = createContext({preferences: defaults, colors: lightColors as Record<keyof typeof lightColors, string>, dark: false, update: (_patch: Partial<Preferences>) => {}});
const key = '@planner/preferences';

export function PreferencesProvider({children}: React.PropsWithChildren) {
  const {notify} = useNotifications();
  const saving = useRef(false);
  const [preferences, setPreferences] = useState(defaults);
  const [ready, setReady] = useState(false);
  useEffect(() => { AsyncStorage.getItem(key).then(value => {
    if (!value) return;
    const saved = JSON.parse(value);
    setPreferences({theme: Object.prototype.hasOwnProperty.call(palettes, saved.theme) ? saved.theme : 'sand', largeText: saved.largeText === true, compact: saved.compact === true, showNotes: saved.showNotes === true});
  }).catch(() => Alert.alert('Không đọc được cài đặt', 'Đang sử dụng cài đặt mặc định.')).finally(() => setReady(true)); }, []);
  const update = async (patch: Partial<Preferences>) => {
    if (saving.current || Object.entries(patch).every(([name, value]) => preferences[name as keyof Preferences] === value)) return;
    saving.current = true;
    const next = {...preferences, ...patch};
    try {
      await AsyncStorage.setItem(key, JSON.stringify(next));
      setPreferences(next);
      notify({title: 'Đã cập nhật cá nhân hoá', message: patch.theme ? `Đã áp dụng cặp màu ${palettes[next.theme].label}.` : 'Tuỳ chọn hiển thị đã được áp dụng và lưu.'});
    } catch {Alert.alert('Không lưu được cài đặt', 'Vui lòng thử lại.');}
    finally {saving.current = false;}
  };
  if (!ready) return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: lightColors.background}} accessibilityLabel="Đang mở ứng dụng" accessibilityState={{busy: true}}><ActivityIndicator size="large" color={lightColors.primary} /></View>;
  return <Context.Provider value={{preferences, dark: false, colors: palettes[preferences.theme].colors, update}}>{children}</Context.Provider>;
}

export const usePreferences = () => useContext(Context);
