import React, { useState, useEffect } from 'react';
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
import { useStories } from '@/hooks/useStories';
import { useStoryComments } from '@/hooks/useStoryComments';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { toast } from 'sonner';

const Story = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { stories, loading, likeStory, unlikeStory, checkIfLiked, addStoryView } = useStories();
  
  const currentStory = stories[currentStoryIndex];
  const { comments } = useStoryComments(currentStory?.id || '');

  // Suivre les vues et les likes pour la story actuelle
  useEffect(() => {
    if (currentStory && user) {
      addStoryView(currentStory.id);
      checkIfLiked(currentStory.id).then(setIsLiked);
    }
  }, [currentStory?.id, user]);

  const handleLike = async () => {
    if (!currentStory || !user) {
      toast.error('Vous devez être connecté pour liker');
      return;
    }

    try {
      if (isLiked) {
        await unlikeStory(currentStory.id);
        setIsLiked(false);
        toast.success('Like retiré');
      } else {
        await likeStory(currentStory.id);
        setIsLiked(true);
        toast.success('Story likée');
      }
    } catch (error) {
      toast.error('Erreur lors du like');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Chargement des stories...</div>
      </div>
    );
  }

  if (!stories.length) {
    return (
      <div className="min-h-screen bg-gray-50">
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
        
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Aucune story disponible</h2>
            <p className="text-gray-600 mb-4">Soyez le premier à créer une story!</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Créer une story
            </Button>
          </div>
        </div>
        
        <BottomNavigation />
        <SideMenu open={sideMenuOpen} onOpenChange={setSideMenuOpen} />
      </div>
    );
  }

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
        {/* Média principal */}
        <div className="absolute inset-0">
          {currentStory?.media_url ? (
            currentStory.media_type === 'video' ? (
              <video 
                className="w-full h-full object-cover" 
                autoPlay 
                loop 
                muted
                src={currentStory.media_url}
              />
            ) : (
              <img 
                className="w-full h-full object-cover" 
                src={currentStory.media_url} 
                alt="Story content" 
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-800 to-orange-600 flex items-center justify-center">
              <Play className="w-16 h-16 text-white/70" />
            </div>
          )}
        </div>

        {/* Overlay supérieur */}
        <div className="absolute top-0 left-0 right-0 z-10 p-3 flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium text-sm">
              {currentStory?.location || 'En direct'}
            </span>
          </div>
          <Badge variant="secondary" className="bg-black/50 text-white border-none text-xs px-2 py-1">
            LIVE {formatNumber(currentStory?.views || 0)}
          </Badge>
        </div>

        {/* Boutons d'interaction droite */}
        <div className="absolute right-3 bottom-[140px] z-10 flex flex-col space-y-4">
          <div className="flex flex-col items-center space-y-1">
            <Button 
              size="icon" 
              variant="ghost" 
              className={`w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white ${isLiked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <span className="text-white text-xs font-medium">
              {formatNumber(currentStory?.likes || 0)}
            </span>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white">
              <MessageCircle className="w-5 h-5" />
            </Button>
            <span className="text-white text-xs font-medium">
              {formatNumber(currentStory?.comments || 0)}
            </span>
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
            <h3 className="text-base font-bold">
              @{currentStory?.profiles?.username || currentStory?.profiles?.display_name || 'Utilisateur'}
            </h3>
            <p className="text-sm opacity-90 line-clamp-2">
              {currentStory?.content || 'Nouvelle story'}
            </p>
          </div>
        </div>

        {/* Dernier commentaire affiché */}
        {comments.length > 0 && (
          <div className="absolute bottom-[80px] left-3 right-3 z-10">
            <div className="bg-black/30 rounded-full px-3 py-1.5 flex items-center space-x-2">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-2.5 h-2.5 text-black" />
              </div>
              <span className="text-white text-xs truncate">
                {comments[comments.length - 1]?.content}
              </span>
            </div>
          </div>
        )}

        {/* Miniatures des autres stories */}
        <div className="absolute bottom-2 left-3 right-3 z-10">
          <div className="flex space-x-1.5 overflow-x-auto pb-1">
            {stories.slice(0, 5).map((story, index) => (
              <div 
                key={story.id} 
                className={`flex-shrink-0 cursor-pointer ${index === currentStoryIndex ? 'ring-2 ring-white' : ''}`}
                onClick={() => setCurrentStoryIndex(index)}
              >
                <div className="w-12 h-16 bg-gray-700 rounded-md overflow-hidden">
                  {story.media_url ? (
                    <img 
                      src={story.media_url} 
                      alt="Story thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                  )}
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

      </div>

      <BottomNavigation />
      <SideMenu open={sideMenuOpen} onOpenChange={setSideMenuOpen} />
      <CreateStoryModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
};

export default Story;