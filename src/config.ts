// =============================================================
//  CONFIGURATION CENTRALE DU BLOG
//  C'est LE seul fichier à modifier pour personnaliser ton blog.
// =============================================================

export const SITE = {
  // Nom du blog (affiché partout)
  name: 'MaisonFraîche',

  // Slogan / description courte
  tagline: 'Climatiseurs, rafraîchisseurs et déshumidificateurs pour garder votre maison au frais',

  // Description longue (SEO, balise meta description de l'accueil)
  description:
    'MaisonFraîche publie chaque jour des guides, comparatifs et conseils pour lutter ' +
    'contre la chaleur : climatiseurs mobiles et split, unités extérieures, rafraîchisseurs ' +
    'd\'air et déshumidificateurs. Bien choisir, dimensionner et économiser.',

  // URL FINALE du blog — À REMPLACER après le déploiement Netlify.
  // Exemple : 'https://maisonfraiche.netlify.app'
  url: 'https://maisonfraiche.netlify.app',

  // Langue
  lang: 'fr',

  // Auteur affiché
  author: 'La rédaction MaisonFraîche',
};

// =============================================================
//  AFFILIATION AMAZON
// =============================================================
export const AMAZON = {
  // TON TAG Amazon Partenaires (Associates).
  // Tant que tu n'as pas ton compte, laisse ce placeholder :
  // les liens fonctionneront mais ne rapporteront rien.
  // Quand tu as ton vrai tag (ex: 'monblog-21'), remplace-le ici : tout se met à jour.
  tag: 'maisonfraiche-21',

  // Domaine Amazon utilisé (France par défaut)
  domain: 'www.amazon.fr',

  // Mention légale obligatoire imposée par Amazon (affichée en haut de chaque article).
  disclosure:
    "En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant " +
    "les conditions requises. Ce guide contient des liens affiliés : si vous achetez via " +
    "l'un de ces liens, cela ne vous coûte pas plus cher et nous soutient.",
};

// =============================================================
//  STATISTIQUES DE VISITES (Cloudflare Web Analytics — gratuit)
//  Colle ici le "token" fourni par Cloudflare pour activer le compteur.
//  Laisse vide pour désactiver.
// =============================================================
export const ANALYTICS = {
  cloudflareToken: '',
};

// Construit une URL affiliée propre à partir d'un ASIN (identifiant produit Amazon)
export function amazonLink(asin: string): string {
  return `https://${AMAZON.domain}/dp/${asin}?tag=${AMAZON.tag}`;
}
