import { useState, useEffect } from 'react';
import { useProperty, useCreateProperty, useUpdateProperty } from '@/hooks/useProperties';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId?: string | null;
}

type Country = 'france' | 'spain';

export function PropertyFormDialog({ open, onOpenChange, propertyId }: PropertyFormDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: existingProperty, isLoading: loadingProperty } = useProperty(propertyId || '');
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    country: 'france' as Country,
    city: '',
    address: '',
    price_per_month: '',
    bedrooms: '1',
    bathrooms: '1',
    surface_area: '',
    features: [] as string[],
    images: [] as string[],
    is_available: true,
    is_featured: false
  });

  const [newFeature, setNewFeature] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingProperty && propertyId) {
      setFormData({
        title: existingProperty.title,
        description: existingProperty.description || '',
        country: existingProperty.country as Country,
        city: existingProperty.city,
        address: existingProperty.address || '',
        price_per_month: existingProperty.price_per_month.toString(),
        bedrooms: existingProperty.bedrooms.toString(),
        bathrooms: existingProperty.bathrooms.toString(),
        surface_area: existingProperty.surface_area?.toString() || '',
        features: existingProperty.features || [],
        images: existingProperty.images || [],
        is_available: existingProperty.is_available,
        is_featured: existingProperty.is_featured || false
      });
    } else if (!propertyId) {
      setFormData({
        title: '',
        description: '',
        country: 'france',
        city: '',
        address: '',
        price_per_month: '',
        bedrooms: '1',
        bathrooms: '1',
        surface_area: '',
        features: [],
        images: [],
        is_available: true,
        is_featured: false
      });
    }
  }, [existingProperty, propertyId, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-media')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch {
      toast({
        title: 'Erreur',
        description: "Impossible d'uploader les images",
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description || null,
        country: formData.country,
        city: formData.city,
        address: formData.address || null,
        price_per_month: parseFloat(formData.price_per_month),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        surface_area: formData.surface_area ? parseFloat(formData.surface_area) : null,
        features: formData.features.length > 0 ? formData.features : null,
        images: formData.images.length > 0 ? formData.images : null,
        is_available: formData.is_available,
        is_featured: formData.is_featured,
        created_by: user?.id
      };

      if (propertyId) {
        await updateProperty.mutateAsync({ id: propertyId, ...propertyData });
        toast({ title: 'Propriété mise à jour' });
      } else {
        await createProperty.mutateAsync(propertyData);
        toast({ title: 'Propriété créée' });
      }

      onOpenChange(false);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la propriété',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {propertyId ? 'Modifier la propriété' : 'Nouvelle propriété'}
          </DialogTitle>
        </DialogHeader>

        {loadingProperty && propertyId ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Belle maison avec vue mer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez la propriété..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Pays *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value: Country) => setFormData(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="france">🇫🇷 France</SelectItem>
                      <SelectItem value="spain">🇪🇸 Espagne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Paris"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="12 rue de la Paix"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix/mois (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price_per_month}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_per_month: e.target.value }))}
                    placeholder="1500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Chambres *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="1"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Salles de bain *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surface">Surface (m²)</Label>
                  <Input
                    id="surface"
                    type="number"
                    value={formData.surface_area}
                    onChange={(e) => setFormData(prev => ({ ...prev, surface_area: e.target.value }))}
                    placeholder="120"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label>Équipements</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Piscine, Jardin, Parking..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Photos</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    {uploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    )}
                    <span className="text-muted-foreground">
                      {uploading ? 'Upload en cours...' : 'Cliquez pour ajouter des photos'}
                    </span>
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-foreground/80 rounded-full text-background hover:bg-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="available">Disponible</Label>
                    <p className="text-sm text-muted-foreground">Ce bien est disponible à la location</p>
                  </div>
                  <Switch
                    id="available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured">En vedette</Label>
                    <p className="text-sm text-muted-foreground">Afficher sur la page d'accueil</p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {propertyId ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
