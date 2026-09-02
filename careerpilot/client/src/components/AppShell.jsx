import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  LayoutDashboard,
  LogOut,
  MailOpen,
  Menu,
  X
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { notificationApi } from "../api/queries";
import { useAuthStore } from "../store/authStore";
import { cx, formatRelativeTime } from "../utils/format";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: BriefcaseBusiness },
  { to: "/internships", label: "Explorer", icon: Compass },
  { to: "/tracker", label: "Tracker", icon: CheckCircle2 },
  { to: "/analytics", label: "Analytics", icon: BarChart3 }
];

export function AppShell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const notificationsRef = useRef(null);
  
  const { data, isLoading: notificationsLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationApi.list
  });
  
  const notifications = data?.notifications || [];
  const unread = notifications.filter((item) => !item.read).length;

  const readMutation = useMutation({
    mutationFn: notificationApi.read,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    function handlePointerDown(event) {
      if (!notificationsRef.current?.contains(event.target)) setNotificationsOpen(false);
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setSidebarOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-ink/10 bg-white px-4 py-5 lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-moss text-lg font-black text-white">CP</div>
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-moss">CareerPilot</p>
            <p className="text-xs font-semibold text-ink/55">AI Internship CRM</p>
          </div>
        </div>
        <nav className="grid gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cx(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition duration-200",
                  isActive ? "bg-moss text-white shadow-soft" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/95 backdrop-blur px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-ink/10 rounded-md transition"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gold">CareerPilot AI</p>
                <h1 className="text-lg font-black text-ink sm:text-xl">{user?.name || "Student workspace"}</h1>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  aria-expanded={notificationsOpen}
                  aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
                  className="relative grid h-10 w-10 place-items-center rounded-md bg-white text-ink shadow-soft transition hover:shadow-soft-lg focus:outline-none focus:ring-2 focus:ring-moss/30"
                  type="button"
                  onClick={() => setNotificationsOpen((open) => !open)}
                >
                  <Bell className="h-4 w-4" />
                  {unread ? (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[10px] font-black text-white animate-bounce-gentle">
                      {unread}
                    </span>
                  ) : null}
                </button>
                {notificationsOpen && (
                  <NotificationPanel
                    isLoading={notificationsLoading}
                    notifications={notifications}
                    onRead={(id) => readMutation.mutate(id)}
                    readPendingId={readMutation.variables}
                  />
                )}
              </div>

              {/* Logout */}
              <button
                aria-label="Log out"
                className="grid h-10 w-10 place-items-center rounded-md bg-white text-ink shadow-soft transition hover:text-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {sidebarOpen && (
            <nav className="mt-4 grid grid-cols-5 gap-1 lg:hidden">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cx(
                      "grid min-h-12 place-items-center rounded-md text-xs font-bold transition",
                      isActive ? "bg-moss text-white" : "bg-white text-ink/70"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                </NavLink>
              ))}
            </nav>
          )}
        </header>

        {/* Main Content */}
        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NotificationPanel({ isLoading, notifications, onRead, readPendingId }) {
  return (
    <section className="absolute right-0 top-12 z-40 w-[min(calc(100vw-2rem),28rem)] overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft-lg animate-slide-in">
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
        <div>
          <h2 className="text-sm font-black text-ink">Notifications</h2>
          <p className="text-xs font-semibold text-ink/50">{notifications.filter((item) => !item.read).length} unread</p>
        </div>
        <MailOpen className="h-4 w-4 text-ink/45" />
      </div>

      <div className="max-h-96 overflow-y-auto p-2 scrollbar-thin">
        {isLoading ? (
          <p className="px-3 py-6 text-sm font-semibold text-ink/55">Loading notifications...</p>
        ) : notifications.length ? (
          notifications.slice(0, 8).map((notification) => (
            <button
              key={notification._id}
              className={cx(
                "grid w-full gap-1 rounded-md px-3 py-3 text-left transition hover:bg-ink/5",
                notification.read ? "text-ink/60" : "bg-moss/5 text-ink"
              )}
              disabled={notification.read || readPendingId === notification._id}
              type="button"
              onClick={() => onRead(notification._id)}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-black leading-5">{notification.title}</p>
                {notification.read ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
                ) : (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-coral animate-pulse-soft" />
                )}
              </div>
              <p className="text-xs font-semibold leading-5 text-ink/60">{notification.message}</p>
              <p className="text-[11px] font-bold text-ink/40">{formatRelativeTime(notification.createdAt)}</p>
            </button>
          ))
        ) : (
          <p className="px-3 py-6 text-sm font-semibold text-ink/55">No notifications yet.</p>
        )}
      </div>
    </section>
  );
}
