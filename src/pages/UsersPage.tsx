import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth, User, Permission, defaultPermissions, Role } from '@/contexts/AuthContext';
import { 
  UserPlus, 
  Edit2, 
  UserX, 
  UserCheck,
  Search,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserModalProps {
  user?: User;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  mode: 'add' | 'edit';
}

function UserModal({ user, onClose, onSave, mode }: UserModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    name: user?.name || '',
    role: user?.role || 'cashier' as Role,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const permissions = defaultPermissions[formData.role];
    onSave({
      ...formData,
      permissions,
      cashBalance: user?.cashBalance || 0,
      isActive: user?.isActive ?? true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {mode === 'add' ? t('users.add') : t('users.edit')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>×</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t('auth.username')}
            </label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Full Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t('users.role')}
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as Role }))}
              className="w-full h-10 px-3 rounded-lg border border-border bg-input text-foreground"
            >
              <option value="manager">{t('roles.manager')}</option>
              <option value="accountant">{t('roles.accountant')}</option>
              <option value="cashier">{t('roles.cashier')}</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { t } = useLanguage();
  const { users, updateUser, addUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    user?: User;
  }>({ isOpen: false, mode: 'add' });

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (userData: Partial<User>) => {
    if (modalState.mode === 'add') {
      addUser({
        username: userData.username!,
        name: userData.name!,
        role: userData.role!,
        permissions: userData.permissions!,
        cashBalance: 0,
        isActive: true,
      });
    } else if (modalState.user) {
      updateUser(modalState.user.id, userData);
    }
    setModalState({ isOpen: false, mode: 'add' });
  };

  const toggleUserStatus = (user: User) => {
    updateUser(user.id, { isActive: !user.isActive });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('users.title')}</h1>
          <p className="text-muted-foreground">{users.length} users</p>
        </div>
        
        <Button variant="primary" onClick={() => setModalState({ isOpen: true, mode: 'add' })}>
          <UserPlus className="w-5 h-5" />
          {t('users.add')}
        </Button>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>{t('users.role')}</th>
                <th>Cash Balance</th>
                <th>{t('users.status')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-muted-foreground">{user.username}</td>
                  <td>
                    <span className="flex items-center gap-1 badge-primary">
                      <Shield className="w-3 h-3" />
                      {t(`roles.${user.role}`)}
                    </span>
                  </td>
                  <td className="font-medium">{user.cashBalance.toLocaleString()} IQD</td>
                  <td>
                    {user.isActive ? (
                      <span className="badge-success">{t('users.active')}</span>
                    ) : (
                      <span className="badge-destructive">{t('users.inactive')}</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setModalState({ isOpen: true, mode: 'edit', user })}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => toggleUserStatus(user)}
                      >
                        {user.isActive ? (
                          <UserX className="w-4 h-4 text-destructive" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-success" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalState.isOpen && (
        <UserModal
          user={modalState.user}
          mode={modalState.mode}
          onClose={() => setModalState({ isOpen: false, mode: 'add' })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
