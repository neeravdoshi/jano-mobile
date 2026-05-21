import { ChevronLeft, Home, CalendarDays, MessagesSquare, Search, Sparkles, UserRound } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

import { patients } from "../fixtures/patients";
import { QuickActionDrawer } from "../features/actions/QuickActionDrawer";
import { BottomNav } from "../navigation/BottomNav";

export function AppLayout() {
  const navigate = useNavigate();
  const featuredPatient = patients[0];

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        <div className="mobile-frame__glow" />
        <div className="mobile-frame__screen">
          <header className="topbar">
            <button
              className="topbar__back"
              type="button"
              aria-label="Go back"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                }
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <div className="topbar__identity">
              <h1 className="topbar__title">{featuredPatient.name}</h1>
              <p className="topbar__subtitle">MRN {featuredPatient.id.toUpperCase()}</p>
            </div>
            <button className="icon-button topbar__search" type="button" aria-label="Search">
              <Search size={18} />
            </button>
          </header>
          <main className="screen-content">
            <Outlet />
          </main>
          <BottomNav
            items={[
              { to: "/", label: "Home", icon: Home },
              { to: "/schedule", label: "Schedule", icon: CalendarDays, disabled: true },
              { to: "/chat", label: "Chat", icon: MessagesSquare, disabled: true },
              { to: "/profile", label: "User", icon: UserRound, disabled: true }
            ]}
            centerAction={{
              label: "Quick action",
              icon: Sparkles,
              onPress: () => {
                window.dispatchEvent(new CustomEvent("jano:quick-action"));
              }
            }}
          />
          <QuickActionDrawer />
        </div>
      </div>
    </div>
  );
}
