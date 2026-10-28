import React, {useMemo, useState} from 'react';
import {ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {usePreferences} from '../../../../core/theme/Preferences';
import {radii, spacing} from '../../../../core/theme/spacing';
import {RootStackParamList} from '../../../../navigation/AppNavigator';
import {AppText} from '../../../../shared/components/AppText';
import {CalendarField} from '../../../../shared/components/CalendarField';
import {categories, priorities, Category, Priority} from '../../domain/task';
import {formatDate, parseDate} from '../../utils/taskUtils';
import {useTasks} from '../hooks/useTasks';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;
type Errors = {title?: string; dueDate?: string};

export function TaskFormScreen({navigation, route}: Props) {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const {getTask, addTask, updateTask, saving} = useTasks();
  const existing = useMemo(() => route.params?.taskId ? getTask(route.params.taskId) : undefined, [getTask, route.params?.taskId]);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [category, setCategory] = useState<Category>(existing?.category ?? 'Cá nhân');
  const [priority, setPriority] = useState<Priority>(existing?.priority ?? 'Trung bình');
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? formatDate(new Date()));
  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const next: Errors = {};
    if (!title.trim()) next.title = 'Vui lòng nhập tên công việc.';
    else if (title.trim().length > 50) next.title = 'Tên công việc tối đa 50 ký tự.';
    const parsed = parseDate(dueDate);
    if (!parsed) next.dueDate = 'Ngày phải đúng định dạng dd/mm/yyyy và là ngày có thật.';
    else if (!existing && parsed.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()) next.dueDate = 'Hạn mới không được trước ngày hôm nay.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (saving || !validate()) return;
    const payload = {title: title.trim(), note: note.trim(), category, priority, dueDate, done: existing?.done ?? false};
    try {
      if (existing) await updateTask(existing.id, payload);
      else await addTask(payload);
      navigation.goBack();
    } catch {Alert.alert('Không lưu được công việc', 'Nội dung vẫn được giữ lại. Vui lòng thử lại.');}
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, {paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl}]} keyboardShouldPersistTaps="handled">
        <View style={styles.topRow}><Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Quay lại"><MaterialDesignIcons name="arrow-left" size={22} color={colors.text} /></Pressable><AppText variant="title" style={styles.heading}>{existing ? 'Sửa công việc' : 'Thêm công việc'}</AppText><View style={styles.topSpacer} /></View>
        <Field label="Tên công việc" error={errors.title}><TextInput value={title} onChangeText={value => {setTitle(value); setErrors({...errors, title: undefined});}} placeholder="Ví dụ: Ôn tập React Native" maxLength={50} style={[styles.input, errors.title && styles.inputError]} placeholderTextColor={colors.textMuted} /></Field>
        <Field label="Ghi chú"><TextInput value={note} onChangeText={setNote} placeholder="Thêm thông tin nếu cần" multiline numberOfLines={4} textAlignVertical="top" style={[styles.input, styles.noteInput]} placeholderTextColor={colors.textMuted} /></Field>
        <OptionGroup label="Danh mục" options={categories} selected={category} onSelect={setCategory} />
        <OptionGroup label="Mức ưu tiên" options={priorities} selected={priority} onSelect={setPriority} />
        <Field label="Hạn hoàn thành" error={errors.dueDate}><CalendarField value={dueDate} disabled={saving} minimumDate={existing ? undefined : new Date()} onChange={value => {setDueDate(value); setErrors({...errors, dueDate: undefined});}} /></Field>
        <Pressable disabled={saving} onPress={submit} style={({pressed}) => [styles.submit, (pressed || saving) && styles.pressed]} accessibilityRole="button" accessibilityState={{disabled: saving, busy: saving}}>{saving && <ActivityIndicator color={colors.primaryText} />}<AppText style={styles.submitText}>{saving ? 'Đang lưu…' : existing ? 'Lưu thay đổi' : 'Tạo công việc'}</AppText></Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({label, error, helper, children}: {label: string; error?: string; helper?: string; children: React.ReactNode}) {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  return <View style={styles.field}><AppText style={styles.label}>{label}</AppText>{children}{helper && !error && <AppText variant="caption">{helper}</AppText>}{error && <AppText style={styles.error}>{error}</AppText>}</View>;
}

function OptionGroup<T extends string>({label, options, selected, onSelect}: {label: string; options: readonly T[]; selected: T; onSelect: (value: T) => void}) {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  return <View style={styles.field}><AppText style={styles.label}>{label}</AppText><View style={styles.optionRow}>{options.map(option => <Pressable key={option} onPress={() => onSelect(option)} style={({pressed}) => [styles.option, selected === option && styles.optionSelected, pressed && styles.pressed]} accessibilityRole="radio" accessibilityState={{selected: selected === option}}><AppText style={[styles.optionText, selected === option && styles.optionTextSelected]}>{option}</AppText></Pressable>)}</View></View>;
}

const createStyles = (colors: ReturnType<typeof usePreferences>['colors']) => StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {paddingHorizontal: spacing.md, gap: spacing.lg},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  backButton: {width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm, backgroundColor: colors.surface},
  topSpacer: {width: 48},
  heading: {fontSize: 24},
  field: {gap: spacing.sm},
  label: {fontWeight: '700'},
  input: {minHeight: 50, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, backgroundColor: colors.surface, color: colors.text, fontSize: 16},
  noteInput: {minHeight: 100, paddingTop: spacing.md},
  inputError: {borderColor: colors.danger, borderWidth: 2},
  error: {color: colors.danger, fontSize: 13},
  optionRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  option: {minHeight: 44, paddingHorizontal: spacing.md, justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, backgroundColor: colors.surface},
  optionSelected: {borderColor: colors.primary, backgroundColor: colors.accentSoft},
  optionText: {color: colors.textMuted},
  optionTextSelected: {color: colors.primary, fontWeight: '700'},
  submit: {minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm, backgroundColor: colors.primary},
  submitText: {color: colors.primaryText, fontWeight: '700', fontSize: 16},
  pressed: {opacity: 0.78},
});
