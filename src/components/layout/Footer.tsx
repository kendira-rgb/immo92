import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display text-xl font-semibold">Immo92</span>
            </div>
            <p className="text-primary-foreground/70 max-w-md">
             Location longue durée en France ou vacances en Espagne. 
              Trouvez votre maison avec un bail sécurisé et un état des lieux professionnel.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/properties" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Nos biens
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-foreground/70 hover:text-primary transition-colors">
                  Politique RGPD
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="h-4 w-4 text-primary" />
                contact@immo92.com
                contact@maisonlongue.com
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="h-4 w-4 text-primary" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <span>Paris, France<br />Barcelone, Espagne</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Immo92. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link to="/legal" className="text-primary-foreground/50 hover:text-primary text-sm transition-colors">
              Mentions légales
            </Link>
            <Link to="/privacy" className="text-primary-foreground/50 hover:text-primary text-sm transition-colors">
              RGPD
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
