import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  Euro,
  Home,
  Calendar,
  Loader2
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Composant principal
export default function Dashboard() {
  // Récupération des statistiques
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Total des biens
      const { count: totalProps } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      // Biens disponibles
      const { count: availableProps } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('is_available', true);

      // Messages non lus
      const { count: unreadMsgs } = await supabase
        .from('contact_requests')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      // Total messages
      const { count: totalMsgs } = await supabase
        .from('contact_requests')
        .select('*', { count: 'exact', head: true });

      // Loyer moyen
      const { data: properties } = await supabase
        .from('properties')
        .select('price_per_month');
      
      const avgRent = properties && properties.length > 0
        ? properties.reduce((acc, p) => acc + p.price_per_month, 0) / properties.length
        : 0;

      return {
        totalProperties: totalProps || 0,
        availableProperties: availableProps || 0,
        totalMessages: totalMsgs || 0,
        unreadMessages: unreadMsgs || 0,
        averageRent: Math.round(avgRent),
        totalViews: 12580, // À intégrer plus tard avec analytics
        viewsChange: 12.5
      };
    }
  });

  // Récupération des biens récents
  const { data: recentProperties, isLoading: propsLoading } = useQuery({
    queryKey: ['recent-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, price_per_month, is_available, city, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  // Données pour les graphiques
  const viewsData = [
    { name: 'Lun', vues: 120 },
    { name: 'Mar', vues: 145 },
    { name: 'Mer', vues: 98 },
    { name: 'Jeu', vues: 167 },
    { name: 'Ven', vues: 189 },
    { name: 'Sam', vues: 210 },
    { name: 'Dim', vues: 156 },
  ];

  // Répartition par ville
  const { data: propertiesByCity } = useQuery({
    queryKey: ['properties-by-city'],
    queryFn: async () => {
      const { data } = await supabase
        .from('properties')
        .select('city');
      
      if (!data) return [];
      
      const cityCount = data.reduce((acc: Record<string, number>, prop) => {
        acc[prop.city] = (acc[prop.city] || 0) + 1;
        return acc;
      }, {});
      
      return Object.entries(cityCount)
        .map(([name, value]) => ({ name, value }))
        .slice(0, 5);
    }
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  if (statsLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre activité immobilière
          </p>
        </div>
        <Button size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Ce mois
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biens immobiliers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.availableProperties} disponibles
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+3 vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.unreadMessages} non lus
            </p>
            {stats?.unreadMessages && stats.unreadMessages > 0 && (
              <Badge variant="destructive" className="mt-2">
                {stats.unreadMessages} à traiter
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyer moyen</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageRent.toLocaleString('fr-FR')} €
            </div>
            <p className="text-xs text-muted-foreground">
              par mois
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                +{stats?.viewsChange}%
              </span>
              <span className="text-muted-foreground">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vues quotidiennes</CardTitle>
            <CardDescription>Évolution des visites cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="vues" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par ville</CardTitle>
            <CardDescription>Nombre de biens par localisation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertiesByCity || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(propertiesByCity || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Derniers biens ajoutés</CardTitle>
          <CardDescription>Les 5 biens les plus récents</CardDescription>
        </CardHeader>
        <CardContent>
          {propsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {recentProperties?.map((property) => (
                <div key={property.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Home className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {property.city} • {new Date(property.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        {property.price_per_month.toLocaleString('fr-FR')} €/mois
                      </p>
                      <Badge variant={property.is_available ? 'default' : 'secondary'}>
                        {property.is_available ? 'Disponible' : 'Indisponible'}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
