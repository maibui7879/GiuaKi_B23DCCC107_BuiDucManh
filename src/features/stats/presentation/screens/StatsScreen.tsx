import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {usePreferences} from '../../../../core/theme/Preferences';
import {radii, spacing} from '../../../../core/theme/spacing';
import {AppText} from '../../../../shared/components/AppText';
import {categories} from '../../../tasks/domain/task';
import {isOverdue} from '../../../tasks/utils/taskUtils';
import {useTasks} from '../../../tasks/presentation/hooks/useTasks';

export function StatsScreen() {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const {tasks, completedCount} = useTasks();
  const overdueCount = tasks.filter(isOverdue).length;
  const completionRate = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const categoryStats = useMemo(() => categories.map(category => ({category, count: tasks.filter(task => task.category === category).length})), [tasks]);
  const maxCount = Math.max(...categoryStats.map(item => item.count), 1);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, {paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl}]}>
      <View style={styles.header}><View><AppText variant="caption">TỔNG QUAN</AppText><AppText variant="title" style={styles.heading}>Thống kê</AppText></View><View style={styles.headerIcon}><MaterialDesignIcons name="chart-box-outline" size={24} color={colors.primary} /></View></View>
      <View style={styles.statGrid}>
        <StatCard icon="format-list-bulleted" label="Tổng công việc" value={String(tasks.length)} />
        <StatCard icon="check-circle-outline" label="Đã hoàn thành" value={String(completedCount)} tone="success" />
        <StatCard icon="clock-alert-outline" label="Quá hạn" value={String(overdueCount)} tone="danger" />
        <StatCard icon="percent-outline" label="Tỉ lệ hoàn thành" value={`${completionRate}%`} tone="accent" />
      </View>
      <View style={styles.panel}>
        <View style={styles.panelHeader}><View><AppText style={styles.panelTitle}>Phân bổ công việc</AppText><AppText variant="caption">Theo danh mục hiện tại</AppText></View><MaterialDesignIcons name="chart-bar" size={22} color={colors.accent} /></View>
        <View style={styles.chart}>{categoryStats.map(item => <View key={item.category} style={styles.barRow}><AppText style={styles.barLabel}>{item.category}</AppText><View style={styles.barTrack}><View style={[styles.bar, {width: `${(item.count / maxCount) * 100}%`}]} /></View><AppText style={styles.barValue}>{item.count}</AppText></View>)}</View>
      </View>
      <View style={styles.panel}><View style={styles.panelHeader}><View><AppText style={styles.panelTitle}>Tóm tắt</AppText><AppText variant="caption">Một vài con số cần chú ý</AppText></View><MaterialDesignIcons name="clipboard-text-outline" size={22} color={colors.primary} /></View><SummaryRow label="Việc chưa hoàn thành" value={String(tasks.length - completedCount)} /><SummaryRow label="Việc cần xử lý sớm" value={String(tasks.filter(task => !task.done).length)} /></View>
    </ScrollView>
  );
}

function StatCard({icon, label, value, tone = 'default'}: {icon: React.ComponentProps<typeof MaterialDesignIcons>['name']; label: string; value: string; tone?: 'default' | 'success' | 'danger' | 'accent'}) {
  const {colors} = usePreferences();
  const styles = createStyles(colors);
  const toneColor = tone === 'success' ? colors.success : tone === 'danger' ? colors.danger : tone === 'accent' ? colors.accent : colors.primary;
  return <View style={styles.statCard}><MaterialDesignIcons name={icon} size={22} color={toneColor} /><AppText variant="caption" style={styles.statLabel}>{label}</AppText><AppText style={[styles.statValue, {color: toneColor}]}>{value}</AppText></View>;
}

function SummaryRow({label, value}: {label: string; value: string}) {
  const {colors} = usePreferences();
  const styles = createStyles(colors); return <View style={styles.summaryRow}><AppText variant="caption">{label}</AppText><AppText style={styles.summaryValue}>{value}</AppText></View>; }

const createStyles = (colors: ReturnType<typeof usePreferences>['colors']) => StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background}, content: {paddingHorizontal: spacing.md, gap: spacing.md}, header: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: spacing.sm}, heading: {marginTop: spacing.xs}, headerIcon: {width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm, backgroundColor: colors.accentSoft}, statGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm}, statCard: {width: '48%', minHeight: 116, padding: spacing.md, gap: spacing.xs, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border}, statLabel: {marginTop: spacing.xs}, statValue: {fontSize: 28, fontWeight: '700'}, panel: {gap: spacing.md, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border}, panelHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, panelTitle: {fontSize: 17, fontWeight: '700'}, chart: {gap: spacing.md}, barRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm}, barLabel: {width: 78, fontSize: 13}, barTrack: {flex: 1, height: 10, overflow: 'hidden', borderRadius: radii.pill, backgroundColor: colors.muted}, bar: {height: '100%', borderRadius: radii.pill, backgroundColor: colors.primary}, barValue: {width: 20, textAlign: 'right', color: colors.textMuted, fontWeight: '700'}, summaryRow: {minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border}, summaryValue: {fontSize: 18, fontWeight: '700', color: colors.primary},
});
