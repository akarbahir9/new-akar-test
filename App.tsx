import React, { useState, useEffect } from 'react';
import { LayoutDashboard, GitGraph, Settings as SettingsIcon, Search, Bell, Menu, X, Globe, Moon, Sun, Bot, LogOut } from 'lucide-react';
import { Language, Theme, View } from './types';
import { TRANSLATIONS } from './constants';
import Dashboard from './components/Dashboard';
import FlowEditor from './components/FlowEditor';
import GenAIAssistant from './components/GenAIAssistant';

const App: React.FC = () => {
  // State
  const [lang, setLang] = useState<Language>(Language.ENGLISH);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAiOpen, setAiOpen] = useState(false);

  // Derived
  const t = TRANSLATIONS[lang];
  const isRTL = lang === Language.ARABIC || lang === Language.SORANI || lang === Language.BADINI;

  // Effects
  useEffect(() => {
    // Handle Theme
    const root = window.document.documentElement;
    if (theme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Handle Direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [isRTL, lang]);

  // Handlers
  const toggleTheme = () => setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${isRTL ? 'font-noto' : ''}`}>
      
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-black/50" onClick={() => setSidebarOpen(true)} />
      )}

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-20'} 
        bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 flex flex-col fixed lg:relative h-full`}>
        
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100 dark:border-gray-700">
           <div className={`flex items-center gap-2 ${!isSidebarOpen && 'lg:justify-center'}`}>
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">Z</div>
              <span className={`font-bold text-xl tracking-tight ${!isSidebarOpen && 'lg:hidden'}`}>Zirng<span className="text-primary-500">Flow</span></span>
           </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
            <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label={isSidebarOpen ? t.dashboard : ''} />
            <NavItem view={View.FLOW_EDITOR} icon={GitGraph} label={isSidebarOpen ? t.flowEditor : ''} />
            <NavItem view={View.SETTINGS} icon={SettingsIcon} label={isSidebarOpen ? t.settings : ''} />
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
             <button 
                onClick={() => setAiOpen(!isAiOpen)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg`}
             >
                <Bot className="w-5 h-5" />
                {isSidebarOpen && <span className="font-medium">{t.aiAssistant}</span>}
             </button>
             
             {isSidebarOpen && (
                <div className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl cursor-pointer transition">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">{t.logout}</span>
                </div>
             )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-300">
                    {isSidebarOpen ? <Menu className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div className="relative hidden md:block">
                    <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                    <input 
                        type="text" 
                        placeholder={t.search} 
                        className={`bg-gray-100 dark:bg-dark-bg text-sm rounded-full py-2 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} focus:outline-none focus:ring-2 focus:ring-primary-500 w-64`}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Language Switcher */}
                <div className="relative group">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        <span className="uppercase text-xs font-bold">{lang}</span>
                    </button>
                    {/* Dropdown */}
                    <div className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-2 w-40 bg-white dark:bg-dark-surface rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 hidden group-hover:block`}>
                        {Object.values(Language).map((l) => (
                            <button 
                                key={l}
                                onClick={() => setLang(l)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${lang === l ? 'text-primary-500 font-bold' : 'text-gray-600 dark:text-gray-400'}`}
                            >
                                {l === Language.ENGLISH ? 'English' : 
                                 l === Language.ARABIC ? 'العربية' : 
                                 l === Language.SORANI ? 'کوردی' : 'بادینی'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme Toggle */}
                <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-300">
                    {theme === Theme.LIGHT ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-300 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-dark-surface"></span>
                </button>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:shadow-lg transition">
                    U
                </div>
            </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-hidden relative">
            {currentView === View.DASHBOARD && <Dashboard translation={t} />}
            {currentView === View.FLOW_EDITOR && <FlowEditor translation={t} />}
            {currentView === View.SETTINGS && (
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">{t.settings}</h1>
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <p className="text-gray-500">{t.connectWallet} Settings placeholder...</p>
                    </div>
                </div>
            )}
        </div>
        
        {/* AI Assistant Float */}
        {isAiOpen && (
            <GenAIAssistant translation={t} lang={lang} onClose={() => setAiOpen(false)} />
        )}
      </main>
    </div>
  );
};

export default App;
