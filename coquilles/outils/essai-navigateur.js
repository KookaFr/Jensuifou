#!/usr/bin/env node
/* Essai de bout en bout dans Chromium, au format téléphone : la une, l'aide,
   une partie du jour accélérée jusqu'au bilan. Captures dans le dossier donné.
   Usage : NODE_PATH=$(npm root -g) node outils/essai-navigateur.js [page.html] [dossier-captures] */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const page_ = path.resolve(process.argv[2] || path.join(__dirname, '..', 'index.html'));
const sortie = path.resolve(process.argv[3] || path.join(__dirname, '..', 'captures'));
fs.mkdirSync(sortie, { recursive: true });

(async () => {
  const navigateur = await chromium.launch();
  const contexte = await navigateur.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'fr-FR' });
  const page = await contexte.newPage();
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()); });

  await page.clock.install();
  await page.goto('file://' + page_);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(sortie, '1-une.png') });

  // Partie du jour : l'aide s'affiche d'abord.
  await page.tap('#btn-jour');
  await page.screenshot({ path: path.join(sortie, '2-aide.png') });
  await page.tap('#btn-aide-ok');
  await page.clock.runFor(4000);
  await page.screenshot({ path: path.join(sortie, '3-partie.png') });

  // Touche quelques mots : la pastille du marbre doit réagir.
  const mots = await page.$$('.epreuve .m');
  for (const m of mots.slice(0, 3)) {
    const b = await m.boundingBox();
    if (b && b.y > 120 && b.y < 600) await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
  }
  await page.clock.runFor(500);
  // Cherche une vraie coquille : touche les mots de la première épreuve un à un.
  const trouvee = await page.evaluate(() => {
    for (const m of document.querySelectorAll('.epreuve .m, .epreuve .photo')) {
      m.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: 100, clientY: 300 }));
      if (document.getElementById('marbre').dataset.etat === 'ok') return m.textContent;
    }
    return null;
  });
  console.log('Coquille trouvée :', trouvee);
  await page.clock.runFor(400);
  await page.screenshot({ path: path.join(sortie, '4-gestes.png') });
  const marbre = await page.textContent('#marbre-titre');
  console.log('Marbre après gestes :', marbre);

  // Bon à tirer sur la première épreuve.
  // (l'épreuve bouge en permanence : on clique par script plutôt qu'en attendant qu'elle soit immobile)
  await page.evaluate(() => { const b = document.querySelector('.epreuve.premiere .bat'); if (b) b.click(); });
  await page.clock.runFor(1500);

  // Laisse défiler jusqu'à la fin de l'édition.
  for (let i = 0; i < 60 && (await page.isHidden('#ecran-bilan')); i++) await page.clock.runFor(5000);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(sortie, '5-bilan.png'), fullPage: false });
  console.log('Bilan visible :', await page.isVisible('#ecran-bilan'));
  console.log('Titre du bilan :', await page.textContent('#bilan-titre'));
  console.log('Score :', await page.textContent('#bilan-score'), '· grille :', (await page.$$('#bilan-grille .case')).length, 'cases');
  console.log('Partage :\n' + (await page.inputValue('#texte-partage')));

  // Partie libre jusqu'à la perte de réputation.
  await page.tap('#btn-une');
  await page.tap('#btn-libre');
  await page.clock.runFor(3000);
  await page.screenshot({ path: path.join(sortie, '6-libre.png') });
  for (let i = 0; i < 80 && (await page.isHidden('#ecran-bilan')); i++) await page.clock.runFor(5000);
  console.log('Fin de partie libre :', await page.textContent('#bilan-titre'));
  await page.screenshot({ path: path.join(sortie, '7-bilan-libre.png') });

  const largeur = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log('Largeur de page :', largeur, '(attendu ≤ 390)');
  console.log(erreurs.length ? 'Erreurs :\n' + erreurs.join('\n') : 'Aucune erreur JavaScript.');
  await navigateur.close();
  process.exit(erreurs.length ? 1 : 0);
})();
