import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters } from "@/components/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export interface Filters {
  search: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  minSurface: number;
  maxSurface: number;
  bedrooms: number;
  sortBy: "price_asc" | "price_desc" | "newest";
}

const ITEMS_PER_PAGE = 12;

export default function Properties() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    city: "",
    minPrice: 0,
    maxPrice: 5000,
    minSurface: 0,
    maxSurface: 200,
    bedrooms: 0,
    sortBy: "newest",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Récupérer la liste unique des villes pour le filtre
  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data } = await supabase
        .from("properties")
        .select("city")
        .eq("is_available", true);
      
      const uniqueCities = [...new Set(data?.map(p => p.city))];
      return uniqueCities.sort();
    },
  });

  // Récupérer les biens avec filtres
  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ["properties", filters, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*", { count: "exact" })
        .eq("is_available", true);

      // Filtres
      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }
      if (filters.city) {
        query = query.eq("city", filters.city);
      }
      if (filters.minPrice > 0) {
        query = query.gte("price_per_month", filters.minPrice);
      }
      if (filters.maxPrice < 5000) {
        query = query.lte("price_per_month", filters.maxPrice);
      }
      if (filters.minSurface > 0) {
        query = query.gte("surface_area", filters.minSurface);
      }
      if (filters.maxSurface < 200) {
        query = query.lte("surface_area", filters.maxSurface);
      }
      if (filters.bedrooms > 0) {
        query = query.gte("bedrooms", filters.bedrooms);
      }

      // Tri
      switch (filters.sortBy) {
        case "price_asc":
          query = query.order("price_per_month", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price_per_month", { ascending: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
      }

      // Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;
      return { properties: data, totalCount: count || 0 };
    },
  });

  const totalPages = Math.ceil((propertiesData?.totalCount || 0) / ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleResetFilters = () => {
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
  };

  const hasActiveFilters = filters.search || filters.city || filters.minPrice > 0 || 
    filters.maxPrice < 5000 || filters.minSurface > 0 || filters.maxSurface < 200 || 
    filters.bedrooms > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nos biens immobiliers</h1>
        <p className="text-muted-foreground">
          Découvrez notre sélection d'appartements et maisons à louer
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un bien..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          
          {/* Filtres desktop */}
          <div className="hidden md:flex gap-2">
            <Select value={filters.sortBy} onValueChange={(v) => setFilters({ ...filters, sortBy: v as any })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="price_asc">Prix croissant</SelectItem>
                <SelectItem value="price_desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Button variant="ghost" onClick={handleResetFilters}>
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Filtres mobile */}
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <PropertyFilters
                filters={filters}
                setFilters={setFilters}
                cities={cities || []}
                onClose={() => setIsFiltersOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Filtres desktop inline */}
        <div className="hidden md:block">
          <PropertyFilters
            filters={filters}
            setFilters={setFilters}
            cities={cities || []}
            inline
          />
        </div>
      </div>

      {/* Résultats */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : propertiesData?.properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun bien ne correspond à vos critères.</p>
          <Button variant="link" onClick={handleResetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {propertiesData?.totalCount} bien{propertiesData?.totalCount !== 1 ? 's' : ''} trouvé{propertiesData?.totalCount !== 1 ? 's' : ''}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {propertiesData?.properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
