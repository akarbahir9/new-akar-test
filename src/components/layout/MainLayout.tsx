import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  UserCog,
  Shield,
  Bot,
  LogOut,
  Menu,
  X,
  Wifi,
  WifiOff,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { languages, Language } from '@/i18n/translations';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  permission?: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  const location = useLocation();
  const { isRTL } = useLanguage();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
        isActive && "bg-primary/10 text-primary",
        isActive && (isRTL ? "border-r-2 border-primary" : "border-l-2 border-primary")
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { user, logout, hasPermission, isOnline } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  const navItems: NavItemProps[] = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: t('nav.dashboard') },
    { to: '/pos', icon: <ShoppingCart className="w-5 h-5" />, label: t('nav.pos'), permission: 'accessPos' },
    { to: '/customers', icon: <Users className="w-5 h-5" />, label: t('nav.customers'), permission: 'viewCustomerList' },
    { to: '/financial', icon: <CreditCard className="w-5 h-5" />, label: t('nav.financial'), permission: 'viewFinancialDashboards' },
    { to: '/reports', icon: <BarChart3 className="w-5 h-5" />, label: t('nav.reports'), permission: 'viewReports' },
  ];

  const adminItems: NavItemProps[] = [
    { to: '/users', icon: <UserCog className="w-5 h-5" />, label: t('nav.users'), permission: 'manageUsers' },
    { to: '/roles', icon: <Shield className="w-5 h-5" />, label: t('nav.roles'), permission: 'editRoles' },
    { to: '/settings', icon: <Settings className="w-5 h-5" />, label: t('nav.settings'), permission: 'accessSettings' },
  ];

  const visibleNavItems = navItems.filter(item => !item.permission || hasPermission(item.permission as any));
  const visibleAdminItems = adminItems.filter(item => !item.permission || hasPermission(item.permission as any));

  return (
    <div className={cn("min-h-screen flex bg-background", isRTL && "flex-row-reverse")}>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col border-border bg-sidebar transition-all duration-300",
          isRTL ? "right-0 border-l" : "left-0 border-r",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
        style={{ background: 'var(--gradient-sidebar)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">Z</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground">Zirng System</h1>
            <p className="text-xs text-muted-foreground">POS & Finance</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          <div className="space-y-1">
            {visibleNavItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>

          {hasPermission('accessAiAssistant') && (
            <div className="mt-4 pt-4 border-t border-sidebar-border">
              <NavItem to="/ai-assistant" icon={<Bot className="w-5 h-5" />} label={t('nav.aiAssistant')} />
            </div>
          )}

          {visibleAdminItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-sidebar-border">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin
              </p>
              <div className="space-y-1 mt-2">
                {visibleAdminItems.map((item) => (
                  <NavItem key={item.to} {...item} />
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            {t('auth.logout')}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("flex-1 flex flex-col min-h-screen transition-all duration-300", sidebarOpen ? (isRTL ? "mr-64" : "ml-64") : "")}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {/* Online/Offline Status */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
              isOnline ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
            )}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {isOnline ? t('common.online') : t('common.offline')}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>{languages[language].nativeName}</span>
              </Button>

              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                  <div className={cn(
                    "absolute top-full mt-2 w-48 py-2 rounded-lg glass-panel z-50 animate-scale-in",
                    isRTL ? "left-0" : "right-0"
                  )}>
                    {(Object.keys(languages) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setLanguage(lang); setLangMenuOpen(false); }}
                        className={cn(
                          "w-full px-4 py-2 text-sm text-start hover:bg-secondary transition-colors",
                          language === lang && "text-primary bg-primary/10"
                        )}
                      >
                        <span className="font-medium">{languages[lang].nativeName}</span>
                        <span className="text-muted-foreground ml-2">({languages[lang].name})</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
