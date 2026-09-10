# Grain d'Espoir Essonne — Homepage

Site vitrine principal de **Grain d'Espoir Essonne**.

Le dépôt `homepage` contient la page d'accueil publique du site, actuellement basée sur une architecture **statique HTML / CSS / JavaScript**, volontairement simple et facile à maintenir.

## État actuel

Branche de travail actuelle :

```text
develop-quovago-daily-quote
```

La branche `main` reste réservée à la production.

Évolutions actuellement validées sur la branche de développement :

- séparation du HTML, du CSS et du JavaScript ;
- création d'un composant de citation rotative dans le header ;
- stabilisation de la hauteur du composant pour éviter les mouvements de page ;
- intégration de l'API publique **QuoVaGo** ;
- récupération dynamique des citations liées à l'**Espoir** ;
- filtrage côté API sur les citations **positives** ;
- conservation de citations locales de secours si l'API est indisponible.

## Structure du dépôt

```text
homepage/
├── index.html
├── CNAME
├── README.md
├── logo.png
├── icon-nos-activites.png
├── qrcode-adhesion-cotisation-2025-2026.png
├── PHOTO-2025-12-25-18-01-38.jpg
└── assets/
    ├── css/
    │   ├── main.css
    │   └── quotes.css
    └── js/
        ├── quotes.js
        └── quotes.service.js
```

## Organisation des fichiers

### `index.html`

Contient uniquement la structure principale de la page :

- header ;
- logo ;
- citation ;
- navigation ;
- bouton de don ;
- contenu principal ;
- bloc de soutien ;
- liens vers les activités et le calendrier ;
- footer.

Le fichier charge les feuilles de style externes et le module JavaScript des citations.

### `assets/css/main.css`

Contient les styles généraux du site :

- couleurs ;
- typographie ;
- mise en page ;
- header ;
- navigation ;
- hero ;
- boutons ;
- cartes ;
- sections ;
- responsive design.

### `assets/css/quotes.css`

Contient uniquement les styles du composant de citation :

- positionnement ;
- guillemets décoratifs ;
- animation ;
- flou et fondu ;
- hauteur fixe ;
- responsive ;
- réduction des animations selon les préférences utilisateur.

La hauteur du composant est volontairement stabilisée afin d'éviter les changements de mise en page lors du passage d'une citation à l'autre.

### `assets/js/quotes.service.js`

Responsable uniquement de l'accès à l'API publique QuoVaGo.

Endpoint utilisé :

```text
https://api.quovago.com/v1/quotes
```

Filtres utilisés :

```text
classification=ETH_VAL_ESP
classificationValue=POSITIF
language=fr
page=1
pageSize=100
```

Ces filtres correspondent à :

```text
Classification : Espoir
Code           : ETH_VAL_ESP

Valeur         : Positif
Code           : POSITIF

Langue         : Français
```

L'objectif est que le filtrage métier soit réalisé côté **QuoVaGo**, et non dans le frontend Grain d'Espoir.

### `assets/js/quotes.js`

Responsable uniquement de l'affichage des citations :

- récupération des citations via `quotes.service.js` ;
- normalisation des données ;
- affichage du contenu ;
- affichage du titre ;
- rotation automatique ;
- animation entre les citations ;
- gestion d'un fallback local.

Les citations locales servent uniquement de secours si l'API QuoVaGo est temporairement indisponible.

## Fonctionnement des citations

Flux actuel :

```text
QuoVaGo API
    ↓
Filtre ESPOIR + POSITIF + français
    ↓
quotes.service.js
    ↓
quotes.js
    ↓
Bandeau de citation du header
```

Exemple d'appel :

```bash
curl -s   "https://api.quovago.com/v1/quotes?classification=ETH_VAL_ESP&classificationValue=POSITIF&language=fr&page=1&pageSize=100"   | python3 -m json.tool
```

À la date de cette évolution, l'API retourne notamment des objets contenant :

```json
{
  "id": "...",
  "code": "...",
  "title": "...",
  "content": "...",
  "languageCode": "fr",
  "classification": {
    "code": "ETH_VAL_ESP",
    "name": "Espoir"
  },
  "classificationValue": {
    "code": "POSITIF",
    "name": "Positif"
  }
}
```

Le champ `content` est utilisé pour la citation principale.

Le champ `title` est affiché comme titre ou sous-titre de la citation.

## Fallback local

Si l'appel API échoue, `quotes.js` utilise automatiquement quelques citations locales.

Cela permet de conserver un affichage fonctionnel même si :

- l'API QuoVaGo est indisponible ;
- le réseau est inaccessible ;
- une erreur temporaire survient côté service.

Le site ne doit donc pas afficher une zone de citation vide.

## Test local

Depuis le dépôt :

