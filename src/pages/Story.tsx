import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Plus, Search, Play, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';
import SideMenu from '@/components/SideMenu';
import NotificationIcon from '@/components/NotificationIcon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Story = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data pour les stories
  const stories = [
    {
      id: 1,
      user: {
        username: 'username',
        avatar: '/placeholder.svg'
      },
      location: 'New York City',
      liveViewers: '3,340',
      likes: '24.1K',
      comments: '1,206',
      description: 'Description of the video',
      hashtag: '#hashtag',
      video: '/placeholder.svg',
      lastComment: 'Great vibes! 👍'
    }
  ];

  const relatedVideos = Array(5).fill(null).map((_, i) => ({
    id: i,
    thumbnail: '/placeholder.svg',
    user: `user${i}`
  }));

  const story = stories[currentStory];

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec logo, notifications et photo de profil */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 border-b sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSideMenuOpen(true)}
                className="lg:hidden text-white hover:bg-white/20"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/35ad5651-d83e-4704-9851-61f3ad9fb0c3.png" 
                  alt="PENDOR Logo" 
                  className="w-8 h-8 rounded-full"
                />
                <h1 className="text-xl font-bold text-white">PENDOR</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {user && <NotificationIcon />}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleProfileClick}
                className="text-white hover:bg-white/20"
              >
                {user ? (
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <User className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Story */}
      <div className="relative bg-black" style={{ height: 'calc(100vh - 73px - 80px)' }}>
        {/* Vidéo principale */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-800 to-orange-600 flex items-center justify-center">
            <Play className="w-16 h-16 text-white/70" />
          </div>
        </div>

      {/* Overlay supérieur */}
      <div className="absolute top-0 left-0 right-0 z-10 p-3 flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium text-sm">{story.location}</span>
        </div>
        <Badge variant="secondary" className="bg-black/50 text-white border-none text-xs px-2 py-1">
          LIVE {story.liveViewers}
        </Badge>
      </div>

      {/* Boutons d'interaction droite */}
      <div className="absolute right-3 bottom-[140px] z-10 flex flex-col space-y-4">
        <div className="flex flex-col items-center space-y-1">
          <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white">
            <Heart className="w-5 h-5" />
          </Button>
          <span className="text-white text-xs font-medium">{story.likes}</span>
        </div>
        
        <div className="flex flex-col items-center space-y-1">
          <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white">
            <MessageCircle className="w-5 h-5" />
          </Button>
          <span className="text-white text-xs font-medium">{story.comments}</span>
        </div>
        
        <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white">
          <Share className="w-5 h-5" />
        </Button>
        
        <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Informations utilisateur et description */}
      <div className="absolute bottom-[100px] left-3 right-16 z-10 text-white">
        <div className="space-y-1">
          <h3 className="text-base font-bold">@{story.user.username}</h3>
          <p className="text-sm opacity-90 line-clamp-2">{story.description}</p>
          <p className="text-sm text-blue-300">{story.hashtag}</p>
        </div>
      </div>

      {/* Commentaire affiché */}
      <div className="absolute bottom-[80px] left-3 right-3 z-10">
        <div className="bg-black/30 rounded-full px-3 py-1.5 flex items-center space-x-2">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-2.5 h-2.5 text-black" />
          </div>
          <span className="text-white text-xs truncate">{story.lastComment}</span>
        </div>
      </div>

      {/* Miniatures en bas */}
      <div className="absolute bottom-2 left-3 right-3 z-10">
        <div className="flex space-x-1.5 overflow-x-auto pb-1">
          {relatedVideos.map((video) => (
            <div key={video.id} className="flex-shrink-0">
              <div className="w-12 h-16 bg-gray-700 rounded-md overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton de création flottant */}
      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 z-10">
        <Button
          onClick={() => setShowCreateModal(true)}
          size="icon"
          className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

        {/* Modal de création (simplifié pour le moment) */}
        {showCreateModal && (
          <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-bold mb-4">Créer une Story</h2>
              <div className="space-y-3">
                <Button className="w-full text-sm" variant="outline">
                  📷 Prendre une photo
                </Button>
                <Button className="w-full text-sm" variant="outline">
                  🎥 Enregistrer une vidéo
                </Button>
                <Button className="w-full text-sm" variant="outline">
                  📁 Choisir depuis la galerie
                </Button>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
      <SideMenu open={sideMenuOpen} onOpenChange={setSideMenuOpen} />
    </div>
  );
};

export default Story;