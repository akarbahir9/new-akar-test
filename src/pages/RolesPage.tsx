import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth, Role, Permission, defaultPermissions } from '@/contexts/AuthContext';
import { 
  Shield, 
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  CreditCard,
  Users,
  Bot,
  Settings,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PermissionGroup {
  key: string;
  label: string;
  icon: React.ReactNode;
  permissions: { key: keyof Permission; label: string }[];
}

const permissionGroups: PermissionGroup[] = [
  {
    key: 'pos',
    label: 'roles.pos',
    icon: <ShoppingCart className="w-5 h-5" />,
    permissions: [
      { key: 'accessPos', label: 'perm.accessPos' },
      { key: 'createSales', label: 'perm.createSales' },
      { key: 'applyDiscounts', label: 'perm.applyDiscounts' },
      { key: 'assignCustomer', label: 'perm.assignCustomer' },
      { key: 'viewOwnSales', label: 'perm.viewOwnSales' },
      { key: 'viewAllSales', label: 'perm.viewAllSales' },
    ],
  },
  {
    key: 'financial',
    label: 'roles.financial',
    icon: <CreditCard className="w-5 h-5" />,
    permissions: [
      { key: 'viewFinancialDashboards', label: 'perm.viewFinancialDashboards' },
      { key: 'viewReports', label: 'perm.viewReports' },
      { key: 'viewCustomerBalances', label: 'perm.viewCustomerBalances' },
      { key: 'manageLoans', label: 'perm.manageLoans' },
      { key: 'receiveCashierCash', label: 'perm.receiveCashierCash' },
      { key: 'withdrawMoney', label: 'perm.withdrawMoney' },
    ],
  },
  {
    key: 'customer',
    label: 'roles.customer',
    icon: <Users className="w-5 h-5" />,
    permissions: [
      { key: 'viewCustomerList', label: 'perm.viewCustomerList' },
      { key: 'createCustomers', label: 'perm.createCustomers' },
      { key: 'editCustomers', label: 'perm.editCustomers' },
      { key: 'adjustCustomerBalance', label: 'perm.adjustCustomerBalance' },
    ],
  },
  {
    key: 'ai',
    label: 'roles.ai',
    icon: <Bot className="w-5 h-5" />,
    permissions: [
      { key: 'accessAiAssistant', label: 'perm.accessAiAssistant' },
      { key: 'viewPosInsights', label: 'perm.viewPosInsights' },
      { key: 'viewFinancialInsights', label: 'perm.viewFinancialInsights' },
      { key: 'viewLoanInsights', label: 'perm.viewLoanInsights' },
    ],
  },
  {
    key: 'system',
    label: 'roles.system',
    icon: <Settings className="w-5 h-5" />,
    permissions: [
      { key: 'manageUsers', label: 'perm.manageUsers' },
      { key: 'editRoles', label: 'perm.editRoles' },
      { key: 'accessSettings', label: 'perm.accessSettings' },
    ],
  },
];

export default function RolesPage() {
  const { t } = useLanguage();
  const { users, updateUser } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<Role>('manager');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['pos', 'financial']);
  const [editedPermissions, setEditedPermissions] = useState<Permission>(defaultPermissions[selectedRole]);

  const roles: { key: Role; label: string; count: number }[] = [
    { key: 'manager', label: t('roles.manager'), count: users.filter(u => u.role === 'manager').length },
    { key: 'accountant', label: t('roles.accountant'), count: users.filter(u => u.role === 'accountant').length },
    { key: 'cashier', label: t('roles.cashier'), count: users.filter(u => u.role === 'cashier').length },
  ];

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupKey)
        ? prev.filter(k => k !== groupKey)
        : [...prev, groupKey]
    );
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEditedPermissions(defaultPermissions[role]);
  };

  const togglePermission = (permKey: keyof Permission) => {
    setEditedPermissions(prev => ({
      ...prev,
      [permKey]: !prev[permKey],
    }));
  };

  const handleSave = () => {
    // Update all users with this role to have the new permissions
    users.filter(u => u.role === selectedRole).forEach(user => {
      updateUser(user.id, { permissions: editedPermissions });
    });
  };

  const hasChanges = JSON.stringify(editedPermissions) !== JSON.stringify(defaultPermissions[selectedRole]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('roles.title')}</h1>
          <p className="text-muted-foreground">Manage role permissions for your team</p>
        </div>
        
        {hasChanges && (
          <Button variant="primary" onClick={handleSave}>
            <Check className="w-5 h-5" />
            {t('common.save')} Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles List */}
        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Roles
          </h2>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => handleRoleSelect(role.key)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-lg transition-all",
                  selectedRole === role.key
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <Shield className={cn(
                    "w-5 h-5",
                    selectedRole === role.key ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "font-medium",
                    selectedRole === role.key ? "text-primary" : "text-foreground"
                  )}>
                    {role.label}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {role.count} users
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Permission Editor */}
        <div className="lg:col-span-3 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {t('roles.editPermissions')}: {t(`roles.${selectedRole}`)}
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure what this role can access
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {permissionGroups.map((group) => (
              <div key={group.key} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="w-full flex items-center justify-between p-4 bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      {group.icon}
                    </div>
                    <span className="font-medium text-foreground">{t(group.label)}</span>
                  </div>
                  {expandedGroups.includes(group.key) ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {expandedGroups.includes(group.key) && (
                  <div className="p-4 space-y-3 bg-background">
                    {group.permissions.map((perm) => (
                      <label
                        key={perm.key}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                      >
                        <span className="text-foreground">{t(perm.label)}</span>
                        <button
                          onClick={() => togglePermission(perm.key)}
                          className={cn(
                            "w-10 h-6 rounded-full transition-colors relative",
                            editedPermissions[perm.key]
                              ? "bg-primary"
                              : "bg-muted"
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                              editedPermissions[perm.key]
                                ? "left-5"
                                : "left-1"
                            )}
                          />
                        </button>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
