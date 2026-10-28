import React, {useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, TextInput, View} from 'react-native';
import {useTasks} from '../hooks/useTasks';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';

import {usePreferences} from '../../../../core/theme/Preferences';
import {radii, spacing} from '../../../../core/theme/spacing';
import {categories, SortMode, TaskFilter} from '../../domain/task';
import {AppText} from '../../../../shared/components/AppText';

const filters: {key: TaskFilter; label: string}[] = [
  {key: 'all', label: 'Tất cả'},
  {key: 'todo', label: 'Chưa xong'},
  {key: 'done', label: 'Đã xong'},
  {key: 'overdue', label: 'Quá hạn'},
];

type Props = {filter: TaskFilter; search: string; sortMode: SortMode; onFilter: (filter: TaskFilter) => void; onSearch: (value: string) => void; onSort: (mode: SortMode) => void};

export function TaskFilters({filter, search, sortMode, onFilter, onSearch, onSort}: Props) {
  const {colors, preferences} = usePreferences();
  const styles = createStyles(colors);
  const {filtering, saving, categoryFilter, setCategoryFilter} = useTasks();
  const [expanded, setExpanded] = useState(false);
  const advancedCount = Number(categoryFilter !== 'all') + Number(sortMode !== 'dueDate');
  return (
    <View style={styles.wrapper}>
      <View style={styles.searchBox}><MaterialDesignIcons name="magnify" size={22} color={colors.textMuted} /><TextInput value={search} onChangeText={onSearch} placeholder="Tìm theo tên công việc" placeholderTextColor={colors.textMuted} style={[styles.search, preferences.largeText && styles.largeSearch]} accessibilityLabel="Tìm kiếm công việc" /></View>
      <View style={styles.filterRow}>
        {filters.map(item => <Pressable key={item.key} onPress={() => onFilter(item.key)} style={({pressed}) => [styles.filterButton, filter === item.key && styles.filterSelected, pressed && styles.pressed]} accessibilityRole="button" accessibilityState={{selected: filter === item.key}}><AppText style={[styles.filterText, filter === item.key && styles.filterTextSelected]}>{item.label}</AppText></Pressable>)}
      </View>
      <Pressable onPress={() => setExpanded(current => !current)} accessibilityRole="button" accessibilityState={{expanded}} style={({pressed}) => [styles.toggle, pressed && styles.pressed]}>
        <MaterialDesignIcons name="tune-variant" size={20} color={colors.text} />
        <AppText style={styles.toggleText}>Danh mục & sắp xếp{advancedCount ? ` (${advancedCount})` : ''}</AppText>
        <MaterialDesignIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.text} />
      </Pressable>
      {expanded && <View style={styles.advanced}>
      <AppText variant="caption">Danh mục</AppText>
      <View style={styles.categoryRow}>
        {(['all', ...categories] as const).map(category => (
          <Pressable key={category} onPress={() => setCategoryFilter(category)} accessibilityRole="button" accessibilityLabel={`Danh mục ${category === 'all' ? 'tất cả' : category}`} accessibilityState={{selected: categoryFilter === category}} style={({pressed}) => [styles.categoryButton, categoryFilter === category && styles.filterSelected, pressed && styles.pressed]}>
            <AppText style={[styles.filterText, categoryFilter === category && styles.filterTextSelected]}>{category === 'all' ? 'Tất cả danh mục' : category}</AppText>
          </Pressable>
        ))}
      </View>
      <View style={styles.sortRow}>
        <AppText variant="caption">Sắp xếp:</AppText>
        <Pressable accessibilityRole="button" accessibilityState={{selected: sortMode === 'dueDate'}} onPress={() => onSort('dueDate')} style={({pressed}) => [styles.sortButton, sortMode === 'dueDate' && styles.sortSelected, pressed && styles.pressed]}><MaterialDesignIcons name="calendar-clock" size={16} color={colors.textMuted} /><AppText style={styles.sortText}>Hạn gần nhất</AppText></Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{selected: sortMode === 'priority'}} onPress={() => onSort('priority')} style={({pressed}) => [styles.sortButton, sortMode === 'priority' && styles.sortSelected, pressed && styles.pressed]}><MaterialDesignIcons name="flag-outline" size={16} color={colors.textMuted} /><AppText style={styles.sortText}>Ưu tiên</AppText></Pressable>
      </View>
      </View>}
      <View style={styles.feedback} accessibilityLiveRegion="polite" accessibilityState={{busy: filtering || saving}}>
        {(filtering || saving) && <ActivityIndicator size="small" color={colors.primary} />}
        <AppText variant="caption">{saving ? 'Đang lưu…' : filtering ? 'Đang cập nhật…' : `${categoryFilter === 'all' ? 'Mọi danh mục' : categoryFilter} · ${sortMode === 'dueDate' ? 'Hạn gần nhất' : 'Ưu tiên'}`}</AppText>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof usePreferences>['colors']) => StyleSheet.create({
  wrapper: {gap: spacing.sm},
  toggle: {minHeight: 48, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  toggleText: {flex: 1, fontWeight: '700'},
  advanced: {padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, gap: spacing.md},
  largeSearch: {fontSize: 19, minHeight: 56},
  categoryRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  categoryButton: {minHeight: 48, paddingHorizontal: spacing.sm, justifyContent: 'center', borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface},
  feedback: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 28},
  searchBox: {minHeight: 48, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface},
  search: {flex: 1, minWidth: 0, minHeight: 48, paddingVertical: spacing.sm, color: colors.text, fontSize: 16},
  filterRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  filterButton: {minHeight: 48, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, justifyContent: 'center', borderRadius: radii.sm, backgroundColor: colors.muted},
  filterSelected: {backgroundColor: colors.primary},
  filterText: {fontSize: 13, color: colors.textMuted},
  filterTextSelected: {color: colors.primaryText, fontWeight: '700'},
  sortRow: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm},
  sortButton: {minHeight: 48, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, justifyContent: 'center', borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border},
  sortSelected: {borderColor: colors.primary, backgroundColor: colors.accentSoft},
  sortText: {fontSize: 13, color: colors.textMuted},
  pressed: {opacity: 0.72},
});
