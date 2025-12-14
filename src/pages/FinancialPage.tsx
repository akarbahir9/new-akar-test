import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet,
  ArrowRightLeft,
  Calendar,
  FileText,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconColor: string;
}

function StatCard({ title, value, subtitle, icon, iconColor }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function FinancialPage() {
  const { t } = useLanguage();
  const { user, hasPermission, users } = useAuth();
  const { transactions, customers, cashTransfers, addCashTransfer, getDailyStats } = useData();

  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');

  const stats = getDailyStats();
  const totalOutstandingLoans = customers.reduce((sum, c) => sum + Math.abs(Math.min(c.balance, 0)), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' IQD';
  };

  // Get transactions for the selected date range
  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.createdAt).toISOString().split('T')[0];
    return txDate >= dateRange.start && txDate <= dateRange.end;
  });

  const rangeStats = {
    totalSales: filteredTransactions.reduce((sum, tx) => sum + tx.total, 0),
    totalCashIn: filteredTransactions.reduce((sum, tx) => sum + tx.paid, 0),
    totalLoans: filteredTransactions.reduce((sum, tx) => sum + tx.loan, 0),
    transactionCount: filteredTransactions.length,
  };

  const handleTransfer = () => {
    if (!transferAmount || !user) return;

    // Find an accountant to transfer to
    const accountant = users.find(u => u.role === 'accountant' && u.isActive);
    if (!accountant) return;

    addCashTransfer({
      fromUserId: user.id,
      fromUserName: user.name,
      toUserId: accountant.id,
      toUserName: accountant.name,
      amount: Number(transferAmount),
      type: 'cashier_to_accountant',
    });

    setTransferAmount('');
    setShowTransferModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('financial.title')}</h1>
          <p className="text-muted-foreground">{t('common.today')}: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.totalSales')}
          value={formatCurrency(stats.totalSales)}
          subtitle={`${stats.transactionCount} transactions`}
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
          iconColor="bg-primary/20"
        />
        <StatCard
          title={t('dashboard.cashIn')}
          value={formatCurrency(stats.cashIn)}
          icon={<ArrowDownLeft className="w-6 h-6 text-success" />}
          iconColor="bg-success/20"
        />
        <StatCard
          title={t('dashboard.cashOut')}
          value={formatCurrency(stats.cashOut)}
          icon={<ArrowUpRight className="w-6 h-6 text-accent" />}
          iconColor="bg-accent/20"
        />
        <StatCard
          title={t('dashboard.outstandingLoans')}
          value={formatCurrency(totalOutstandingLoans)}
          icon={<Wallet className="w-6 h-6 text-destructive" />}
          iconColor="bg-destructive/20"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Balance / Cash Actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {t('financial.myBalance')}
          </h2>
          
          <div className="text-center py-6 mb-4 rounded-xl bg-secondary">
            <p className="text-sm text-muted-foreground mb-2">{user?.name}</p>
            <p className="text-4xl font-bold text-primary">
              {formatCurrency(user?.cashBalance || 0)}
            </p>
          </div>

          <div className="space-y-3">
            {user?.role === 'cashier' && hasPermission('receiveCashierCash') === false && (
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => setShowTransferModal(true)}
              >
                <ArrowRightLeft className="w-4 h-4" />
                Transfer to Accountant
              </Button>
            )}

            {hasPermission('receiveCashierCash') && (
              <Button variant="primary" className="w-full">
                <ArrowDownLeft className="w-4 h-4" />
                {t('financial.receive')}
              </Button>
            )}

            {hasPermission('withdrawMoney') && (
              <Button variant="secondary" className="w-full">
                <ArrowUpRight className="w-4 h-4" />
                {t('financial.withdraw')}
              </Button>
            )}
          </div>
        </div>

        {/* Date Range Report */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t('financial.dateRange')}
          </h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm text-muted-foreground mb-1 block">Start</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm text-muted-foreground mb-1 block">End</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button variant="secondary">
                <Download className="w-4 h-4" />
                {t('common.export')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(rangeStats.totalSales)}</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">Cash Collected</p>
              <p className="text-xl font-bold text-success">{formatCurrency(rangeStats.totalCashIn)}</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">Loans Given</p>
              <p className="text-xl font-bold text-warning">{formatCurrency(rangeStats.totalLoans)}</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">Transactions</p>
              <p className="text-xl font-bold text-foreground">{rangeStats.transactionCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Transfers */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          {t('financial.transfers')}
        </h2>

        {cashTransfers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t('common.noData')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cashTransfers.map((transfer) => (
                  <tr key={transfer.id}>
                    <td>{new Date(transfer.createdAt).toLocaleDateString()}</td>
                    <td>{transfer.fromUserName}</td>
                    <td>{transfer.toUserName}</td>
                    <td className="font-medium">{formatCurrency(transfer.amount)}</td>
                    <td>
                      <span className="badge-primary">
                        {transfer.type === 'cashier_to_accountant' ? 'Transfer' : 'Withdrawal'}
                      </span>
                    </td>
                    <td>
                      {transfer.synced ? (
                        <span className="badge-success">{t('common.synced')}</span>
                      ) : (
                        <span className="badge-warning">{t('common.pending')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-foreground mb-6">Transfer Cash</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Amount (IQD)</label>
                <Input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowTransferModal(false)}>
                  {t('common.cancel')}
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleTransfer}>
                  {t('common.confirm')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
