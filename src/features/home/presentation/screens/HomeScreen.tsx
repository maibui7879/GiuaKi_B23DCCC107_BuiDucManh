import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {usePreferences} from '../../../../core/theme/Preferences';
import {spacing} from '../../../../core/theme/spacing';
import {WelcomeCard} from '../components/WelcomeCard';

export function HomeScreen() {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top + spacing.lg}]}>
      <WelcomeCard />
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof usePreferences>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
});
