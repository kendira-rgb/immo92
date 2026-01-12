import { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { useProperties, useDeleteProperty } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Pencil, Trash2, MapPin, Euro, 
  Loader2, Building2, Eye 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PropertyFormDialog } from '@/components/admin/PropertyFormDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminProperties() {
  const { data: properties, isLoading } = useProperties();
  const deleteProperty = useDeleteProperty();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingProperty(id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    
    try {
      await deleteProperty.mutateAsync(deleteConfirmId);
      toast({ title: 'Propriété supprimée' });
    } catch {
      toast({ 
        title: 'Erreur', 
        description: 'Impossible de supprimer cette propriété',
        variant: 'destructive' 
      });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProperty(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Propriétés</h1>
            <p className="text-muted-foreground">Gérez vos biens immobiliers</p>
          </div>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle propriété
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-semibold">Propriété</th>
                    <th className="text-left p-4 font-semibold">Localisation</th>
                    <th className="text-left p-4 font-semibold">Prix/mois</th>
                    <th className="text-left p-4 font-semibold">Statut</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
                            {property.images?.[0] ? (
                              <img 
                                src={property.images[0]} 
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">{property.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {property.bedrooms} ch · {property.bathrooms} sdb
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {property.city}, {property.country === 'france' ? 'France' : 'Espagne'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-medium">
                          {property.price_per_month.toLocaleString('fr-FR')}
                          <Euro className="h-4 w-4" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {property.is_available ? (
                            <Badge className="bg-olive/10 text-olive">Disponible</Badge>
                          ) : (
                            <Badge variant="secondary">Loué</Badge>
                          )}
                          {property.is_featured && (
                            <Badge className="bg-primary/10 text-primary">Vedette</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            asChild
                          >
                            <Link to={`/properties/${property.id}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(property.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setDeleteConfirmId(property.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-soft border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Aucune propriété</h3>
            <p className="text-muted-foreground mb-6">
              Commencez par ajouter votre première propriété
            </p>
            <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une propriété
            </Button>
          </div>
        )}
      </div>

      <PropertyFormDialog 
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        propertyId={editingProperty}
      />

      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
