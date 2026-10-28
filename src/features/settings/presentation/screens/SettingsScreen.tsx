import React from 'react';
import {Pressable, ScrollView, StyleSheet, Switch, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {usePreferences} from '../../../../core/theme/Preferences';
import {palettes, PaletteId} from '../../../../core/theme/palettes';
import {AppText} from '../../../../shared/components/AppText';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const {preferences, update, colors} = usePreferences();
  return (
    <ScrollView style={{backgroundColor: colors.background}} contentContainerStyle={[styles.page, {paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24}]}>
      <AppText variant="title">Cài đặt</AppText>
      <View style={[styles.section, {backgroundColor: colors.surface, borderColor: colors.border}]}>
        <AppText style={styles.heading}>Cặp màu giao diện</AppText>
        <AppText variant="caption">Chọn màu chủ đạo và nền cho toàn bộ ứng dụng</AppText>
        <View style={styles.options}>
          {(Object.keys(palettes) as PaletteId[]).map(mode => (
            <Pressable key={mode} accessibilityRole="radio" accessibilityState={{selected: preferences.theme === mode}} onPress={() => update({theme: mode})} style={({pressed}) => [styles.option, {borderColor: colors.border, backgroundColor: preferences.theme === mode ? colors.accentSoft : colors.background, opacity: pressed ? 0.7 : 1}]}>
              <View style={styles.preview} accessible={false}>
                <View style={[styles.swatch, {backgroundColor: palettes[mode].colors.primary}]} />
                <View style={[styles.swatch, {backgroundColor: palettes[mode].colors.background}]} />
                <View style={[styles.swatch, {backgroundColor: palettes[mode].colors.accent}]} />
              </View>
              <AppText>{palettes[mode].label}</AppText>
              {preferences.theme === mode && <AppText variant="caption">Đang chọn</AppText>}
            </Pressable>
          ))}
        </View>
      </View>
      <View style={[styles.section, {backgroundColor: colors.surface, borderColor: colors.border}]}>
        <AppText style={styles.heading}>Hiển thị</AppText>
        <View style={styles.row}><View style={styles.copy}><AppText>Chữ lớn</AppText><AppText variant="caption">Tăng cỡ chữ trong ứng dụng</AppText></View><Switch accessibilityLabel="Chữ lớn" value={preferences.largeText} onValueChange={largeText => update({largeText})} /></View>
        <View style={styles.row}><View style={styles.copy}><AppText>Danh sách gọn</AppText><AppText variant="caption">Giảm khoảng cách trong thẻ công việc</AppText></View><Switch accessibilityLabel="Danh sách gọn" value={preferences.compact} onValueChange={compact => update({compact})} /></View>
        <View style={styles.row}><View style={styles.copy}><AppText>Hiển thị ghi chú</AppText><AppText variant="caption">Xem ghi chú ngay trong danh sách</AppText></View><Switch accessibilityLabel="Hiển thị ghi chú" value={preferences.showNotes} onValueChange={showNotes => update({showNotes})} /></View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  page: {paddingHorizontal: 20, gap: 24},
  section: {padding: 20, borderWidth: 1, borderRadius: 12, gap: 16},
  heading: {fontSize: 18, fontWeight: '700'},
  options: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  option: {padding: 12, minHeight: 112, flexGrow: 1, flexBasis: '45%', gap: 8, borderWidth: 1, borderRadius: 8, justifyContent: 'center'},
  preview: {flexDirection: 'row', gap: 6},
  swatch: {width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: '#888888'},
  row: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8},
  copy: {flex: 1, gap: 4},
});
