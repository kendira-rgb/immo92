import { AdminLayout } from './AdminLayout';
import { useProperties } from '@/hooks/useProperties';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Building2, MessageSquare, Euro, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: properties } = useProperties();
  
  const { data: messages } = useQuery({
    queryKey: ['contact-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const totalProperties = properties?.length || 0;
  const availableProperties = properties?.filter(p => p.is_available).length || 0;
  const totalMessages = messages?.length || 0;
  const unreadMessages = messages?.filter(m => !m.is_read).length || 0;

  const stats = [
    {
      label: 'Propriétés totales',
      value: totalProperties,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      link: '/admin/properties'
    },
    {
      label: 'Disponibles',
      value: availableProperties,
      icon: TrendingUp,
      color: 'text-olive',
      bgColor: 'bg-olive/10',
      link: '/admin/properties'
    },
    {
      label: 'Messages reçus',
      value: totalMessages,
      icon: MessageSquare,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      link: '/admin/messages'
    },
    {
      label: 'Non lus',
      value: unreadMessages,
      icon: MessageSquare,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      link: '/admin/messages'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue dans votre espace d'administration</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-card rounded-xl p-6 shadow-soft border border-border hover:shadow-card transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Messages */}
        <div className="bg-card rounded-xl shadow-soft border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Messages récents</h2>
              <Link 
                to="/admin/messages" 
                className="text-primary hover:underline text-sm font-medium"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="p-6">
            {messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.slice(0, 5).map((message) => (
                  <div 
                    key={message.id}
                    className={`p-4 rounded-lg ${message.is_read ? 'bg-muted' : 'bg-primary/5 border border-primary/20'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{message.name}</span>
                          {!message.is_read && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.message}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(message.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Aucun message pour le moment
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
