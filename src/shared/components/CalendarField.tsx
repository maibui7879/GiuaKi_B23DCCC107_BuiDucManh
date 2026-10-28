import React, {useState} from 'react';
import {Keyboard, Modal, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {usePreferences} from '../../core/theme/Preferences';
import {formatDate, parseDate, dateToKey} from '../../features/tasks/utils/taskUtils';
import {AppText} from './AppText';

type Props = {value: string; onChange: (value: string) => void; minimumDate?: Date; disabled?: boolean};
export function CalendarField({value, onChange, minimumDate, disabled}: Props) {
  const {colors} = usePreferences();
  const [visible, setVisible] = useState(false);
  const [month, setMonth] = useState(() => parseDate(value) ?? new Date());
  const [selected, setSelected] = useState(value);
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const offset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const canSelect = (date: Date) => !minimumDate || dateToKey(date) >= dateToKey(minimumDate);
  const selectedDate = parseDate(selected);
  const open = () => {
    Keyboard.dismiss();
    const initial = parseDate(value) ?? minimumDate ?? new Date();
    setMonth(initial); setSelected(value); setVisible(true);
  };
  return <>
    <Pressable disabled={disabled} accessibilityRole="button" accessibilityLabel={`Chọn hạn hoàn thành, ${value}`} onPress={open} style={({pressed}) => [styles.field, {backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed || disabled ? 0.6 : 1}]}><AppText>{value}</AppText><MaterialDesignIcons name="calendar-month-outline" size={24} color={colors.text} /></Pressable>
    <Modal visible={visible} transparent animationType="none" onRequestClose={() => setVisible(false)}>
      <View style={styles.backdrop}><ScrollView contentContainerStyle={styles.center}>
        <View style={[styles.calendar, {backgroundColor: colors.surface, borderColor: colors.border}]} accessibilityViewIsModal>
          <AppText style={styles.title} accessibilityRole="header">Chọn hạn hoàn thành</AppText>
          <View style={styles.navigation}>
            <Pressable accessibilityRole="button" accessibilityLabel="Tháng trước" onPress={() => setMonth(new Date(year, monthIndex - 1, 1))} style={styles.arrow}><MaterialDesignIcons name="chevron-left" size={24} color={colors.text} /></Pressable>
            <AppText style={styles.month}>Tháng {monthIndex + 1}, {year}</AppText>
            <Pressable accessibilityRole="button" accessibilityLabel="Tháng sau" onPress={() => setMonth(new Date(year, monthIndex + 1, 1))} style={styles.arrow}><MaterialDesignIcons name="chevron-right" size={24} color={colors.text} /></Pressable>
          </View>
          <View style={styles.grid}>{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => <View key={day} style={styles.cell}><AppText variant="caption">{day}</AppText></View>)}</View>
          <View style={styles.grid}>{Array.from({length: Math.ceil((offset + days) / 7) * 7}, (_, index) => {
            const day = index - offset + 1;
            if (day < 1 || day > days) return <View key={index} style={styles.cell} />;
            const date = new Date(year, monthIndex, day);
            const formatted = formatDate(date);
            const active = selected === formatted;
            const blocked = !canSelect(date);
            return <Pressable key={index} disabled={blocked} accessibilityRole="button" accessibilityLabel={formatted} accessibilityState={{selected: active, disabled: blocked}} onPress={() => setSelected(formatted)} style={({pressed}) => [styles.cell, {backgroundColor: active ? colors.primary : colors.surface, opacity: blocked ? 0.3 : pressed ? 0.6 : 1}]}><AppText style={{color: active ? colors.primaryText : colors.text}}>{day}</AppText></Pressable>;
          })}</View>
          <AppText variant="caption">Đã chọn: {selected}</AppText>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={() => setVisible(false)} style={styles.action}><AppText>Huỷ</AppText></Pressable>
            <Pressable accessibilityRole="button" disabled={!selectedDate || !canSelect(selectedDate)} onPress={() => {onChange(selected); setVisible(false);}} style={[styles.action, {backgroundColor: colors.primary, opacity: selectedDate && canSelect(selectedDate) ? 1 : 0.4}]}><AppText style={{color: colors.primaryText}}>Chọn ngày</AppText></Pressable>
          </View>
        </View>
      </ScrollView></View>
    </Modal>
  </>;
}
const styles = StyleSheet.create({field: {minHeight: 52, paddingHorizontal: 16, borderWidth: 1, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.45)'}, center: {flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}, calendar: {width: '100%', maxWidth: 420, padding: 12, gap: 12, borderWidth: 1, borderRadius: 16}, title: {fontSize: 20, fontWeight: '700', paddingHorizontal: 8}, navigation: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, arrow: {minWidth: 48, minHeight: 48, justifyContent: 'center', alignItems: 'center'}, month: {fontWeight: '700'}, grid: {flexDirection: 'row', flexWrap: 'wrap'}, cell: {width: '14.285714%', minHeight: 48, paddingVertical: 8, justifyContent: 'center', alignItems: 'center', borderRadius: 8}, actions: {flexDirection: 'row', justifyContent: 'flex-end', gap: 8}, action: {minHeight: 48, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', borderRadius: 8}});
