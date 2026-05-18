import { CalendarDays, Home, MessagesSquare, Sparkles, UserRound } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { BottomNav } from '../navigation/BottomNav';

export function SubPageLayout() {
  return (
    <div className="app-shell">
      <div className="mobile-frame">
        <div className="mobile-frame__glow" />
        <div className="mobile-frame__screen mobile-frame__screen--sub">
          <main className="screen-content screen-content--flush">
            <Outlet />
          </main>
          <BottomNav
            items={[
              { to: '/', label: 'Home', icon: Home },
              { to: '/schedule', label: 'Schedule', icon: CalendarDays, disabled: true },
              { to: '/chat', label: 'Chat', icon: MessagesSquare },
              { to: '/profile', label: 'User', icon: UserRound, disabled: true },
            ]}
            centerAction={{
              label: 'Quick action',
              icon: Sparkles,
              onPress: () => {
                window.dispatchEvent(new CustomEvent('jano:quick-action'));
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
