
import { Home, Video, User, Plus, Crown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import CreatePredictionModal from './CreatePredictionModal';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const { user, requireAuth } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const handleCreateClick = () => {
    if (requireAuth()) {
      setShowCreateModal(true);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };
  
  const navItems = [
    { icon: Home, label: 'Accueil', active: true, action: () => navigate('/') },
    { icon: Crown, label: 'Canaux', active: false, action: () => navigate('/channels') },
    { icon: Plus, label: '', active: false, action: handleCreateClick, isCenter: true },
    { icon: Video, label: 'Lives', active: false, action: () => navigate('/lives') },
    { icon: User, label: user ? 'Profil' : 'Connexion', active: false, action: handleProfileClick },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-end">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            if (item.isCenter) {
              return (
                <div key={index} className="flex-1 flex justify-center">
                  <button
                    onClick={item.action}
                    className={`w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center -mt-4 shadow-lg border-3 border-background transition-all duration-200 hover:scale-105 active:scale-95 ${
                      !user ? 'opacity-50' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </button>
                </div>
              );
            }
            return (
              <button
                key={index}
                onClick={item.action}
                className={`flex-1 py-2 px-1 flex flex-col items-center justify-center space-y-1 transition-all duration-200 min-h-[4rem] active:bg-muted/50 ${
                  item.active
                    ? 'text-gray-600 bg-gray-100'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {user && (
        <CreatePredictionModal 
          open={showCreateModal} 
          onOpenChange={setShowCreateModal} 
        />
      )}
    </>
  );
};

export default BottomNavigation;
