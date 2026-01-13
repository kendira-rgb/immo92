import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/PropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { ArrowRight, FileText, ClipboardCheck, Shield, MapPin } from 'lucide-react';

export default function Index() {
  const { data: featuredProperties, isLoading } = useProperties({ featured: true });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="Maison méditerranéenne"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6">
              🏠 Location longue durée
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Trouvez votre <span className="text-primary">maison</span> en France et en Espagne
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Des locations longue durée avec contrat de bail sécurisé et état des lieux professionnel. 
              Vivez sereinement dans votre nouveau chez-vous.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                <Link to="/properties">
                  Découvrir nos biens
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une nouvelle approche de la location longue durée en France
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-soft hover:shadow-card transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Contrat de bail</h3>
              <p className="text-muted-foreground">
                Un contrat de bail complet et conforme à la législation en vigueur pour une location en toute sérénité.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-soft hover:shadow-card transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                <ClipboardCheck className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">État des lieux</h3>
              <p className="text-muted-foreground">
                Un état des lieux d'entrée et de sortie détaillé, réalisé par un professionnel pour protéger vos intérêts.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-soft hover:shadow-card transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-teal/10 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-teal" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Accompagnement</h3>
              <p className="text-muted-foreground">
                Un accompagnement personnalisé tout au long de votre location, de la visite à l'installation.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Properties */}
      {!isLoading && featuredProperties && featuredProperties.length > 0 && (
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Biens en vedette
                </h2>
                <p className="text-muted-foreground">
                  Notre sélection de propriétés exceptionnelles
                </p>
              </div>
              <Button asChild variant="ghost" className="hidden md:flex">
                <Link to="/properties">
                  Voir tous les biens
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.slice(0, 3).map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button asChild variant="outline">
                <Link to="/properties">
                  Voir tous les biens
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Prêt à trouver votre nouvelle maison ?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Contactez-nous dès aujourd'hui pour discuter de votre projet de location longue durée.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/contact">
              Nous contacter
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
