import React from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {usePreferences} from '../../core/theme/Preferences';
import {AppText} from '../../shared/components/AppText';
import {LoadingState} from '../../shared/components/LoadingState';
import type {BottomTabParamList} from '../../navigation/AppNavigator';
import {useReminders} from './RemindersProvider';

export function NotiListScreen({navigation}: BottomTabScreenProps<BottomTabParamList, 'NotiList'>) {
  const {colors} = usePreferences();
  const insets = useSafeAreaInsets();
  const {reminders, unreadCount, loading, markRead} = useReminders();
  if (loading) return <LoadingState label="Đang tải thông báo…" />;
  return <View style={[styles.screen, {backgroundColor: colors.background, paddingTop: insets.top + 16}]}>
    <FlatList data={reminders} keyExtractor={item => item.id} contentContainerStyle={styles.list}
      ListHeaderComponent={<View style={styles.header}><AppText variant="title">Thông báo</AppText><AppText variant="caption">Chưa hoàn thành · Đến hạn trong 3 ngày tới</AppText><Pressable disabled={!unreadCount} accessibilityRole="button" accessibilityState={{disabled: !unreadCount}} onPress={() => markRead(reminders.map(item => item.id))} style={({pressed}) => [styles.markAll, {opacity: !unreadCount ? 0.5 : pressed ? 0.7 : 1}]}><AppText>{unreadCount ? `Đọc tất cả (${unreadCount})` : 'Đã đọc tất cả'}</AppText></Pressable></View>}
      renderItem={({item}) => <Pressable accessibilityRole="button" accessibilityLabel={`${item.read ? 'Đã đọc' : 'Chưa đọc'}, ${item.task.title}, ${item.days === 0 ? 'hạn hôm nay' : `còn ${item.days} ngày`}`} onPress={() => {markRead([item.id]); navigation.navigate('Tasks', {screen: 'TaskDetail', params: {taskId: item.task.id}, initial: false});}} style={({pressed}) => [styles.card, {backgroundColor: item.read ? colors.surface : colors.accentSoft, borderColor: colors.border, opacity: pressed ? 0.7 : 1}]}>
        <MaterialDesignIcons name={item.days === 0 ? 'bell-ring-outline' : 'calendar-clock'} size={24} color={colors.accent} accessible={false} />
        <View style={styles.copy}><AppText style={styles.title}>{item.task.title}</AppText><AppText>{item.days === 0 ? 'Hạn hôm nay' : `Còn ${item.days} ngày`}</AppText><AppText variant="caption">{item.task.category} · {item.task.dueDate}</AppText>{!item.read && <AppText variant="caption">Chưa đọc</AppText>}</View>
      </Pressable>}
      ListEmptyComponent={<View style={styles.empty}><MaterialDesignIcons name="bell-check-outline" size={40} color={colors.textMuted} /><AppText style={styles.title}>Không có việc sắp đến hạn</AppText><AppText variant="caption">Thông báo xuất hiện khi công việc còn tối đa 3 ngày đến hạn.</AppText></View>}
    />
  </View>;
}
const styles = StyleSheet.create({screen: {flex: 1}, list: {paddingHorizontal: 16, paddingBottom: 24, gap: 12}, header: {gap: 8, paddingBottom: 8}, markAll: {minHeight: 48, alignSelf: 'flex-start', justifyContent: 'center'}, card: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 12, borderWidth: 1}, copy: {flex: 1, gap: 4}, title: {fontWeight: '700'}, empty: {paddingVertical: 40, gap: 12, alignItems: 'center'}});
