import React from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {usePreferences} from '../../../../core/theme/Preferences';
import {radii, spacing} from '../../../../core/theme/spacing';
import {RootStackParamList} from '../../../../navigation/AppNavigator';
import {AppText} from '../../../../shared/components/AppText';
import {dueLabel, isOverdue} from '../../utils/taskUtils';
import {useTasks} from '../hooks/useTasks';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export function TaskDetailScreen({navigation, route}: Props) {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const {getTask, toggleTask} = useTasks();
  const task = getTask(route.params.taskId);
  if (!task) return <View style={styles.missing}><AppText>Không tìm thấy công việc.</AppText></View>;
  const overdue = isOverdue(task);
  const priorityColor = task.priority === 'Cao' ? colors.priorityHigh : task.priority === 'Trung bình' ? colors.priorityMedium : colors.priorityLow;
  const priorityTextStyle = task.priority === 'Cao' ? styles.priorityHigh : task.priority === 'Trung bình' ? styles.priorityMedium : styles.priorityLow;
  return <ScrollView style={styles.screen} contentContainerStyle={[styles.content, {paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl}]}>
    <View style={styles.topRow}><Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Quay lại"><MaterialDesignIcons name="arrow-left" size={22} color={colors.text} /></Pressable><AppText variant="title" style={styles.heading}>Chi tiết</AppText><Pressable onPress={() => navigation.navigate('TaskForm', {taskId: task.id})} style={styles.editButton} accessibilityRole="button"><MaterialDesignIcons name="pencil-outline" size={18} color={colors.primary} /><AppText style={styles.editText}>Sửa</AppText></Pressable></View>
    <View style={styles.hero}><AppText variant="caption">{task.category}</AppText><AppText variant="title" style={task.done && styles.done}>{task.title}</AppText><View style={styles.badgeRow}><View style={[styles.badge, {backgroundColor: `${priorityColor}18`}]}><AppText style={priorityTextStyle}>{task.priority}</AppText></View>{overdue && <View style={styles.overdueBadge}><AppText style={styles.overdueText}>Quá hạn</AppText></View>}</View></View>
    <InfoRow label="Hạn hoàn thành" value={task.dueDate} /><InfoRow label="Tình trạng" value={task.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'} /><InfoRow label="Thời gian" value={task.done ? 'Đã đóng việc' : dueLabel(task.dueDate)} />
    <View style={styles.noteBlock}><AppText style={styles.label}>Ghi chú</AppText><AppText style={task.note ? undefined : styles.muted}>{task.note || 'Chưa có ghi chú cho công việc này.'}</AppText></View>
    <Pressable onPress={() => toggleTask(task.id)} style={({pressed}) => [styles.action, task.done && styles.secondaryAction, pressed && styles.pressed]}><AppText style={[styles.actionText, task.done && styles.secondaryActionText]}>{task.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}</AppText></Pressable>
  </ScrollView>;
}

function InfoRow({label, value}: {label: string; value: string}) {
  const {colors} = usePreferences();
  const styles = createStyles(colors); return <View style={styles.infoRow}><AppText variant="caption">{label}</AppText><AppText style={styles.infoValue}>{value}</AppText></View>; }

const createStyles = (colors: ReturnType<typeof usePreferences>['colors']) => StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {paddingHorizontal: spacing.md, gap: spacing.md},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  backButton: {width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm, backgroundColor: colors.surface},
  heading: {fontSize: 24},
  editButton: {minWidth: 64, minHeight: 48, paddingHorizontal: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.primary},
  editText: {color: colors.primary, fontWeight: '700'},
  hero: {gap: spacing.sm, padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border},
  done: {textDecorationLine: 'line-through', opacity: 0.5},
  badgeRow: {flexDirection: 'row', gap: spacing.sm},
  badge: {paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.sm},
  overdueBadge: {paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.sm, backgroundColor: '#FEE2E2'},
  overdueText: {color: colors.danger, fontWeight: '700'},
  priorityHigh: {color: colors.priorityHigh, fontWeight: '700'},
  priorityMedium: {color: colors.priorityMedium, fontWeight: '700'},
  priorityLow: {color: colors.priorityLow, fontWeight: '700'},
  infoRow: {paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.xs},
  infoValue: {fontWeight: '700'},
  noteBlock: {gap: spacing.sm, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface},
  label: {fontWeight: '700'},
  muted: {color: colors.textMuted},
  action: {minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm, backgroundColor: colors.primary},
  secondaryAction: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary},
  actionText: {color: colors.primaryText, fontWeight: '700'},
  secondaryActionText: {color: colors.primary},
  pressed: {opacity: 0.78},
  missing: {flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background},
});
