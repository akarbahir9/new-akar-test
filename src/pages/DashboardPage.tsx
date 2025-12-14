import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertCircle,
  ShoppingCart,
  Users,
  Receipt,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconColor: string;
}

function StatCard({ title, value, change, changeType = 'neutral', icon, iconColor }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              changeType === 'positive' ? 'text-success' : 
              changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {changeType === 'positive' ? <TrendingUp className="w-4 h-4" /> : null}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { t, isRTL } = useLanguage();
  const { user, hasPermission } = useAuth();
  const { transactions, customers, getDailyStats } = useData();
  const navigate = useNavigate();
  
  const stats = getDailyStats();
  const totalOutstandingLoans = customers.reduce((sum, c) => sum + Math.abs(Math.min(c.balance, 0)), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' IQD';
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">
            {t('common.today')}: {new Date().toLocaleDateString()}
          </p>
        </div>
        
        {hasPermission('accessPos') && (
          <Button variant="primary" onClick={() => navigate('/pos')}>
            <Plus className="w-5 h-5" />
            New Sale
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.totalSales')}
          value={formatCurrency(stats.totalSales)}
          change={`${stats.transactionCount} transactions`}
          changeType="neutral"
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
          changeType={totalOutstandingLoans > 0 ? 'negative' : 'neutral'}
          icon={<AlertCircle className="w-6 h-6 text-destructive" />}
          iconColor="bg-destructive/20"
        />
      </div>

      {/* Quick Actions & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {hasPermission('accessPos') && (
              <Button variant="secondary" className="flex-col h-auto py-4" onClick={() => navigate('/pos')}>
                <ShoppingCart className="w-6 h-6 mb-2" />
                <span className="text-xs">New Sale</span>
              </Button>
            )}
            {hasPermission('viewCustomerList') && (
              <Button variant="secondary" className="flex-col h-auto py-4" onClick={() => navigate('/customers')}>
                <Users className="w-6 h-6 mb-2" />
                <span className="text-xs">Customers</span>
              </Button>
            )}
            {hasPermission('viewReports') && (
              <Button variant="secondary" className="flex-col h-auto py-4" onClick={() => navigate('/reports')}>
                <Receipt className="w-6 h-6 mb-2" />
                <span className="text-xs">Reports</span>
              </Button>
            )}
            {hasPermission('createCustomers') && (
              <Button variant="secondary" className="flex-col h-auto py-4" onClick={() => navigate('/customers?add=true')}>
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-xs">Add Customer</span>
              </Button>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('dashboard.recentTransactions')}</h2>
          
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('common.noData')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="font-mono text-sm">#{tx.id.slice(-4)}</td>
                      <td>{tx.customerName || '—'}</td>
                      <td>{tx.items.length} items</td>
                      <td className="font-medium">{formatCurrency(tx.total)}</td>
                      <td>{formatCurrency(tx.paid)}</td>
                      <td>
                        {tx.loan > 0 ? (
                          <span className="badge-warning">Loan: {formatCurrency(tx.loan)}</span>
                        ) : tx.synced ? (
                          <span className="badge-success">{t('common.synced')}</span>
                        ) : (
                          <span className="badge-primary">{t('common.pending')}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User's Cash Balance (for cashiers) */}
      {user?.role === 'cashier' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">{t('financial.myBalance')}</h2>
          <p className="text-3xl font-bold text-primary">{formatCurrency(user.cashBalance)}</p>
        </div>
      )}
    </div>
  );
}
