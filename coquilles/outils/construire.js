#!/usr/bin/env node
/* Assemble Coquilles en un seul fichier HTML (styles et scripts intégrés),
   qu'on peut ouvrir directement sur un téléphone, même hors ligne.
   Usage : node outils/construire.js [--fragment chemin.html]
   --fragment écrit aussi une version sans <html>/<head>/<body>, pour les hébergeurs
   qui fournissent eux-mêmes le squelette de la page. */
'use strict';
const fs = require('fs');
const path = require('path');

const racine = path.join(__dirname, '..');
const lire = (f) => fs.readFileSync(path.join(racine, f), 'utf8');

let html = lire('index.html');
html = html.replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (_, f) => `<style>\n${lire(f).trim()}\n</style>`);
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (_, f) => {
  const code = lire(f);
  if (code.includes('</script')) throw new Error(`${f} contient « </script » : impossible de l'intégrer.`);
  return `<script>\n${code.trim()}\n</script>`;
});

const dist = path.join(racine, 'dist');
fs.mkdirSync(dist, { recursive: true });
const complet = path.join(dist, 'coquilles.html');
fs.writeFileSync(complet, html);
console.log(`${path.relative(racine, complet)} : ${(html.length / 1024).toFixed(0)} Ko`);

const i = process.argv.indexOf('--fragment');
if (i > 0 && process.argv[i + 1]) {
  const fragment = html
    .replace(/<!doctype html>\s*/i, '')
    .replace(/<html[^>]*>\s*/i, '')
    .replace(/\s*<\/html>\s*$/i, '\n')
    .replace(/<head>\s*/i, '')
    .replace(/\s*<\/head>\s*/i, '\n')
    .replace(/<body>\s*/i, '')
    .replace(/\s*<\/body>/i, '')
    .replace(/<meta charset="utf-8">\s*/i, '')
    .replace(/<meta name="viewport"[^>]*>\s*/i, '');
  fs.writeFileSync(process.argv[i + 1], fragment);
  console.log(`fragment : ${process.argv[i + 1]}`);
}
