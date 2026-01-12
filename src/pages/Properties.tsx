import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PropertyCard } from '@/components/PropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Loader2, Home } from 'lucide-react';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const countryFilter = searchParams.get('country') || undefined;
  
  const { data: properties, isLoading, error } = useProperties({ country: countryFilter });

  const handleFilterChange = (country: string | undefined) => {
    if (country) {
      setSearchParams({ country });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Nos biens à louer
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez notre sélection de maisons disponibles en location longue durée en France et en Espagne.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={!countryFilter ? 'default' : 'outline'}
              onClick={() => handleFilterChange(undefined)}
              className={!countryFilter ? 'bg-primary' : ''}
            >
              Tous les pays
            </Button>
            <Button 
              variant={countryFilter === 'france' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('france')}
              className={countryFilter === 'france' ? 'bg-primary' : ''}
            >
              🇫🇷 France
            </Button>
            <Button 
              variant={countryFilter === 'spain' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('spain')}
              className={countryFilter === 'spain' ? 'bg-primary' : ''}
            >
              🇪🇸 Espagne
            </Button>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">Une erreur est survenue lors du chargement des biens.</p>
            </div>
          ) : properties && properties.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-8">
                {properties.length} bien{properties.length > 1 ? 's' : ''} trouvé{properties.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Home className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">Aucun bien disponible</h3>
              <p className="text-muted-foreground mb-6">
                Aucun bien ne correspond à vos critères pour le moment.
              </p>
              <Button onClick={() => handleFilterChange(undefined)} variant="outline">
                Voir tous les biens
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
