import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Product, CartItem } from '@/contexts/DataContext';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  Receipt, 
  CreditCard,
  X,
  Check,
  FileText,
  Printer,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  total: number;
  onClose: () => void;
  onComplete: (paid: number, note?: string) => void;
  customerName?: string;
}

function PaymentModal({ total, onClose, onComplete, customerName }: PaymentModalProps) {
  const { t } = useLanguage();
  const [paid, setPaid] = useState(total);
  const [note, setNote] = useState('');
  
  const change = paid >= total ? paid - total : 0;
  const loan = paid < total ? total - paid : 0;

  const handleSubmit = () => {
    onComplete(paid, note);
  };

  const quickAmounts = [5000, 10000, 25000, 50000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{t('pos.payment')}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Total */}
          <div className="text-center p-4 rounded-xl bg-secondary">
            <p className="text-sm text-muted-foreground mb-1">{t('pos.total')}</p>
            <p className="text-4xl font-bold text-primary">{total.toLocaleString()} IQD</p>
            {customerName && (
              <p className="text-sm text-muted-foreground mt-2">
                <User className="w-4 h-4 inline mr-1" />
                {customerName}
              </p>
            )}
          </div>

          {/* Paid Amount */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t('pos.paid')}
            </label>
            <Input
              type="number"
              value={paid}
              onChange={(e) => setPaid(Number(e.target.value))}
              className="text-xl font-bold h-14 text-center"
            />
            <div className="grid grid-cols-4 gap-2 mt-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="secondary"
                  size="sm"
                  onClick={() => setPaid(paid + amount)}
                >
                  +{(amount / 1000)}K
                </Button>
              ))}
            </div>
          </div>

          {/* Change or Loan */}
          {change > 0 && (
            <div className="p-4 rounded-xl bg-success/10 border border-success/30">
              <p className="text-sm text-success mb-1">{t('pos.change')}</p>
              <p className="text-2xl font-bold text-success">{change.toLocaleString()} IQD</p>
            </div>
          )}

          {loan > 0 && (
            <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
              <p className="text-sm text-warning mb-1">{t('pos.loan')}</p>
              <p className="text-2xl font-bold text-warning">{loan.toLocaleString()} IQD</p>
              {!customerName && (
                <p className="text-xs text-warning/70 mt-1">
                  ⚠️ Select a customer to record this loan
                </p>
              )}
            </div>
          )}

          {/* Note */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t('pos.addNote')}
            </label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button 
              variant="primary" 
              className="flex-1"
              onClick={handleSubmit}
              disabled={loan > 0 && !customerName}
            >
              <Check className="w-5 h-5" />
              {t('pos.complete')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReceiptModalProps {
  transaction: {
    id: string;
    items: CartItem[];
    total: number;
    paid: number;
    change: number;
    loan: number;
    customerName?: string;
    note?: string;
  };
  onClose: () => void;
}

function ReceiptModal({ transaction, onClose }: ReceiptModalProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-sm p-6 animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Sale Complete!</h2>
        </div>

        {/* Receipt */}
        <div className="bg-secondary rounded-xl p-4 mb-6 font-mono text-sm">
          <div className="text-center border-b border-border pb-3 mb-3">
            <p className="font-bold">Zirng System</p>
            <p className="text-xs text-muted-foreground">Receipt #{transaction.id.slice(-6)}</p>
            <p className="text-xs text-muted-foreground">{new Date().toLocaleString()}</p>
          </div>

          {transaction.customerName && (
            <p className="mb-3 text-muted-foreground">Customer: {transaction.customerName}</p>
          )}

          <div className="space-y-1 mb-3">
            {transaction.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.quantity}x {item.product.name}</span>
                <span>{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-1">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{transaction.total.toLocaleString()} IQD</span>
            </div>
            <div className="flex justify-between">
              <span>Paid</span>
              <span>{transaction.paid.toLocaleString()} IQD</span>
            </div>
            {transaction.change > 0 && (
              <div className="flex justify-between text-success">
                <span>Change</span>
                <span>{transaction.change.toLocaleString()} IQD</span>
              </div>
            )}
            {transaction.loan > 0 && (
              <div className="flex justify-between text-warning">
                <span>Loan</span>
                <span>{transaction.loan.toLocaleString()} IQD</span>
              </div>
            )}
          </div>

          {transaction.note && (
            <div className="border-t border-border pt-3 mt-3">
              <p className="text-xs text-muted-foreground">Note: {transaction.note}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            <FileText className="w-4 h-4" />
            New Sale
          </Button>
          <Button variant="primary" className="flex-1">
            <Printer className="w-4 h-4" />
            {t('pos.printReceipt')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function POSPage() {
  const { t, language } = useLanguage();
  const { user, hasPermission } = useAuth();
  const { 
    products, 
    customers,
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity,
    updateCartDiscount,
    clearCart,
    selectedCustomer,
    setSelectedCustomer,
    addTransaction,
    getCartTotal,
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameKu.includes(searchTerm) ||
      p.nameAr.includes(searchTerm);
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const { subtotal, discount, total } = getCartTotal();

  const getProductName = (product: Product) => {
    if (language === 'ckb') return product.nameKu;
    if (language === 'ar') return product.nameAr;
    return product.name;
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowPayment(true);
  };

  const handlePaymentComplete = (paid: number, note?: string) => {
    const change = paid >= total ? paid - total : 0;
    const loan = paid < total ? total - paid : 0;

    const transaction = {
      items: [...cart],
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name,
      subtotal,
      discount,
      total,
      paid,
      change,
      loan,
      cashierId: user!.id,
      cashierName: user!.name,
      note,
    };

    addTransaction(transaction);
    setLastTransaction({ ...transaction, id: Date.now().toString() });
    setShowPayment(false);
    setShowReceipt(true);
    clearCart();
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    setLastTransaction(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4 animate-fade-in">
      {/* Products Grid */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        {/* Search & Categories */}
        <div className="p-4 border-b border-border space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('pos.search')}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <Button
              variant={selectedCategory === null ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="pos-item text-start"
              >
                <p className="font-medium text-foreground mb-1 line-clamp-2">
                  {getProductName(product)}
                </p>
                <p className="text-lg font-bold text-primary">
                  {product.price.toLocaleString()} IQD
                </p>
                <p className="text-xs text-muted-foreground">
                  Stock: {product.stock}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart */}
      <div className="w-96 flex flex-col glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">{t('pos.cart')}</h2>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart}>
                <Trash2 className="w-4 h-4" />
                {t('pos.clear')}
              </Button>
            )}
          </div>

          {/* Customer Selection */}
          <div className="mt-3">
            <button
              onClick={() => setShowCustomerSelect(!showCustomerSelect)}
              className="w-full flex items-center gap-2 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <User className="w-5 h-5 text-muted-foreground" />
              <span className={selectedCustomer ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedCustomer?.name || t('pos.selectCustomer')}
              </span>
            </button>

            {showCustomerSelect && (
              <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-border bg-popover">
                <button
                  onClick={() => { setSelectedCustomer(null); setShowCustomerSelect(false); }}
                  className="w-full p-3 text-start hover:bg-secondary text-muted-foreground"
                >
                  No customer
                </button>
                {customers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => { setSelectedCustomer(customer); setShowCustomerSelect(false); }}
                    className="w-full p-3 text-start hover:bg-secondary border-t border-border"
                  >
                    <p className="font-medium text-foreground">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.phone}</p>
                    {customer.balance < 0 && (
                      <p className="text-xs text-warning">
                        Debt: {Math.abs(customer.balance).toLocaleString()} IQD
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('pos.noItems')}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="p-3 rounded-lg bg-secondary">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {getProductName(item.product)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.product.price.toLocaleString()} IQD × {item.quantity}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon-sm"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="secondary"
                      size="icon-sm"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="font-bold text-foreground">
                    {(item.product.price * item.quantity).toLocaleString()} IQD
                  </p>
                </div>

                {hasPermission('applyDiscounts') && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Discount:</span>
                    <Input
                      type="number"
                      value={item.discount}
                      onChange={(e) => updateCartDiscount(item.product.id, Number(e.target.value))}
                      className="h-7 w-24 text-sm"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Totals & Checkout */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('pos.subtotal')}</span>
            <span className="text-foreground">{subtotal.toLocaleString()} IQD</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('pos.discount')}</span>
              <span className="text-success">-{discount.toLocaleString()} IQD</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span className="text-foreground">{t('pos.total')}</span>
            <span className="text-primary">{total.toLocaleString()} IQD</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            <CreditCard className="w-5 h-5" />
            {t('pos.checkout')}
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          total={total}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
          customerName={selectedCustomer?.name}
        />
      )}

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <ReceiptModal
          transaction={lastTransaction}
          onClose={handleReceiptClose}
        />
      )}
    </div>
  );
}
