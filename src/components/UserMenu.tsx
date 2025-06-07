
import { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserMenuProps {
  userData: any;
  onLogout: () => void;
}

const UserMenu = ({ userData, onLogout }: UserMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    toast.success('Déconnecté avec succès');
    onLogout();
    setShowMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg"
      >
        <User className="w-5 h-5 text-white" />
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-12 right-0 bg-white rounded-xl shadow-xl border border-gray-200 p-6 min-w-64 z-50 animate-fade-in">
            {/* User Info */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-lg">
                    {userData?.user?.username || 'Utilisateur'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {userData?.user?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-4"></div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Se déconnecter
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
