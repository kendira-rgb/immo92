import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card rounded-xl shadow-elevated border border-border p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold mb-2">
                Nous utilisons des cookies 🍪
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
                Vous pouvez accepter tous les cookies ou seulement les cookies essentiels.{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  En savoir plus
                </Link>
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={acceptAll} className="bg-primary hover:bg-primary/90">
                  Tout accepter
                </Button>
                <Button onClick={acceptEssential} variant="outline">
                  Essentiels uniquement
                </Button>
              </div>
            </div>
            <button 
              onClick={acceptEssential}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
