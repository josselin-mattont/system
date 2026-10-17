SYSTEM 0.9.4-rc.3 — PAQUET PWA

Contenu de ce dossier (à publier tel quel, à la racine du site actuel de SYSTEM) :
  index.html                 standalone 0.9.4-rc.3, octet pour octet identique à dist/index.html
  manifest.webmanifest       inchangé depuis 0.9.3 (pwa-baseline)
  sw.js                      service worker de 0.9.3 ; seule la clé de cache change
  icons/                     inchangées depuis 0.9.3
  THIRD-PARTY-LICENSES.txt   inchangé
  README-PWA.txt             ce fichier
  SHA256SUMS.txt             empreintes de tous les fichiers ci-dessus

Service worker
  Une seule ligne diffère de la version déployée :
    const CACHE = 'system-v0.9.4-rc3-shell';
  Le reste du comportement est conservé : seul l'app shell est mis en cache, jamais une donnée
  applicative, une réponse HAL ou un portfolio ; la navigation passe par le réseau en premier,
  avec le shell en secours hors ligne ; l'activation d'une nouvelle version n'a lieu qu'après le
  message SKIP_WAITING (bouton de mise à jour de l'application). À l'activation, les anciens
  caches « system-* » sont supprimés.

Données
  Les données restent dans le stockage local de l'appareil. Le schéma reste en version 25 :
  0.9.4 n'ajoute que des champs facultatifs (disponibilité, Hall of fame, œuvres retirées,
  décisions d'identité, provenance des séances, programmation des cours). Une sauvegarde 0.9.3
  s'ouvre sans migration. Rien n'est remis à zéro.

Ordre des étapes (rien n'est publié par Claude)
  1. Validation technique, sans toucher à la production :
     node work/build/build.mjs && node work/build/pwa.mjs   (doit reproduire SHA256SUMS.txt)
     node work/tests/run-node.mjs dist/index.html
     node work/tests/audit/rc2-publication-revisions.cjs dist/index.html work/tests/audit/vendor/parse5-8.0.1.iife.js
     node work/tests/audit/rc1-targeted-repro.cjs dist/index.html work/tests/audit/vendor/parse5-8.0.1.iife.js
     SYSTEM_STANDALONE=dist/index.html node work/tests/regression/run-regression.mjs
  2. Sur l'iPhone, dans l'application installée actuelle : Paramètres et sauvegarde → Exporter.
     Conserver ce fichier hors de l'appareil.
  3. Vérification sur l'iPhone. Deux possibilités, à choisir :
     a. Version d'essai sur un AUTRE domaine (ou sous-domaine) que la production. Ne pas utiliser
        un simple sous-dossier du même domaine : le service worker supprime à l'activation tous
        les caches « system-* » de l'origine et toucherait l'application installée.
        Ouvrir l'essai dans Safari, importer la sauvegarde de l'étape 2, faire les contrôles 4.
     b. Ou publier directement la mise à jour, puis faire les contrôles 4 aussitôt après
        l'acceptation du bandeau de mise à jour, avec la sauvegarde de l'étape 2 sous la main.
  4. Contrôles (aucun n'a été réalisé sur iPhone par Claude) :
     - la version 0.9.4-rc.3 apparaît dans Paramètres et sauvegarde ; les données d'hier sont là ;
     - Plus → Disponibilité : repos sportif confirmé ; aucune quête physique ; une dette éventuelle
       est indiquée « suspendue pendant le repos » ;
     - Agenda : « AJOUTER À MES MISSIONS » sur un cours du jour, puis vérifier Aujourd'hui ;
     - Échos → Saisir → un accomplissement réel, puis le retrouver dans Plus → Hall of fame ;
     - mode avion, rouvrir l'application : le shell se charge hors ligne.
  5. Vérifier les empreintes des fichiers publiés : shasum -a 256 -c SHA256SUMS.txt

Retour arrière
  Republier les fichiers de pwa-baseline/ (0.9.3). Leur clé de cache différente force le
  remplacement du shell. 0.9.3 accepte un état 0.9.4 mais IGNORE la disponibilité, le Hall,
  les statuts de publication et le raccordement des grades : pendant le repos, 0.9.3 proposerait
  de nouveau la quête physique et pourrait créer une dette. L'import d'une sauvegarde n'ajoute
  pas ce support à 0.9.3. En cas de retour arrière, ne pas clôturer de journée et republier
  0.9.4 dès que possible.
