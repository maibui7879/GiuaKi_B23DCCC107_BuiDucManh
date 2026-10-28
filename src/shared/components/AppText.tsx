import React from 'react';
import {StyleSheet, Text, TextProps, TextStyle} from 'react-native';

import {usePreferences} from '../../core/theme/Preferences';

type AppTextProps = TextProps & {
  variant?: 'title' | 'body' | 'caption';
};

export function AppText({variant = 'body', style, ...props}: AppTextProps) {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  const {preferences} = usePreferences();
  const resolved = (StyleSheet.flatten([styles.base, styles[variant], style]) ?? {}) as TextStyle;
  const scale = preferences.largeText ? 1.2 : 1;
  return <Text style={[resolved, {fontSize: (resolved.fontSize ?? 16) * scale, lineHeight: Math.max(resolved.lineHeight ?? 24, (resolved.fontSize ?? 16) * 1.4) * scale}]} {...props} />;
}

const createStyles = (colors: ReturnType<typeof usePreferences>['colors']) => StyleSheet.create({
  base: {color: colors.text},
  title: {fontSize: 28, fontWeight: '700', lineHeight: 34},
  body: {fontSize: 16, lineHeight: 24},
  caption: {fontSize: 14, lineHeight: 20, color: colors.textMuted},
});
