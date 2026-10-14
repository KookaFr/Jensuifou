# Jensuifou

Petits jeux addictifs, en 2D, sans moteur de jeu et sans IA au moment de jouer,
qui font progresser en français ou aident au quotidien.

Les pistes de jeux étudiées sont dans [IDEES.md](IDEES.md).

## Coquilles

Premier prototype jouable, pensé pour le téléphone. Les articles d'un journal
montent vers la rotative ; on touche les **coquilles** avant l'impression :

- fautes d'orthographe et de grammaire (a/à, accords, participes, faux amis…) ;
- erreurs de calcul (monnaie rendue, soldes, prix au kilo, TVA, horaires…) ;
- dates impossibles (31 avril, 30 février) ;
- photos qui ne correspondent pas au texte (le texte fait foi).

Toucher un mot juste est une **faute de zèle**. Après chaque coquille, la règle
s'affiche en bas de l'écran, et le bilan liste les pièges de la partie. En partie
libre, le jeu ressert plus souvent les règles qu'on rate.

Trois lecteurs, trois niveaux chacun, trois vitesses de rotative :

| Lecteur | Niveaux | Pièges visés |
|---|---|---|
| Enfant | CE2, CM1, CM2 | a/à, et/est, son/sont, -er/-é, m devant m-b-p, accords simples, petits calculs, objets à compter |
| Adulte | Courant, Exigeant, Expert | participes passés, leur, quel/qu'elle, futur/conditionnel, anglicismes, pourcentages, TVA |
| J'apprends le français | A1, A2, B1 | genre des noms, être/avoir, à/en/au, du/de la, verbes irréguliers, nombres en lettres, vocabulaire en images |

Deux modes : l'**édition du jour** (10 articles, la même pour tout le monde,
résultat à partager) et la **partie libre** (sans fin, rubriques au choix).

### Jouer

- Sur téléphone : ouvrir `coquilles/dist/coquilles.html` (un seul fichier, fonctionne hors ligne).
- En développement : ouvrir `coquilles/index.html` dans un navigateur.

### Ajouter du contenu

Les brèves sont dans `coquilles/js/contenu/`. Chaque mot piégé s'écrit entre accolades :

```
{forme correcte|faute 1|faute 2#règle:explication propre à ce mot}
```

Exemple : `Le gardien {a|à} arrêté un penalty.` La règle se devine seule pour les
homophones courants (a/à, et/est, son/sont, on/ont, ou/où, ce/se, ces/ses…) ;
sinon on la nomme (`#ppa`, `#genre`, `#usage:…`). Les règles et leurs explications
sont dans `coquilles/js/regles.js`. Les calculs sont fabriqués par
`coquilles/js/contenu/generateurs.js`, qui propose d'abord les erreurs classiques
(+20 % au lieu de +21 %, 80 − 25 au lieu de −25 %…).

### Outils

```sh
cd coquilles
node outils/verifier.js            # vérifie toutes les brèves et les générateurs
node outils/verifier.js --exemples # affiche des articles tirés au sort
node outils/construire.js          # régénère dist/coquilles.html
NODE_PATH=$(npm root -g) node outils/essai-navigateur.js   # essai complet dans Chromium (Playwright)
```

Aucune dépendance : HTML, CSS et JavaScript simples. Les sons sont synthétisés,
les illustrations sont pour l'instant des emoji (à remplacer par de vrais dessins).
