import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Customer } from '@/contexts/DataContext';
import { 
  Search, 
  Plus, 
  User, 
  Phone,
  Mail,
  CreditCard,
  X,
  Edit2,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomerModalProps {
  customer?: Customer;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases'>) => void;
  mode: 'add' | 'edit' | 'view';
}

function CustomerModal({ customer, onClose, onSave, mode }: CustomerModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [balance, setBalance] = useState(customer?.balance || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, phone, email, balance });
  };

  const isViewMode = mode === 'view';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {mode === 'add' ? t('customers.add') : mode === 'edit' ? t('customers.edit') : customer?.name}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t('customers.name')}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isViewMode}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t('customers.phone')}
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isViewMode}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t('customers.email')}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isViewMode}
            />
          </div>

          {(isViewMode || mode === 'edit') && customer && (
            <>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground mb-1">{t('customers.balance')}</p>
                  <p className={`text-xl font-bold ${customer.balance < 0 ? 'text-destructive' : 'text-success'}`}>
                    {customer.balance.toLocaleString()} IQD
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground mb-1">{t('customers.totalPurchases')}</p>
                  <p className="text-xl font-bold text-foreground">
                    {customer.totalPurchases.toLocaleString()} IQD
                  </p>
                </div>
              </div>
            </>
          )}

          {!isViewMode && (
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {t('common.save')}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const { t } = useLanguage();
  const { hasPermission } = useAuth();
  const { customers, addCustomer, updateCustomer } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view';
    customer?: Customer;
  }>({ isOpen: false, mode: 'add' });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleSave = (data: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases'>) => {
    if (modalState.mode === 'add') {
      addCustomer(data);
    } else if (modalState.mode === 'edit' && modalState.customer) {
      updateCustomer(modalState.customer.id, data);
    }
    setModalState({ isOpen: false, mode: 'add' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('customers.title')}</h1>
          <p className="text-muted-foreground">{customers.length} customers</p>
        </div>
        
        {hasPermission('createCustomers') && (
          <Button variant="primary" onClick={() => setModalState({ isOpen: true, mode: 'add' })}>
            <Plus className="w-5 h-5" />
            {t('customers.add')}
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('customers.search')}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-lg text-muted-foreground">{t('customers.noCustomers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setModalState({ isOpen: true, mode: 'view', customer })}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {hasPermission('editCustomers') && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setModalState({ isOpen: true, mode: 'edit', customer })}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {customer.email && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <Mail className="w-3 h-3" />
                  {customer.email}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">{t('customers.balance')}</p>
                  <div className="flex items-center gap-1">
                    {customer.balance < 0 && <AlertCircle className="w-4 h-4 text-destructive" />}
                    <p className={`font-bold ${customer.balance < 0 ? 'text-destructive' : customer.balance > 0 ? 'text-success' : 'text-foreground'}`}>
                      {customer.balance.toLocaleString()} IQD
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('customers.totalPurchases')}</p>
                  <p className="font-bold text-foreground flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    {customer.totalPurchases.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalState.isOpen && (
        <CustomerModal
          customer={modalState.customer}
          mode={modalState.mode}
          onClose={() => setModalState({ isOpen: false, mode: 'add' })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
