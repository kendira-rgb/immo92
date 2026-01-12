import { AdminLayout } from './AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, MailOpen, Trash2, Loader2, MessageSquare, 
  ExternalLink, Phone 
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AdminMessages() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['contact-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*, properties(title)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_requests')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-requests'] });
    }
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_requests')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-requests'] });
      toast({ title: 'Message supprimé' });
    }
  });

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteMessage.mutateAsync(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Gérez les demandes de contact reçues
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`bg-card rounded-xl shadow-soft border overflow-hidden transition-all
                  ${message.is_read ? 'border-border' : 'border-primary/30 bg-primary/5'}
                `}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${message.is_read ? 'bg-muted' : 'bg-primary/10'}`}>
                        {message.is_read ? (
                          <MailOpen className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Mail className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{message.name}</span>
                          {!message.is_read && (
                            <Badge className="bg-primary text-primary-foreground">Nouveau</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(message.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {message.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Phone className="h-4 w-4" />
                      {message.phone}
                    </div>
                  )}

                  {message.property_id && message.properties && (
                    <div className="mb-4">
                      <Link 
                        to={`/properties/${message.property_id}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <span>Concernant : {(message.properties as { title: string }).title}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg mb-4">
                    <p className="whitespace-pre-line">{message.message}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {!message.is_read && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsRead.mutate(message.id)}
                      >
                        <MailOpen className="h-4 w-4 mr-2" />
                        Marquer comme lu
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={`mailto:${message.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Répondre
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(message.id)}
                      className="text-destructive hover:text-destructive ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-soft border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Aucun message</h3>
            <p className="text-muted-foreground">
              Vous n'avez pas encore reçu de demande de contact
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
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
