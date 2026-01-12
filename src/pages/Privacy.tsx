import { Layout } from '@/components/layout/Layout';

export default function Privacy() {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl font-bold mb-8">Politique de confidentialité - RGPD</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6 text-lg">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">1. Responsable du traitement</h2>
            <p className="text-muted-foreground mb-4">
              Le responsable du traitement des données personnelles est :<br/>
              <strong>MaisonLongue SAS</strong><br/>
              Adresse : Paris, France<br/>
              Email : dpo@maisonlongue.com
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">2. Données collectées</h2>
            <p className="text-muted-foreground mb-4">
              Nous collectons les données suivantes dans le cadre de notre activité :
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li>Données d'identification : nom, prénom, adresse email, numéro de téléphone</li>
              <li>Données de connexion : adresse IP, logs de connexion</li>
              <li>Données de navigation : cookies, préférences de navigation</li>
              <li>Données relatives aux demandes de location : critères de recherche, messages</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">3. Finalités du traitement</h2>
            <p className="text-muted-foreground mb-4">
              Vos données sont collectées pour les finalités suivantes :
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li>Gestion de votre compte utilisateur</li>
              <li>Traitement de vos demandes de contact et de visite</li>
              <li>Envoi de communications relatives à nos services</li>
              <li>Amélioration de nos services et de votre expérience utilisateur</li>
              <li>Respect de nos obligations légales</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">4. Base légale du traitement</h2>
            <p className="text-muted-foreground mb-4">
              Le traitement de vos données repose sur :
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li>Votre consentement (pour les cookies non essentiels et les communications marketing)</li>
              <li>L'exécution d'un contrat (pour la gestion des locations)</li>
              <li>Notre intérêt légitime (pour l'amélioration de nos services)</li>
              <li>Le respect d'obligations légales</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">5. Durée de conservation</h2>
            <p className="text-muted-foreground mb-4">
              Vos données sont conservées pendant :
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li>Données de compte : durée de la relation contractuelle + 3 ans</li>
              <li>Données de contact : 3 ans à compter du dernier contact</li>
              <li>Cookies : 13 mois maximum</li>
              <li>Données comptables : 10 ans</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">6. Vos droits</h2>
            <p className="text-muted-foreground mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit à la limitation</strong> : limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
              <li><strong>Droit de retirer votre consentement</strong> à tout moment</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              Pour exercer ces droits, contactez-nous à : dpo@maisonlongue.com
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">7. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez 
              gérer vos préférences via notre bandeau cookies.
            </p>
            <p className="text-muted-foreground mb-4">
              Types de cookies utilisés :
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
              <li><strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site</li>
              <li><strong>Cookies analytiques</strong> : pour analyser l'utilisation du site</li>
              <li><strong>Cookies marketing</strong> : pour personnaliser les publicités</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">8. Sécurité des données</h2>
            <p className="text-muted-foreground mb-4">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
              pour protéger vos données contre tout accès non autorisé, modification, 
              divulgation ou destruction.
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">9. Transferts de données</h2>
            <p className="text-muted-foreground mb-4">
              Vos données sont hébergées dans l'Union européenne. En cas de transfert hors 
              UE, nous nous assurons que des garanties appropriées sont mises en place.
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">10. Réclamation</h2>
            <p className="text-muted-foreground mb-4">
              Si vous estimez que le traitement de vos données ne respecte pas la réglementation, 
              vous pouvez introduire une réclamation auprès de la CNIL :<br/>
              Commission Nationale de l'Informatique et des Libertés<br/>
              3 Place de Fontenoy, TSA 80715<br/>
              75334 Paris Cedex 07<br/>
              www.cnil.fr
            </p>

            <h2 className="font-display text-2xl font-semibold mt-8 mb-4">11. Modifications</h2>
            <p className="text-muted-foreground mb-4">
              Cette politique de confidentialité peut être modifiée à tout moment. 
              Les modifications prennent effet dès leur publication sur le site.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
