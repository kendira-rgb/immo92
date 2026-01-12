import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useProperty } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Bed, Bath, Square, Euro, ArrowLeft, 
  Check, FileText, ClipboardCheck, Loader2 
} from 'lucide-react';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useProperty(id!);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Bien non trouvé</h1>
          <p className="text-muted-foreground mb-6">Ce bien n'existe pas ou a été supprimé.</p>
          <Button asChild>
            <Link to="/properties">Retour aux biens</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const countryLabel = property.country === 'france' ? 'France' : 'Espagne';
  const images = property.images || ['/placeholder.svg'];

  return (
    <Layout>
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Button asChild variant="ghost" className="gap-2">
          <Link to="/properties">
            <ArrowLeft className="h-4 w-4" />
            Retour aux biens
          </Link>
        </Button>
      </div>

      {/* Images Gallery */}
      <section className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-[4/3] rounded-xl overflow-hidden">
            <img 
              src={images[0]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden">
                  <img 
                    src={img} 
                    alt={`${property.title} - ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {property.is_featured && (
                <Badge className="bg-primary text-primary-foreground">En vedette</Badge>
              )}
              {!property.is_available && (
                <Badge variant="secondary">Loué</Badge>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-lg">{property.city}, {countryLabel}</span>
              {property.address && (
                <span className="text-sm">• {property.address}</span>
              )}
            </div>

            <div className="flex items-center gap-6 p-4 bg-muted rounded-xl mb-8">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-primary" />
                <span className="font-medium">{property.bedrooms} chambre{property.bedrooms > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-primary" />
                <span className="font-medium">{property.bathrooms} sdb</span>
              </div>
              {property.surface_area && (
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-primary" />
                  <span className="font-medium">{property.surface_area} m²</span>
                </div>
              )}
            </div>

            {property.description && (
              <div className="mb-8">
                <h2 className="font-display text-2xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {property.features && property.features.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-2xl font-semibold mb-4">Équipements</h2>
                <div className="grid grid-cols-2 gap-3">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included Services */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4">Services inclus</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 bg-muted rounded-xl">
                  <FileText className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Contrat de bail</h3>
                    <p className="text-sm text-muted-foreground">
                      Un contrat complet conforme à la législation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-muted rounded-xl">
                  <ClipboardCheck className="h-6 w-6 text-secondary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">État des lieux</h3>
                    <p className="text-sm text-muted-foreground">
                      État des lieux d'entrée et de sortie détaillé
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl shadow-card p-6 border border-border">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {property.price_per_month.toLocaleString('fr-FR')}
                </span>
                <Euro className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">/mois</span>
              </div>

              {property.is_available ? (
                <>
                  <Button asChild className="w-full mb-3 bg-primary hover:bg-primary/90">
                    <Link to={`/contact?property=${property.id}`}>
                      Demander une visite
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/contact?property=${property.id}`}>
                      Poser une question
                    </Link>
                  </Button>
                </>
              ) : (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="font-medium text-muted-foreground">
                    Ce bien n'est plus disponible
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Location longue durée uniquement.<br/>
                  Durée minimale : 12 mois
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
