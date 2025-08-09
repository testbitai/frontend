import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Link2, Check } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export const UrlStateIndicator = () => {
  const [searchParams] = useSearchParams();
  const [showSaved, setShowSaved] = useState(false);
  const [hasFilters, setHasFilters] = useState(false);

  useEffect(() => {
    const params = Array.from(searchParams.entries());
    const activeFilters = params.filter(([key, value]) => 
      value && value !== 'all' && value !== '1' && value !== '12' && value !== 'createdAt' && value !== 'desc'
    );
    
    setHasFilters(activeFilters.length > 0);

    if (activeFilters.length > 0) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!hasFilters) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      {showSaved ? (
        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
          <Check className="w-3 h-3 mr-1" />
          Filters saved to URL
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-xs">
          <Link2 className="w-3 h-3 mr-1" />
          Filters in URL
        </Badge>
      )}
    </div>
  );
};
