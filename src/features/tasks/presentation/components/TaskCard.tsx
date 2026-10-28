import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';

import {usePreferences} from '../../../../core/theme/Preferences';
import {radii, spacing} from '../../../../core/theme/spacing';
import {Task} from '../../domain/task';
import {dueLabel, isOverdue} from '../../utils/taskUtils';
import {AppText} from '../../../../shared/components/AppText';

type Props = {task: Task; onPress: () => void; onLongPress: () => void; onToggle: () => void};

export const TaskCard = React.memo(function TaskCardView({task, onPress, onLongPress, onToggle}: Props) {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  const {preferences} = usePreferences();
  const overdue = isOverdue(task);
  const priorityColor = task.priority === 'Cao' ? colors.priorityHigh : task.priority === 'Trung bình' ? colors.priorityMedium : colors.priorityLow;
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={450} style={({pressed}) => [styles.card, preferences.compact && styles.compact, pressed && styles.pressed, {borderLeftWidth: 4, borderLeftColor: priorityColor}]} accessibilityRole="button" accessibilityLabel={`Mở chi tiết ${task.title}`}>
      <Pressable onPress={onToggle} style={({pressed}) => [styles.checkbox, task.done && styles.checkboxDone, pressed && styles.checkboxPressed]} accessibilityRole="checkbox" accessibilityState={{checked: task.done}} accessibilityLabel={`${task.done ? 'Bỏ hoàn thành' : 'Đánh dấu hoàn thành'} ${task.title}`}>
        {task.done && <MaterialDesignIcons name="check" size={24} color={colors.primaryText} />}
      </Pressable>
      <View style={styles.content}>
        {preferences.showNotes && !!task.note && <AppText variant="caption" numberOfLines={2}>{task.note}</AppText>}
        <View style={styles.titleRow}>
          <AppText style={[styles.title, task.done && styles.done]} numberOfLines={2}>{task.title}</AppText>
          <View style={[styles.priorityDot, {backgroundColor: priorityColor}]} />
        </View>
        <View style={styles.metaRow}>
          <AppText variant="caption">{task.category}</AppText>
          <AppText variant="caption">{task.dueDate}</AppText>
        </View>
        <View style={styles.metaRow}>
          <AppText variant="caption" style={overdue ? styles.overdue : undefined}>{overdue ? 'Quá hạn' : dueLabel(task.dueDate)}</AppText>
          <AppText variant="caption" style={{color: priorityColor}}>{task.priority}</AppText>
        </View>
      </View>
    </Pressable>
  );
});

const createStyles = (colors: ReturnType<typeof usePreferences>['colors']) => StyleSheet.create({
  compact: {padding: 8, gap: 8, minHeight: 80},
  card: {flexDirection: 'row', minHeight: 100, padding: spacing.md, gap: spacing.md, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, elevation: 1, shadowColor: '#134E4A', shadowOpacity: 0.07, shadowRadius: 4, shadowOffset: {width: 0, height: 2}},
  pressed: {opacity: 0.82, borderColor: colors.primary},
  checkbox: {width: 48, height: 48, marginTop: 2, borderRadius: radii.sm, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  checkboxDone: {backgroundColor: colors.primary},
  checkboxPressed: {opacity: 0.65},
  check: {color: colors.primaryText, fontSize: 22, fontWeight: '700'},
  content: {flex: 1, gap: spacing.xs},
  titleRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm},
  title: {flex: 1, fontSize: 17, fontWeight: '700'},
  done: {textDecorationLine: 'line-through', opacity: 0.5},
  priorityDot: {width: 10, height: 10, borderRadius: radii.pill, marginTop: 6},
  metaRow: {flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm},
  overdue: {color: colors.danger, fontWeight: '700'},
});
