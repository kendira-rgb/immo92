import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactForm } from "@/components/ContactForm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  MapPin,
  Euro,
  Maximize2,
  Bed,
  Bath,
  Calendar,
  Heart,
  Share2,
  CheckCircle,
  Wifi,
  ParkingCircle,
  Thermometer,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Bien non trouvé</h1>
        <Button onClick={() => navigate("/properties")}>
          Retour aux annonces
        </Button>
      </div>
    );
  }

  const features = [
    { icon: Wifi, label: "Fibre optique", available: true },
    { icon: ParkingCircle, label: "Parking", available: property.features?.includes("parking") },
    { icon: Thermometer, label: "Chauffage individuel", available: true },
    { icon: Shield, label: "Sécurité", available: property.features?.includes("securite") },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Bouton retour */}
        <Button
          variant="ghost"
          onClick={() => navigate("/properties")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux annonces
        </Button>

        {/* Galerie d'images */}
        <div className="relative mb-8">
          <Carousel className="w-full">
            <CarouselContent>
              {(property.images && property.images.length > 0 ? property.images : ["/placeholder.jpg"]).map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                    <img
                      src={image}
                      alt={`${property.title} - image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {property.is_featured && (
              <Badge className="bg-yellow-500">À la une</Badge>
            )}
            <Badge variant={property.is_available ? "default" : "secondary"}>
              {property.is_available ? "Disponible" : "Indisponible"}
            </Badge>
          </div>

          {/* Boutons d'action */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/90 hover:bg-white"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/90 hover:bg-white"
              onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Colonne gauche */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.city}, {property.country}</span>
              </div>
            </div>

            {/* Prix */}
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">
                {property.price_per_month.toLocaleString('fr-FR')} €
              </div>
              <p className="text-muted-foreground">par mois</p>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <Maximize2 className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="font-semibold">{property.surface_area || 'N/A'} m²</div>
                <div className="text-xs text-muted-foreground">Surface</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Bed className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="font-semibold">{property.bedrooms}</div>
                <div className="text-xs text-muted-foreground">Chambres</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Bath className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="font-semibold">{property.bathrooms}</div>
                <div className="text-xs text-muted-foreground">Salles de bain</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="font-semibold">
                  {new Date(property.created_at).toLocaleDateString('fr-FR')}
                </div>
                <div className="text-xs text-muted-foreground">Mis en ligne</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description || "Aucune description disponible."}
              </p>
            </div>

            {/* Équipements */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Équipements et services</h2>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {feature.available ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5" />
                    )}
                    <span className={feature.available ? "" : "text-muted-foreground"}>
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs pour plus d'infos */}
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="neighborhood">Quartier</TabsTrigger>
                <TabsTrigger value="legal">Informations légales</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-2 pt-4">
                <p><strong>Référence:</strong> {property.id}</p>
                <p><strong>Année de construction:</strong> Non spécifiée</p>
                <p><strong>Étages:</strong> Non spécifié</p>
              </TabsContent>
              <TabsContent value="neighborhood" className="pt-4">
                <p>Quartier {property.city} - Proche des commodités, transports en commun et écoles.</p>
              </TabsContent>
              <TabsContent value="legal" className="pt-4">
                <p>Diagnostic de performance énergétique (DPE): Non disponible</p>
                <p>Montant des honoraires: À la charge du locataire</p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Colonne droite - Formulaire de contact */}
          <div>
            <div className="sticky top-24">
              <ContactForm propertyId={property.id} propertyTitle={property.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
