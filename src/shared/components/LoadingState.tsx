import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {usePreferences} from '../../core/theme/Preferences';
import {AppText} from './AppText';

export function LoadingState({label = 'Đang tải công việc…'}: {label?: string}) {
  const {colors} = usePreferences();
  return <View style={[styles.container, {backgroundColor: colors.background}]} accessibilityState={{busy: true}} accessibilityLiveRegion="polite"><ActivityIndicator size="large" color={colors.primary} /><AppText variant="caption">{label}</AppText></View>;
}
const styles = StyleSheet.create({container: {flex: 1, minHeight: 180, padding: 32, justifyContent: 'center', alignItems: 'center', gap: 16}});