```bash
cd /Users/menjayto/Projets/GrainEspoir91/homepage
```

Lancer un serveur HTTP simple :

```bash
python3 -m http.server 8080
```

Puis ouvrir :

```text
http://localhost:8080
```

Pour vérifier le chargement des citations, ouvrir les DevTools du navigateur.

La console doit afficher un message de ce type :

```text
QuoVaGo : 2 citation(s) chargée(s)
```

Dans l'onglet Network, on doit voir l'appel à :

```text
https://api.quovago.com/v1/quotes?classification=ETH_VAL_ESP&classificationValue=POSITIF&language=fr...
```

## Vérifications avant commit

Toujours vérifier l'état du dépôt avant un commit :

```bash
git status -sb
git diff --check
git diff --stat
```

Pour vérifier les modifications mises en stage :

```bash
git diff --cached --check
git diff --cached --stat
```

## Git et branches

Organisation actuelle :

```text
main
└── production

develop-quovago-daily-quote
└── développement de la citation dynamique QuoVaGo
```

La branche de développement doit être utilisée pour valider toutes les évolutions avant intégration dans `main`.

Ne pas modifier ou écraser directement `main` tant que la version n'a pas été validée.

## Déploiement

Le site est conçu pour rester compatible avec un hébergement statique tel que GitHub Pages.

Le dépôt ne nécessite actuellement :

- ni Node.js ;
- ni serveur backend local ;
- ni framework frontend ;
- ni étape de build.

Les dépendances dynamiques sont externes et limitées à l'API publique QuoVaGo.

## Domaines liés

Site principal :

```text
graindespoir.fr
```

Activités :

```text
https://activites.graindespoir.fr
```

Calendrier :

```text
https://calendrier.graindespoir.fr
```

API QuoVaGo :

```text
https://api.quovago.com
```

Documentation API :

```text
https://api.quovago.com/docs/
```

## Principes de maintenance

Le dépôt doit rester simple.

Principes retenus :

- séparer HTML, CSS et JavaScript ;
- éviter les dépendances inutiles ;
- ne pas introduire de framework sans besoin réel ;
- garder les responsabilités des fichiers bien séparées ;
- conserver des fichiers de taille raisonnable ;
- éviter qu'un fichier dépasse environ **1000 lignes** ;
- privilégier les évolutions progressives ;
- tester sur une branche dédiée avant passage en production.

## Prochaines évolutions possibles

Évolutions envisageables après validation de cette version :

- ajout d'un favicon pour supprimer le `404 /favicon.ico` ;
- amélioration éventuelle de l'affichage du titre ou de la source des citations ;
- ajout d'un mécanisme de sélection quotidienne d'une citation ;
- optimisation éventuelle du cache ;
- extension des filtres QuoVaGo si de nouvelles classifications sont nécessaires ;
- déplacement futur des images dans `assets/images/` si cela devient utile.

## Statut

État actuel du frontend :

```text
[OK] Structure HTML / CSS / JS séparée
[OK] Citation rotative
[OK] Animation stable sans déplacement de page
[OK] Connexion API QuoVaGo
[OK] Filtre Espoir
[OK] Filtre Positif
[OK] Langue française
[OK] Fallback local
[OK] Test local réussi
[À VALIDER] Commit de l'intégration API
[À FAIRE] Merge vers main après validation finale
```

---

**Grain d'Espoir Essonne**
*Vivre dans l'espérance*

# Grain d'Espoir Essonne — Homepage

## État fonctionnel — septembre 2026

Le dépôt `homepage` contient le site principal de **Grain d'Espoir Essonne**.

Production :

```text
https://graindespoir.fr
```

### Fonctionnalités principales

- page d'accueil publique ;
- identité visuelle Grain d'Espoir Essonne ;
- citations dynamiques issues de l'API publique QuoVaGo ;
- affichage des événements à venir dans la zone Agenda ;
- accès aux sites Activités, Calendrier et Ressources ;
- bouton **Participer aux prochains événements** redirigeant vers le calendrier ;
- liens de contact et de soutien.

### Architecture

Le site reste volontairement simple et statique :

```text
index.html
assets/
├── css/
└── js/
```

Les composants CSS et JavaScript sont séparés afin de faciliter la maintenance.

### QuoVaGo

Les citations sont obtenues depuis l'API publique QuoVaGo :

```text
https://api.quovago.com
```

Le site principal ne contient pas directement les codes de sondage des événements.

La gestion des participations et des formulaires est déléguée au site Calendrier.

### Sites associés

```text
https://activites.graindespoir.fr
https://calendrier.graindespoir.fr
https://ressources.graindespoir.fr
```

### Déploiement

Le site est publié via GitHub Pages depuis la branche `main`.

Toute évolution doit être développée et validée sur une branche dédiée avant fusion dans `main`.
