import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useData } from '@/contexts/DataContext';
import { Calendar, Download, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ReportsPage() {
  const { t } = useLanguage();
  const { transactions, customers, getDailyStats } = useData();
  const [dateRange, setDateRange] = useState({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] });

  const stats = getDailyStats();
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US').format(amount) + ' IQD';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.reports')}</h1>
          <p className="text-muted-foreground">Generate and export reports</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Daily Report</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-secondary"><p className="text-xs text-muted-foreground">Sales</p><p className="text-xl font-bold">{formatCurrency(stats.totalSales)}</p></div>
          <div className="p-4 rounded-xl bg-secondary"><p className="text-xs text-muted-foreground">Cash In</p><p className="text-xl font-bold text-success">{formatCurrency(stats.cashIn)}</p></div>
          <div className="p-4 rounded-xl bg-secondary"><p className="text-xs text-muted-foreground">Loans</p><p className="text-xl font-bold text-warning">{formatCurrency(stats.loans)}</p></div>
          <div className="p-4 rounded-xl bg-secondary"><p className="text-xs text-muted-foreground">Transactions</p><p className="text-xl font-bold">{stats.transactionCount}</p></div>
        </div>
        <Button variant="primary"><Download className="w-4 h-4" /> Export Daily Report</Button>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Custom Report</h2>
        <div className="flex gap-4 mb-4">
          <div><label className="text-sm text-muted-foreground">Start</label><Input type="date" value={dateRange.start} onChange={(e) => setDateRange(p => ({ ...p, start: e.target.value }))} /></div>
          <div><label className="text-sm text-muted-foreground">End</label><Input type="date" value={dateRange.end} onChange={(e) => setDateRange(p => ({ ...p, end: e.target.value }))} /></div>
        </div>
        <Button variant="secondary"><TrendingUp className="w-4 h-4" /> Generate Report</Button>
      </div>
    </div>
  );
}
