import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Video, Upload, X } from 'lucide-react';
import { useStories } from '@/hooks/useStories';
import { toast } from 'sonner';

interface CreateStoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ open, onOpenChange }) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { createStory } = useStories();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaFile) {
      toast.error('Veuillez ajouter du contenu ou un média');
      return;
    }

    try {
      setLoading(true);
      
      let mediaUrl = '';
      let mediaType: 'image' | 'video' | undefined;

      // Simuler l'upload du fichier (ici vous pourriez uploader vers Supabase Storage)
      if (mediaFile) {
        // Dans un vrai projet, vous uploaderiez le fichier vers Supabase Storage
        mediaUrl = mediaPreview || '';
        mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
      }

      await createStory({
        content: content.trim() || undefined,
        media_url: mediaUrl || undefined,
        media_type: mediaType,
        location: location.trim() || undefined,
        duration: 86400, // 24h par défaut
      });

      toast.success('Story créée avec succès!');
      
      // Reset form
      setContent('');
      setLocation('');
      setMediaFile(null);
      setMediaPreview(null);
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la création de la story');
    } finally {
      setLoading(false);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une Story</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Prévisualisation du média */}
          {mediaPreview && (
            <div className="relative">
              {mediaFile?.type.startsWith('video/') ? (
                <video 
                  src={mediaPreview} 
                  className="w-full h-40 object-cover rounded-lg"
                  controls
                />
              ) : (
                <img 
                  src={mediaPreview} 
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 w-6 h-6"
                onClick={removeMedia}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Upload de média */}
          {!mediaPreview && (
            <div className="space-y-2">
              <Label>Ajouter un média</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => document.getElementById('media-input')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choisir un fichier
                </Button>
              </div>
              <input
                id="media-input"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Contenu texte */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu (optionnel)</Label>
            <Textarea
              id="content"
              placeholder="Écrivez quelque chose..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {content.length}/500
            </div>
          </div>

          {/* Localisation */}
          <div className="space-y-2">
            <Label htmlFor="location">Localisation (optionnel)</Label>
            <Input
              id="location"
              placeholder="Où êtes-vous ?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading || (!content.trim() && !mediaFile)}
            >
              {loading ? 'Création...' : 'Publier'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};