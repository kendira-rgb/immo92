import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, CheckCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Nom trop court").max(50),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message trop court").max(1000),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  propertyId?: string;
  propertyTitle?: string;
}

export function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: propertyTitle ? `Je suis intéressé par le bien: ${propertyTitle}\n\n` : "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    const { error } = await supabase.from("contact_requests").insert({
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      message: values.message,
      property_id: propertyId || null,
      property_title: propertyTitle || null,
      is_read: false,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Erreur", {
        description: "Impossible d'envoyer votre message. Veuillez réessayer.",
      });
    } else {
      setIsSubmitted(true);
      toast.success("Message envoyé !", {
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Message envoyé !</h3>
          <p className="text-muted-foreground text-sm">
            Merci pour votre intérêt. Nous vous répondrons rapidement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacter l'annonceur</CardTitle>
        <CardDescription>
          Remplissez ce formulaire pour obtenir plus d'informations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet *</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jean@exemple.fr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Votre message ici..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                "Envoi en cours..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
