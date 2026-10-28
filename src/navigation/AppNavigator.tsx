import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {enableScreens} from 'react-native-screens';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';

import {TaskDetailScreen} from '../features/tasks/presentation/screens/TaskDetailScreen';
import {TaskFormScreen} from '../features/tasks/presentation/screens/TaskFormScreen';
import {TaskListScreen} from '../features/tasks/presentation/screens/TaskListScreen';
import {StatsScreen} from '../features/stats/presentation/screens/StatsScreen';
import {SettingsScreen} from '../features/settings/presentation/screens/SettingsScreen';
import {usePreferences} from '../core/theme/Preferences';
import type {NavigatorScreenParams} from '@react-navigation/native';
import {NotiListScreen} from '../features/reminders/NotiListScreen';
import {useReminders} from '../features/reminders/RemindersProvider';

enableScreens();

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: {taskId?: string} | undefined;
  TaskDetail: {taskId: string};
};
export type BottomTabParamList = {
  Tasks: NavigatorScreenParams<RootStackParamList> | undefined;
  NotiList: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<BottomTabParamList>();

function getTabIcon(routeName: keyof BottomTabParamList, color: string, size: number) {
  const icon = routeName === 'Tasks' ? 'format-list-checks' : routeName === 'Stats' ? 'chart-box-outline' : routeName === 'NotiList' ? 'bell-outline' : 'cog-outline';
  return <MaterialDesignIcons name={icon} size={size} color={color} />;
}

function TaskStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TaskList" component={TaskListScreen} />
      <Stack.Screen name="TaskForm" component={TaskFormScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const {colors} = usePreferences();
  const {unreadCount} = useReminders();
  return (
    <NavigationContainer>
      <Tabs.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {height: 68, paddingTop: 8, paddingBottom: 10, backgroundColor: colors.surface, borderTopColor: colors.border},
          tabBarLabelStyle: {fontSize: 12, fontWeight: '700'},
          tabBarIcon: ({color, size}) => getTabIcon(route.name, color, size),
        })}>
        <Tabs.Screen name="Tasks" component={TaskStack} options={{title: 'Công việc'}} />
        <Tabs.Screen name="Stats" component={StatsScreen} options={{title: 'Thống kê'}} />
        <Tabs.Screen name="NotiList" component={NotiListScreen} options={{title: 'Thông báo', tabBarBadge: unreadCount || undefined}} />
        <Tabs.Screen name="Settings" component={SettingsScreen} options={{title: 'Cài đặt'}} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
