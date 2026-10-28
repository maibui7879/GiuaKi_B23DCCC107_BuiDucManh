import {StatusBar} from 'react-native';
import {PreferencesProvider, usePreferences} from './src/core/theme/Preferences';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AppNavigator} from './src/navigation/AppNavigator';
import {TasksProvider} from './src/features/tasks/presentation/hooks/useTasks';
import {NotificationsProvider, NotificationModal} from './src/shared/components/Notifications';

function AppContent() {
  const {dark} = usePreferences();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <TasksProvider>
        <AppNavigator />
      </TasksProvider>
      <NotificationModal />
    </SafeAreaProvider>
  );
}

function App() {
  return <NotificationsProvider><PreferencesProvider><AppContent /></PreferencesProvider></NotificationsProvider>;
}

export default App;
