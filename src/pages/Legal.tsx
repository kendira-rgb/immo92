import { Layout } from '@/components/layout/Layout';

export default function Legal() {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl font-bold mb-8">Mentions légales</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">1. Éditeur du site</h2>
            <p className="text-muted-foreground mb-4">
              Le site MaisonLongue est édité par :<br/>
              <strong>MaisonLongue SAS</strong><br/>
              Société par actions simplifiée au capital de 10 000 €<br/>
              Siège social : Paris, France<br/>
              RCS Paris : XXX XXX XXX<br/>
              SIRET : XXX XXX XXX XXXXX<br/>
              Directeur de la publication : [Nom du directeur]
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">2. Hébergeur</h2>
            <p className="text-muted-foreground mb-4">
              Ce site est hébergé par :<br/>
              Lovable Technologies<br/>
              Adresse : [Adresse de l'hébergeur]
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">3. Propriété intellectuelle</h2>
            <p className="text-muted-foreground mb-4">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes) 
              est protégé par le droit d'auteur et les droits de propriété intellectuelle. 
              Toute reproduction, représentation, modification, publication, adaptation de tout 
              ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, 
              est interdite sans l'autorisation écrite préalable de MaisonLongue SAS.
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">4. Activité réglementée</h2>
            <p className="text-muted-foreground mb-4">
              MaisonLongue exerce une activité de gestion locative et d'intermédiation immobilière.<br/>
              Carte professionnelle : CPI XXXX XXX XXX délivrée par la CCI de Paris<br/>
              Garantie financière : [Nom du garant]<br/>
              Assurance responsabilité civile professionnelle : [Nom de l'assureur]
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">5. Conditions d'utilisation</h2>
            <p className="text-muted-foreground mb-4">
              L'utilisation du site implique l'acceptation pleine et entière des conditions 
              générales d'utilisation décrites ci-après. Ces conditions d'utilisation sont 
              susceptibles d'être modifiées ou complétées à tout moment.
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">6. Limitation de responsabilité</h2>
            <p className="text-muted-foreground mb-4">
              MaisonLongue SAS ne pourra être tenue responsable des dommages directs ou indirects 
              causés au matériel de l'utilisateur lors de l'accès au site. MaisonLongue SAS 
              décline toute responsabilité quant à l'utilisation qui pourrait être faite des 
              informations et contenus présents sur le site.
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">7. Droit applicable</h2>
            <p className="text-muted-foreground mb-4">
              Les présentes mentions légales sont régies par le droit français. En cas de litige, 
              les tribunaux français seront seuls compétents.
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
            <p className="text-muted-foreground mb-4">
              Pour toute question concernant les présentes mentions légales, vous pouvez nous 
              contacter à l'adresse suivante : contact@maisonlongue.com
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
