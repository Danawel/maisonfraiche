// =====================================================================
//  GÉNÉRATEUR D'IMAGES "ÉPINGLE PINTEREST" (1000 x 1500)
//  Fabrique automatiquement une image verticale par article publié,
//  dans public/pins/<slug>.png. Utilisée par Pinterest (flux RSS),
//  Facebook et Twitter (og:image).
//
//  Lancé automatiquement avant le build (voir package.json).
// =====================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');
const OUT_DIR = path.join(ROOT, 'public', 'pins');
const FONT_DIR = path.join(ROOT, 'src', 'assets', 'fonts');

const fontBold = fs.readFileSync(path.join(FONT_DIR, 'Poppins-Bold.ttf'));
const fontSemi = fs.readFileSync(path.join(FONT_DIR, 'Poppins-SemiBold.ttf'));

// Illustration d'air fryer (SVG) utilisée en filigrane dans le fond de l'épingle.
// Illustration : unité intérieure de climatiseur (split) + air frais + flocon.
const AIRFRYER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 520'>
  <rect x='40' y='150' width='320' height='90' rx='18' fill='#e0632b'/>
  <rect x='40' y='150' width='320' height='40' rx='18' fill='#fbf6f0' opacity='0.25'/>
  <rect x='60' y='214' width='280' height='10' rx='5' fill='#fbf6f0'/>
  <circle cx='320' cy='176' r='8' fill='#fbf6f0'/>
  <path d='M90 260 q10 40 0 80' stroke='#fbf6f0' stroke-width='10' fill='none' stroke-linecap='round' opacity='0.8'/>
  <path d='M160 260 q10 50 0 100' stroke='#fbf6f0' stroke-width='10' fill='none' stroke-linecap='round' opacity='0.8'/>
  <path d='M230 260 q10 50 0 100' stroke='#fbf6f0' stroke-width='10' fill='none' stroke-linecap='round' opacity='0.8'/>
  <path d='M300 260 q10 40 0 80' stroke='#fbf6f0' stroke-width='10' fill='none' stroke-linecap='round' opacity='0.8'/>
  <g stroke='#e0632b' stroke-width='9' stroke-linecap='round'>
    <line x1='200' y1='400' x2='200' y2='480'/>
    <line x1='165' y1='420' x2='235' y2='460'/>
    <line x1='235' y1='420' x2='165' y2='460'/>
  </g>
</svg>`;
const AIRFRYER_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(AIRFRYER_SVG)}`;

// Couleur du badge selon le type de contenu
const TYPE_STYLE = {
  guide: { label: 'GUIDE COMPLET', bg: '#e0632b' },
  comparatif: { label: 'COMPARATIF', bg: '#2b6ce0' },
  article: { label: 'ARTICLE', bg: '#1f9d55' },
};

// Taille de titre adaptée à la longueur
function titleSize(t) {
  if (t.length > 95) return 60;
  if (t.length > 65) return 70;
  if (t.length > 40) return 82;
  return 94;
}

function pinElement(title, type) {
  const ts = TYPE_STYLE[type] || TYPE_STYLE.guide;
  return {
    type: 'div',
    props: {
      style: {
        width: 1000,
        height: 1500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fbf6f0',
        padding: 80,
        fontFamily: 'Poppins',
        position: 'relative',
      },
      children: [
        // Filigrane : illustration d'air fryer dans le fond
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              right: -120,
              bottom: 20,
              width: 620,
              height: 806,
              opacity: 0.13,
              backgroundImage: `url("${AIRFRYER_URI}")`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '620px 806px',
            },
          },
        },
        // En-tête : marque + badge type
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 30 },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', fontSize: 46, fontWeight: 700, color: '#e0632b' },
                  children: 'AirFryGuide',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignSelf: 'flex-start',
                    fontSize: 30,
                    fontWeight: 700,
                    color: 'white',
                    backgroundColor: ts.bg,
                    padding: '14px 28px',
                    borderRadius: 999,
                    letterSpacing: 2,
                  },
                  children: ts.label,
                },
              },
            ],
          },
        },
        // Titre
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: titleSize(title),
              fontWeight: 700,
              color: '#2a2320',
              lineHeight: 1.15,
            },
            children: title,
          },
        },
        // Pied : bande orange
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              borderTop: '6px solid #e0632b',
              paddingTop: 30,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', fontSize: 40, fontWeight: 700, color: '#e0632b' },
                  children: 'Un nouveau guide chaque jour',
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', fontSize: 32, fontWeight: 600, color: '#7a6f68' },
                  children: 'statuesque-lolly-d520d0.netlify.app',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function renderPin(title, type, outPath) {
  const svg = await satori(pinElement(title, type), {
    width: 1000,
    height: 1500,
    fonts: [
      { name: 'Poppins', data: fontBold, weight: 700, style: 'normal' },
      { name: 'Poppins', data: fontSemi, weight: 600, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1000 } }).render().asPng();
  fs.writeFileSync(outPath, png);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(ARTICLES_DIR, { recursive: true }); // le dossier peut être absent (aucun article encore)
  const now = new Date();
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));
  let made = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const outPath = path.join(OUT_DIR, `${slug}.png`);
    if (fs.existsSync(outPath)) continue; // déjà générée

    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
    const { data } = matter(raw);
    if (data.draft) continue;
    if (data.pubDate && new Date(data.pubDate) > now) continue; // pas encore publié

    await renderPin(String(data.title), data.type || 'guide', outPath);
    made++;
    console.log(`🖼️  Épingle créée : pins/${slug}.png`);
  }

  console.log(made ? `✅ ${made} image(s) d'épingle générée(s).` : 'ℹ️  Aucune nouvelle image à générer.');
}

main().catch((err) => {
  console.error('Erreur génération épingles :', err);
  process.exit(1);
});
