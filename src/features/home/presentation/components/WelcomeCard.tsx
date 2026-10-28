import React from 'react';
import {StyleSheet, View} from 'react-native';

import {usePreferences} from '../../../../core/theme/Preferences';
import {spacing} from '../../../../core/theme/spacing';
import {AppText} from '../../../../shared/components/AppText';

export function WelcomeCard() {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  return (
    <View style={styles.card}>
      <AppText variant="caption">PROJECT FOUNDATION</AppText>
      <AppText variant="title">Clean Code ready</AppText>
      <AppText style={styles.description}>
        Tách biệt core, shared và feature để project dễ mở rộng, kiểm thử và
        bảo trì.
      </AppText>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof usePreferences>['colors']) => StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  description: {color: colors.textMuted},
});
