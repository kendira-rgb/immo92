import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Euro, Home, Maximize2 } from "lucide-react";
import { useState } from "react";

interface PropertyCardProps {
  id: string;
  title: string;
  price_per_month: number;
  city: string;
  surface_area: number | null;
  bedrooms: number;
  bathrooms: number;
  images: string[] | null;
  is_available: boolean;
  is_featured: boolean;
}

export function PropertyCard({ 
  id,
  title, 
  price_per_month, 
  city, 
  surface_area, 
  bedrooms,
  bathrooms,
  images,
  is_available,
  is_featured
}: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const imageUrl = images && images.length > 0 ? images[0] : "/placeholder-property.jpg";

  return (
   // Pas d'import motion
<div className="animate-fade-up hover:-translate-y-1 transition-transform duration-300">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
        {is_featured && (
          <Badge className="absolute top-3 left-3 z-10 bg-yellow-500 hover:bg-yellow-600">
            À la une
          </Badge>
        )}
        
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Prix */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-primary text-white text-lg px-3 py-1">
              {price_per_month.toLocaleString('fr-FR')} €/mois
            </Badge>
          </div>
          
          {/* Bouton like */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          
          {/* Localisation */}
          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{city}</span>
          </div>
          
          {/* Caractéristiques */}
          <div className="flex justify-between text-sm border-t pt-3 mb-3">
            {surface_area && (
              <div className="flex items-center gap-1">
                <Maximize2 className="h-4 w-4 text-muted-foreground" />
                <span>{surface_area} m²</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span>{bedrooms} ch.</span>
            </div>
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span>{bathrooms} sdb</span>
            </div>
          </div>
          
          <Button className="w-full" disabled={!is_available}>
            {is_available ? "Voir le détail" : "Indisponible"}
          </Button>
        </CardContent>
      </Card>
  );
}
