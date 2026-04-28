import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filters } from "@/pages/Properties";
import { X } from "lucide-react";

interface PropertyFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  cities: string[];
  inline?: boolean;
  onClose?: () => void;
}

export function PropertyFilters({ filters, setFilters, cities, inline, onClose }: PropertyFiltersProps) {
  return (
    <div className={inline ? "flex flex-wrap gap-4 items-end" : "space-y-4"}>
      {/* Ville */}
      <div className={inline ? "w-[180px]" : "space-y-2"}>
        <Label>Ville</Label>
        <Select value={filters.city} onValueChange={(v) => setFilters({ ...filters, city: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes les villes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les villes</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prix */}
      <div className={inline ? "w-[200px]" : "space-y-2"}>
        <Label>Prix max (€/mois)</Label>
        <Input
          type="number"
          value={filters.maxPrice || ""}
          onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) || 5000 })}
          placeholder="5000"
        />
      </div>

      {/* Surface */}
      <div className={inline ? "w-[180px]" : "space-y-2"}>
        <Label>Surface max (m²)</Label>
        <Input
          type="number"
          value={filters.maxSurface || ""}
          onChange={(e) => setFilters({ ...filters, maxSurface: parseInt(e.target.value) || 200 })}
          placeholder="200"
        />
      </div>

      {/* Chambres */}
      <div className={inline ? "w-[140px]" : "space-y-2"}>
        <Label>Chambres</Label>
        <Select value={String(filters.bedrooms)} onValueChange={(v) => setFilters({ ...filters, bedrooms: parseInt(v) })}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Toutes</SelectItem>
            <SelectItem value="1">1+ ch.</SelectItem>
            <SelectItem value="2">2+ ch.</SelectItem>
            <SelectItem value="3">3+ ch.</SelectItem>
            <SelectItem value="4">4+ ch.</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Slider prix (version desktop détaillée) */}
      {!inline && (
        <div className="space-y-2">
          <Label>Plage de prix: {filters.minPrice}€ - {filters.maxPrice}€</Label>
          <Slider
            min={0}
            max={5000}
            step={100}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => setFilters({ ...filters, minPrice: min, maxPrice: max })}
          />
        </div>
      )}

      {/* Slider surface (version desktop détaillée) */}
      {!inline && (
        <div className="space-y-2">
          <Label>Plage de surface: {filters.minSurface}m² - {filters.maxSurface}m²</Label>
          <Slider
            min={0}
            max={200}
            step={10}
            value={[filters.minSurface, filters.maxSurface]}
            onValueChange={([min, max]) => setFilters({ ...filters, minSurface: min, maxSurface: max })}
          />
        </div>
      )}

      {/* Bouton reset (version mobile) */}
      {!inline && onClose && (
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setFilters({
                search: "",
                city: "",
                minPrice: 0,
                maxPrice: 5000,
                minSurface: 0,
                maxSurface: 200,
                bedrooms: 0,
                sortBy: "newest",
              });
            }}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={onClose} className="flex-1">
            Appliquer
          </Button>
        </div>
      )}
    </div>
  );
}
