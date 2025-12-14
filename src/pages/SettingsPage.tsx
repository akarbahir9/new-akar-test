import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages, Language } from '@/i18n/translations';
import { 
  Globe, 
  DollarSign, 
  ArrowRightLeft,
  Receipt,
  Database,
  RefreshCw,
  Check,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SettingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingCard({ icon, title, description, children }: SettingCardProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  
  const [settings, setSettings] = useState({
    primaryCurrency: 'IQD',
    exchangeRate: 1470,
    receiptHeader: 'Zirng System',
    receiptFooter: 'Thank you for your purchase!',
    offlineCacheEnabled: true,
    autoSyncEnabled: true,
  });

  const handleSave = () => {
    // Save settings logic would go here
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
          <p className="text-muted-foreground">Configure your system preferences</p>
        </div>
        
        <Button variant="primary" onClick={handleSave}>
          <Save className="w-5 h-5" />
          {t('common.save')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Settings */}
        <SettingCard
          icon={<Globe className="w-5 h-5" />}
          title={t('settings.language')}
          description="Choose your preferred language"
        >
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(languages) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "p-4 rounded-lg border transition-all text-start",
                  language === lang
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-secondary border-border hover:border-primary/30"
                )}
              >
                <p className="font-medium">{languages[lang].nativeName}</p>
                <p className="text-sm text-muted-foreground">{languages[lang].name}</p>
                {language === lang && (
                  <Check className="w-4 h-4 mt-2 text-primary" />
                )}
              </button>
            ))}
          </div>
        </SettingCard>

        {/* Currency Settings */}
        <SettingCard
          icon={<DollarSign className="w-5 h-5" />}
          title={t('settings.currency')}
          description="Set your primary currency"
        >
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => setSettings(s => ({ ...s, primaryCurrency: 'IQD' }))}
                className={cn(
                  "flex-1 p-4 rounded-lg border transition-all",
                  settings.primaryCurrency === 'IQD'
                    ? "bg-primary/20 border-primary/50"
                    : "bg-secondary border-border hover:border-primary/30"
                )}
              >
                <p className="text-2xl font-bold">IQD</p>
                <p className="text-sm text-muted-foreground">Iraqi Dinar</p>
              </button>
              <button
                onClick={() => setSettings(s => ({ ...s, primaryCurrency: 'USD' }))}
                className={cn(
                  "flex-1 p-4 rounded-lg border transition-all",
                  settings.primaryCurrency === 'USD'
                    ? "bg-primary/20 border-primary/50"
                    : "bg-secondary border-border hover:border-primary/30"
                )}
              >
                <p className="text-2xl font-bold">USD</p>
                <p className="text-sm text-muted-foreground">US Dollar</p>
              </button>
            </div>
          </div>
        </SettingCard>

        {/* Exchange Rate */}
        <SettingCard
          icon={<ArrowRightLeft className="w-5 h-5" />}
          title={t('settings.exchangeRate')}
          description="Set USD to IQD exchange rate"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">1 USD =</label>
              <Input
                type="number"
                value={settings.exchangeRate}
                onChange={(e) => setSettings(s => ({ ...s, exchangeRate: Number(e.target.value) }))}
              />
            </div>
            <div className="text-2xl font-bold text-muted-foreground pt-6">IQD</div>
          </div>
        </SettingCard>

        {/* Receipt Settings */}
        <SettingCard
          icon={<Receipt className="w-5 h-5" />}
          title={t('settings.receipt')}
          description="Customize your receipt template"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Header Text</label>
              <Input
                value={settings.receiptHeader}
                onChange={(e) => setSettings(s => ({ ...s, receiptHeader: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Footer Text</label>
              <Input
                value={settings.receiptFooter}
                onChange={(e) => setSettings(s => ({ ...s, receiptFooter: e.target.value }))}
              />
            </div>
          </div>
        </SettingCard>

        {/* Offline Cache */}
        <SettingCard
          icon={<Database className="w-5 h-5" />}
          title={t('settings.offline')}
          description="Control offline data storage"
        >
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <span className="text-foreground">Enable Offline Cache</span>
              <button
                onClick={() => setSettings(s => ({ ...s, offlineCacheEnabled: !s.offlineCacheEnabled }))}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  settings.offlineCacheEnabled ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-white transition-all",
                  settings.offlineCacheEnabled ? "left-6" : "left-1"
                )} />
              </button>
            </label>

            <div className="p-4 rounded-lg bg-secondary">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Cache Size</span>
                <span className="text-sm font-medium text-foreground">24.5 MB</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-1/4 bg-primary rounded-full" />
              </div>
            </div>

            <Button variant="secondary" className="w-full">
              Clear Cache
            </Button>
          </div>
        </SettingCard>

        {/* Sync Control */}
        <SettingCard
          icon={<RefreshCw className="w-5 h-5" />}
          title={t('settings.sync')}
          description="Manage data synchronization"
        >
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <span className="text-foreground">Auto Sync when Online</span>
              <button
                onClick={() => setSettings(s => ({ ...s, autoSyncEnabled: !s.autoSyncEnabled }))}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  settings.autoSyncEnabled ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-white transition-all",
                  settings.autoSyncEnabled ? "left-6" : "left-1"
                )} />
              </button>
            </label>

            <div className="p-4 rounded-lg bg-secondary">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Sync</span>
                <span className="text-sm font-medium text-foreground">Just now</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-2 text-success">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">All data synced</span>
              </div>
            </div>

            <Button variant="primary" className="w-full">
              <RefreshCw className="w-4 h-4" />
              Sync Now
            </Button>
          </div>
        </SettingCard>
      </div>
    </div>
  );
}
