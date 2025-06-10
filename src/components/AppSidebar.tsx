
import { useState, useRef, useEffect } from 'react';
import { History, LogOut, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AppSidebarProps {
  userData: any;
  onLogout: () => void;
  onHistoricalClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const AppSidebar = ({ userData, onLogout, onHistoricalClick, isOpen, onClose }: AppSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    toast.success('Déconnecté avec succès');
    onLogout();
    onClose();
  };

  const handleHistoricalClick = () => {
    onHistoricalClick();
    onClose();
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-orange-50 to-orange-100 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-orange-200">
          <h2 className="text-2xl font-bold text-gray-800">Historical</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Menu Items */}
          <div className="space-y-4 mb-8">
            <button
              onClick={handleHistoricalClick}
              className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-orange-200 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-800 font-medium">View Historical</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-orange-200 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-800 font-medium">Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Footer with User Info */}
        <div className="bg-orange-400 p-6 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                User ID: {userData?.userID || 'Unknown'}
              </div>
              <div className="text-sm text-gray-600">
                {userData?.email || 'No email'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
