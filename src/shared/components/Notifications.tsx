import React from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {usePreferences} from '../../core/theme/Preferences';
import {AppText} from './AppText';

import {useNotifications} from './NotificationContext';
export {NotificationsProvider, useNotifications} from './NotificationContext';

export function NotificationModal() {
  const {notices, dismiss} = useNotifications();
  const {colors} = usePreferences();
  const notice = notices[0];
  return <Modal visible={!!notice} transparent animationType="none" onRequestClose={dismiss} statusBarTranslucent>
    <View style={styles.overlay}>
      <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]} accessibilityViewIsModal>
        <View style={[styles.icon, {backgroundColor: colors.accentSoft}]}><MaterialDesignIcons name="check-circle-outline" size={32} color={colors.accent} accessible={false} /></View>
        <AppText variant="title" style={styles.title} accessibilityRole="header">{notice?.title}</AppText>
        <AppText style={{color: colors.textMuted}}>{notice?.message}</AppText>
        <Pressable accessibilityRole="button" onPress={dismiss} style={({pressed}) => [styles.button, {backgroundColor: colors.primary, opacity: pressed ? 0.75 : 1}]}><AppText style={{color: colors.primaryText}}>Đã hiểu</AppText></Pressable>
      </View>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24}, card: {width: '100%', maxWidth: 400, padding: 24, borderRadius: 16, borderWidth: 1, gap: 16}, icon: {width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center'}, title: {fontSize: 22, lineHeight: 30}, button: {minHeight: 48, padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center'}});
