
import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserMenuProps {
  userData: any;
  onLogout: () => void;
}

const UserMenu = ({ userData, onLogout }: UserMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
    onLogout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
      >
        <User className="w-4 h-4 text-white" />
      </button>

      {showMenu && (
        <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border p-4 min-w-48 z-50">
          <div className="text-sm text-gray-600 mb-2">
            Welcome, {userData?.user?.username || 'User'}
          </div>
          <div className="text-xs text-gray-400 mb-4">
            {userData?.user?.email}
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
