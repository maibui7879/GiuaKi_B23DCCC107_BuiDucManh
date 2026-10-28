import React, {createContext, useCallback, useContext, useState} from 'react';

type Notice = {title: string; message: string};
const Context = createContext({notify: (_notice: Notice) => {}, notices: [] as Notice[], dismiss: () => {}});
export function NotificationsProvider({children}: React.PropsWithChildren) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const notify = useCallback((notice: Notice) => setNotices(current => [...current, notice]), []);
  const dismiss = useCallback(() => setNotices(current => current.slice(1)), []);
  return <Context.Provider value={{notify, notices, dismiss}}>{children}</Context.Provider>;
}
export const useNotifications = () => useContext(Context);
