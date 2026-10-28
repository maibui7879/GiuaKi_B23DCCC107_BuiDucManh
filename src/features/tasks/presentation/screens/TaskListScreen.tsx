import React from 'react';
import {Alert, FlatList, Pressable, StyleSheet, View} from 'react-native';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {usePreferences} from '../../../../core/theme/Preferences';
import {radii, spacing} from '../../../../core/theme/spacing';
import {RootStackParamList} from '../../../../navigation/AppNavigator';
import {AppText} from '../../../../shared/components/AppText';
import {useTasks} from '../hooks/useTasks';
import {TaskCard} from '../components/TaskCard';
import {TaskFilters} from '../components/TaskFilters';
import {LoadingState} from '../../../../shared/components/LoadingState';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export function TaskListScreen({navigation}: Props) {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const {tasks, loading, visibleTasks, completedCount, filter, search, sortMode, setFilter, setSearch, setSortMode, toggleTask, deleteTask, deleteCompleted} = useTasks();
  const progress = tasks.length ? completedCount / tasks.length : 0;
  const {filtering, categoryFilter, resetFilters, saving} = useTasks();
  const hasFilters = filter !== 'all' || categoryFilter !== 'all' || !!search.trim() || sortMode !== 'dueDate';
  if (loading) return <LoadingState />;

  const confirmDelete = (id: string, title: string) => Alert.alert('Xoá công việc?', `Bạn có chắc muốn xoá “${title}” không?`, [{text: 'Huỷ', style: 'cancel'}, {text: 'Xoá', style: 'destructive', onPress: () => deleteTask(id)}]);
  const confirmDeleteCompleted = () => Alert.alert('Xoá việc đã hoàn thành?', `Sẽ xoá ${completedCount} công việc. Thao tác này không thể hoàn tác.`, [{text: 'Huỷ', style: 'cancel'}, {text: 'Xoá tất cả', style: 'destructive', onPress: deleteCompleted}]);

  return (
    <View style={[styles.screen, {paddingTop: insets.top + spacing.md}]}>
      <FlatList
        data={visibleTasks}
        accessibilityState={{busy: filtering}}
        keyboardShouldPersistTaps="handled"
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.content, {paddingBottom: insets.bottom + spacing.lg}]}
        ListHeaderComponent={<View style={styles.headerBlock}>
          <View style={styles.header}>
            <View style={styles.headerCopy}><AppText variant="caption">KẾ HOẠCH CÁ NHÂN</AppText><AppText variant="title" style={styles.heading}>Việc cần làm</AppText></View>
            <Pressable onPress={() => navigation.navigate('TaskForm')} style={({pressed}) => [styles.addButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Thêm việc"><MaterialDesignIcons name="plus" size={20} color={colors.primaryText} /><AppText style={styles.addText}>Thêm việc</AppText></Pressable>
          </View>
          <View style={styles.progressCard}>
            <View style={styles.progressTextRow}><AppText style={styles.progressTitle}>Tiến độ</AppText><AppText style={styles.progressValue}>{completedCount}/{tasks.length}</AppText></View>
            <View style={styles.track}><View style={[styles.progress, {width: `${progress * 100}%`}]} /></View>
          </View>
          <TaskFilters filter={filter} search={search} sortMode={sortMode} onFilter={setFilter} onSearch={setSearch} onSort={setSortMode} />
          <View style={styles.sectionRow}>
            <View style={styles.resultCopy} accessibilityLiveRegion="polite"><AppText style={styles.sectionTitle}>{hasFilters ? 'Kết quả' : 'Công việc'} · {visibleTasks.length}/{tasks.length}</AppText></View>
            {hasFilters && <Pressable onPress={resetFilters} accessibilityRole="button" accessibilityLabel="Xoá bộ lọc" style={({pressed}) => [styles.smallAction, pressed && styles.pressed]}><MaterialDesignIcons name="filter-remove-outline" size={22} color={colors.text} /></Pressable>}
            <Pressable disabled={completedCount === 0 || saving} onPress={confirmDeleteCompleted} accessibilityRole="button" accessibilityLabel={`Xoá ${completedCount} việc đã hoàn thành`} accessibilityState={{disabled: completedCount === 0 || saving}} style={({pressed}) => [styles.smallAction, (completedCount === 0 || saving) && styles.disabled, pressed && styles.pressed]}><MaterialDesignIcons name="trash-can-outline" size={21} color={colors.danger} /><AppText style={styles.deleteLink}>{completedCount}</AppText></Pressable>
          </View>
        </View>}
        renderItem={({item}) => <TaskCard task={item} onPress={() => navigation.navigate('TaskDetail', {taskId: item.id})} onToggle={() => toggleTask(item.id)} onLongPress={() => confirmDelete(item.id, item.title)} />}
        ItemSeparatorComponent={TaskSeparator}
        ListEmptyComponent={<View style={styles.empty}><AppText style={styles.emptyTitle}>{hasFilters ? 'Không có công việc phù hợp' : 'Chưa có công việc nào'}</AppText><AppText variant="caption">{hasFilters ? 'Thử xoá bộ lọc để xem toàn bộ công việc.' : 'Thêm công việc đầu tiên để bắt đầu.'}</AppText>{hasFilters && <Pressable onPress={resetFilters} style={styles.resetButton} accessibilityRole="button"><AppText>Xoá bộ lọc</AppText></Pressable>}</View>}
      />
    </View>
  );
}

function TaskSeparator() {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  return <View style={styles.separator} />;
}

const createStyles = (colors: ReturnType<typeof usePreferences>['colors']) => StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {paddingHorizontal: spacing.md, gap: spacing.md},
  headerBlock: {gap: spacing.md},
  header: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md, paddingTop: spacing.sm},
  headerCopy: {flexGrow: 1, flexBasis: 180, gap: spacing.xs},
  heading: {marginTop: spacing.xs},
  addButton: {minHeight: 48, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, justifyContent: 'center', backgroundColor: colors.accent, borderRadius: radii.sm},
  addText: {color: colors.primaryText, fontWeight: '700'},
  pressed: {opacity: 0.8},
  progressCard: {gap: spacing.sm, padding: spacing.md, backgroundColor: colors.primary, borderRadius: radii.md},
  progressTextRow: {flexDirection: 'row', justifyContent: 'space-between'},
  progressTitle: {color: colors.primaryText, fontWeight: '700'},
  progressValue: {color: colors.primaryText, fontSize: 18, fontWeight: '700'},
  track: {height: 8, overflow: 'hidden', borderRadius: radii.pill, backgroundColor: '#4B5563'},
  progress: {height: '100%', borderRadius: radii.pill, backgroundColor: colors.secondary},
  sectionRow: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm},
  resultCopy: {flexGrow: 1, flexBasis: 140},
  smallAction: {minHeight: 48, minWidth: 48, paddingHorizontal: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs},
  resetButton: {minHeight: 48, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, justifyContent: 'center', borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border},
  sectionTitle: {fontSize: 18, fontWeight: '700'},
  deleteLink: {color: colors.danger, fontSize: 12, fontWeight: '700'},
  disabled: {color: colors.textMuted, opacity: 0.5},
  empty: {alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm},
  emptyTitle: {fontSize: 17, fontWeight: '700'},
  separator: {height: spacing.sm},
});
