import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères')
});

export default function Contact() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('property');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: propertyId ? `Je suis intéressé(e) par ce bien et souhaiterais organiser une visite.` : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = contactSchema.parse(formData);
      setIsSubmitting(true);

      const { error } = await supabase.from('contact_requests').insert({
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        message: validated.message,
        property_id: propertyId || null
      });

      if (error) throw error;

      toast({
        title: 'Message envoyé !',
        description: 'Nous vous répondrons dans les plus brefs délais.',
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue. Veuillez réessayer.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-muted-foreground">
              Une question ? Un projet de location ? Notre équipe est à votre écoute.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-6">
                Envoyez-nous un message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean@exemple.com"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet ou posez-nous vos questions..."
                    rows={6}
                    className={errors.message ? 'border-destructive' : ''}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Envoyer le message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-6">
                Nos coordonnées
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-muted rounded-xl">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">contact@maisonlongue.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-muted rounded-xl">
                  <div className="p-3 rounded-full bg-secondary/10">
                    <Phone className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Téléphone</h3>
                    <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Du lundi au vendredi, 9h - 18h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-muted rounded-xl">
                  <div className="p-3 rounded-full bg-olive/10">
                    <MapPin className="h-6 w-6 text-olive" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Nos bureaux</h3>
                    <p className="text-muted-foreground">Paris, France</p>
                    <p className="text-muted-foreground">Barcelone, Espagne</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
                <h3 className="font-display text-lg font-semibold mb-2">
                  Réponse rapide garantie
                </h3>
                <p className="text-muted-foreground text-sm">
                  Notre équipe s'engage à vous répondre sous 24h ouvrées maximum. 
                  Pour les demandes urgentes, n'hésitez pas à nous appeler directement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
