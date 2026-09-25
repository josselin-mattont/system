SYSTEM V0.9.3 — PRODUCTION / CONNECTEURS (RC1)

Release candidate. NON VALIDEE POUR LA PRODUCTION.

1. Servir ce dossier en HTTPS ou sur localhost.
2. Ouvrir index.html.
3. Installer via le navigateur ou le systeme.

Le fichier autonome
  SYSTEM-V0.9.3-PRODUCTION-CONNECTEURS-RC1-autonome.html
peut toujours etre utilise separement, sans ce dossier.
index.html en est une copie byte-identique.

CE QUE CHANGE LA V0.9.3
- SCHEMA 25. Une sauvegarde au schema 24 est migree a l'ouverture, sans perte ni
  recalcul : XP, statistiques, bibliotheque, patrimoine et missions passees sont
  conserves a l'identique. Aucune nouvelle cle de stockage.
- BIBLIOTHEQUE. Les boutons OUI / NON de « SERIE TERMINEE ? » refletent la valeur
  reelle. Serie terminee : nombre final de tomes. Serie en cours : nombre publie,
  facultatif. Livre simple : aucune question de serie. Declarer des lectures
  anterieures ne donne toujours aucune XP.
- ROUTINES. Aucune repetition (a une date), quotidienne, jours ouvres,
  hebdomadaire (jours choisis), mensuelle (jour choisi ; 29, 30 ou 31 tombent le
  dernier jour d'un mois plus court). Une occurrence par routine et par jour,
  aucun rattrapage des jours sans ouverture, aucune recompense pour la
  programmation. La generation a lieu quand l'application est ouverte : aucune
  execution en arriere-plan n'est promise sur iOS.
- NATURE DES TACHES. Physique (END propose, FOR ou VIT au choix), cognitive (INT
  pour une lecture, FOC sinon, modifiable), mixte (une statistique principale
  choisie explicitement). La destination des points est affichee avant
  validation. Bareme inchange ; une mission ne credite jamais DIS (regle
  existante), ce que le formulaire indique.
- UNE SEANCE, UNE RECOMPENSE. Si une seconde seance physique est validee le meme
  jour, SYSTEM demande s'il s'agit de la meme : rattachement sans recompense, ou
  seance distincte recompensee normalement. Le titre n'est pas un critere.
- PUBLICATIONS. Un DOI deja present au patrimoine rattache la source sans
  nouveau candidat ni recompense. Un titre et une annee identiques sans DOI
  produisent un candidat « a confirmer ». Aucune fusion automatique.
- IMPORT ICS. Heures UTC converties vers Europe/Paris (changements d'heure
  compris), salle conservee, texte echappe decode, RRULE et fuseaux etrangers
  refuses explicitement. Apercu avant confirmation, ecriture atomique, mise a
  jour par source et UID, aucune suppression. Les anciens evenements importes
  sont proposes au rattachement. Aucune synchronisation automatique.
- Le parseur parse5 embarque et le connecteur HTML sont inchanges.
- Service worker : comportement frozen conserve, seul le nom du cache change.

CE QU'AVAIT CHANGE LE PATCH11
- L'EMULATION ARTISANALE DU PARSEUR HTML EST SUPPRIMEE. Les patchs 2 a 10
  reproduisaient a la main les regles HTML, SVG, MathML, les espaces de noms, les
  points d'integration et les modes textuels : chaque patch corrigeait un cas et en
  laissait d'autres. L'arbre du document est desormais construit par parse5 8.0.1,
  un parseur conforme au standard, inline dans le standalone au moment du bundle.
  Sont supprimes : neutralizeHtml, neutralizeTagSource, neutralizeAttrName,
  contentStateOf, childNamespace, estSansContenu, skipForbiddenBlock, et les
  constantes DROP_TAGS, CONTENT_STATE_*, FOREIGN_ROOTS, RAW_TEXT_TAGS,
  NEUTRALIZE_MAX_TAGS. Plus une seule regle du standard n'est reecrite ici.
- AUCUN DOM NAVIGATEUR N'EST CREE. L'extraction lit uniquement l'AST inerte produit
  par le parseur, avec scriptingEnabled: false : aucun script du site surveille n'est
  execute, et aucune sous-requete n'est possible par construction — non plus parce
  que les attributs reseau sont renommes, mais parce qu'aucun noeud vivant n'existe.
- AUCUNE DEPENDANCE RESEAU AU RUNTIME. parse5 est embarque dans le fichier, sous un
  identifiant d'asset deterministe derive du SHA-256 du bundle. Aucun CDN, aucun
  import distant. Les licences des dependances embarquees (parse5 MIT, entities
  BSD-2-Clause) sont reproduites integralement dans THIRD-PARTY-LICENSES.txt, joint
  a ce dossier et au standalone.
- COMPORTEMENT INCHANGE, et verifie comme tel : recuperation HTTPS manuelle, limites
  de taille, profondeur et nombre de noeuds, canonicalisation des sections et
  publications, empreintes deterministes, revisions de publications, alertes par
  occurrence de transition, persistance au schema 24, HAL, securite des URL,
  imports, exports, sauvegardes, economie et gameplay. Aucune migration de schema,
  aucune nouvelle cle de stockage, aucun changement de bareme.
- Le service worker conserve son comportement frozen : aucun clients.claim, aucun
  skipWaiting automatique, rechargement cible inchange. Seul le nom du cache change.

CE QU'AVAIT CHANGE LE PATCH10
- Le contexte etranger NE COUVRE PLUS irreversiblement tout le sous-arbre. Certains
  descendants REINTRODUISENT le traitement HTML, et le scanner les reconnait
  desormais : les points d'integration HTML cote SVG (foreignObject, desc, title),
  les MathML text integration points (mi, mo, mn, ms, mtext), et annotation-xml
  lorsque son encoding vaut text/html ou application/xhtml+xml, sans distinction de
  casse. Le contexte est un espace de noms recalcule pour chaque element, non un
  booleen herite.
- Une balise ecrite « /> » N'EST PAS necessairement auto-fermante. En syntaxe HTML,
  <template/>, <script/> et <textarea/> ne sont PAS fermes : le solidus est ignore.
  Il ferme reellement l'element en contenu etranger SVG/MathML, et les elements HTML
  void n'ont de toute facon jamais de contenu. La decision depend donc de l'espace de
  noms courant et du type d'element.
- SHA256SUMS.txt est regenere depuis les fichiers finaux. Celui du patch9 declarait
  une empreinte et une taille perimees pour index.html.

CE QU'AVAIT CHANGE LE PATCH9
- Le scanner classe desormais chaque element selon son ETAT DE CONTENU HTML, et
  non selon une liste de deux exceptions. Un element dont le contenu n'est PAS du
  balisage ne peut pas etre traverse comme du balisage : une chaine « </template> »
  ecrite dans un textarea, un title, un iframe, un xmp, un noembed ou un noframes
  est du TEXTE et ne ferme plus le conteneur parent. Sans cela, une publication
  cachee derriere un tel element etait extraite alors qu'un navigateur ne la voit
  pas.
  Etats couverts : script data, RAWTEXT, RCDATA, plaintext, contenu de balisage
  ordinaire, et contenu etranger SVG/MathML avec sections CDATA.
- Le CONTEXTE est pris en compte : un <title> est RCDATA en contenu HTML, mais un
  element de balisage ordinaire en contenu etranger SVG ou MathML. Seuls script et
  style gardent un contenu textuel dans tous les contextes.
- « plaintext » ne se termine jamais : un document qui en contient est REFUSE,
  avant toute creation de DOM, plutot qu'interprete.

CE QU'AVAIT CHANGE LE PATCH8
- Le contenu d'un bloc interdit est desormais parcouru TOKEN PAR TOKEN. A chaque
  etape, l'etat syntaxique courant est reconnu puis saute EN ENTIER : commentaires,
  sections CDATA des contenus etrangers (svg, math), declarations et instructions,
  balises completes avec attributs cites, conteneurs de meme nom imbriques, et
  surtout le contenu BRUT d'un enfant script ou style. Un « </template> » ecrit
  dans du JavaScript, ou un « </svg> » place dans une section CDATA, reste donc
  du texte et ne ferme plus le bloc englobant.
- mutate() accepte un troisieme parametre facultatif : un callback d'ECHEC. La
  regle absolue est conservee — LE CALLBACK DE SUCCES NE S'EXECUTE JAMAIS SI LA
  PERSISTANCE ECHOUE — mais les connecteurs HAL et Portfolio peuvent desormais
  liberer leur indicateur « synchronisation en cours » apres un refus d'ecriture.
  Aucune mutation, aucune source, aucun candidat, aucun horodatage n'est ecrit ;
  la banniere d'erreur reste affichee et le motif reste visible.

CE QU'AVAIT CHANGE LE PATCH7
- La FIN d'une balise fermante de bloc interdit est desormais trouvee par un
  balayage QUOTE-AWARE : un « > » place dans une valeur d'attribut de cette
  balise fermante n'est plus pris pour la fin de la balise. Une construction
  du type </script data-x="...<main id=contenu>..."> ne peut donc plus faire
  ressortir de balisage injecte.
- Les blocs interdits IMBRIQUES sont traites : template, noscript, svg, math
  et canvas sont des conteneurs de balisage, donc ils peuvent s'imbriquer et
  leur fermeture appariee est trouvee par comptage de profondeur. script et
  style restent des elements a texte brut, ou aucune imbrication n'existe :
  la premiere fermeture valide y termine le bloc. Un commentaire ne ferme
  jamais un conteneur, et une balise auto-fermante ne fausse pas le comptage.
- Le refus explicite des blocs reellement tronques est conserve.

CE QU'AVAIT CHANGE LE PATCH6
- La reconnaissance des balises fermantes des blocs interdits suit desormais la
  syntaxe HTML : « / » doit suivre IMMEDIATEMENT « < », et le nom suivre
  IMMEDIATEMENT « / ». « < / script > » n'est donc plus pris pour une fermeture.
  Une chaine JavaScript inerte contenant un faux fermant ne peut plus faire
  ressortir de balisage injecte hors du bloc. Corrige pour les sept blocs
  interdits : script, style, template, noscript, svg, math et canvas.
  Le refus explicite des blocs reellement tronques est conserve, et les
  fermetures HTML legitimes (espaces apres le nom, casse melangee, « /> »)
  restent reconnues.

CE QU'AVAIT CHANGE LE PATCH5
- Inventaire des attributs neutralises audite sur le standard HTML courant et
  complete des attributs historiques encore honores par certains WebKit.
  imagesrcset, imagesizes, lowsrc, dynsrc, cite, archive et codebase etaient
  encore actifs dans patch4 : ils sont desormais neutralises.
  <link rel="preload" as="image" imagesrcset="..."> ne fournit plus aucun
  candidat de prechargement.
- L'ordinal d'une alerte de changement est desormais « plus grand ordinal
  VALIDE deja persiste pour cette paire, plus un », et non un comptage de
  sources. Supprimer une source depuis l'interface ne peut donc plus faire
  reutiliser un ordinal encore en service. Les suffixes mal formes sont
  ignores et un depassement deraisonnable est refuse proprement.
- L'executeur de tests accepte enfin --log et --log=chemin, refuse une option
  inconnue et une suite inconnue, et documente qu'il n'execute que les suites
  Node.

CE QU'AVAIT CHANGE LE PATCH4
- Neutralisation du HTML distant par un scanner deterministe et quote-aware,
  operant sur le texte avant toute creation de document. Un « > » place dans
  une valeur entre guillemets n'est plus pris pour une fin de balise :
  <img alt=">" src="..."> ne laisse plus survivre d'attribut reseau.
  Le contenu des blocs interdits (script, style, svg...) est traverse sans
  jamais etre interprete : du JavaScript contenant « < » ou « > » ne perturbe
  plus l'analyse. Une entree ambigue ou tronquee est REFUSEE, jamais traitee
  de maniere permissive.
- Les alertes de changement du site sont desormais identifiees par OCCURRENCE
  (paire d'etats + ordinal deduit des alertes deja persistees) et non par type
  de transition. Ecarter une alerte n'empeche plus les changements ulterieurs
  d'etre proposes, meme lorsque la meme paire d'etats se reproduit.
- Le dossier de harnais fournit un executeur reel (run-tests.mjs) qui appelle
  les suites, affiche chaque assertion et sort en erreur au premier echec.

CE QU'AVAIT CHANGE LE PATCH3
- Une alerte de changement distincte par TRANSITION reelle : ecarter
  l'alerte d'un changement passe n'eteint plus les changements suivants.
  Les deux sources techniques (pointeur de reference, version observee)
  ne produisent plus aucun candidat.
- Les revisions d'une publication sont conservees : l'identite d'une
  ligne est calculee sur titre, date, organisation, URL, DOI et statut.
  Une organisation, une URL ou un statut modifie cree une revision au
  lieu d'etre ignore. Aucune ancienne source n'est ecrasee.
- Le type de publication n'est plus force a « article » : il reste nul
  tant qu'aucune preuve structurelle ne l'etablit.
- Le HTML distant est neutralise AVANT toute creation de document.
  Bornes DOM ajoutees (20000 noeuds, profondeur 100).

CE QU'AVAIT CHANGE LE PATCH2 — CONNECTEUR PORTFOLIO
Le connecteur Portfolio lit desormais DIRECTEMENT la page HTML publique
configuree dans PARAMETRES (champ « URL DU SITE »). Le fichier
system-portfolio.json n'est plus requis par l'application. Il reste
fourni pendant la transition et n'est plus une dependance du package.

Aucune URL n'est preconfiguree : l'utilisateur saisit une fois l'adresse
publique de son site.

FONCTIONNEMENT
Le controle est MANUEL. La page n'est lue que lorsque l'utilisateur
appuie sur SYNCHRONISER, exactement comme pour HAL. Il n'y a aucun
timer, aucun polling, aucune verification au retour au premier plan et
aucun travail en arriere-plan.

AUCUNE SURVEILLANCE LORSQUE LA PWA EST FERMEE. Une application web
installee sur iOS ne peut pas surveiller un site en continu : rien
n'est verifie tant que l'application n'est pas ouverte et que la
synchronisation n'est pas declenchee a la main.

DETECTION DES CHANGEMENTS
SYSTEM ne compare pas les octets du fichier HTML. Il construit une
representation canonique du contenu (identifiants de section, titres,
textes visibles, liens HTTPS surs, ordre semantique) et compare des
empreintes SHA-256. Une modification de CSS, de classes, d'espaces, de
navigation ou de pied de page est donc VOLONTAIREMENT IGNOREE : elle ne
produit aucun faux changement.

Premiere synchronisation : « REFERENCE DU SITE ETABLIE ».
Synchronisation identique : « AUCUN CHANGEMENT DETECTE ».
Sinon : les sections ajoutees, modifiees ou retirees sont listees.

Une suppression sur le site est signalee comme une modification, mais
SYSTEM ne supprime jamais automatiquement une source, un candidat ni
une donnee deja enregistree.

Les publications detectees deviennent des sources et des candidats
A EXAMINER. Aucune reconnaissance, aucun XP, aucune REP, aucune
statistique et aucun rang n'est accorde automatiquement.

SECURITE DE LA LECTURE
La page est telechargee en HTTPS uniquement, en GET, sans cookies ni
identifiants, sans redirection suivie, avec un delai maximal de 15
secondes et une limite reelle de 2 Mio en octets. Seuls text/html et
application/xhtml+xml sont acceptes.
La reponse HTML est ANALYSEE DIRECTEMENT par parse5 8.0.1, un parseur
conforme au standard, embarque LOCALEMENT dans le standalone : aucune
dependance reseau au runtime, aucun CDN, aucun import distant.

Il n'y a PLUS de neutralisation du HTML. Le mecanisme de patch2 a
patch10 — retirer des blocs du source, renommer les attributs pouvant
declencher une requete — est SUPPRIME, et avec lui neutralizeHtml. Ce
n'est pas un affaiblissement : la garantie ne repose plus sur une liste
d'exceptions a maintenir, mais sur la structure meme du traitement.

AUCUN DOM NAVIGATEUR VIVANT N'EST CREE. L'extraction parcourt uniquement
l'AST INERTE produit par le parseur, avec scriptingEnabled: false :
  - aucune balise distante n'est inseree dans la page ni rendue ;
  - aucun script du site surveille n'est execute ;
  - aucune sous-requete n'est possible PAR CONSTRUCTION : il n'existe
    aucun noeud vivant susceptible d'en emettre une, quelle que soit la
    balise ou l'attribut present dans la reponse ;
  - le document brut n'est ni conserve ni journalise.

Les bornes sont inchangees et toujours appliquees : 2 Mio en octets,
20 000 noeuds, profondeur 100. Un depassement est un REFUS EXPLICITE,
jamais une troncature silencieuse.

RESULTAT HISTORIQUE — ANTERIEUR A PATCH11
Le paragraphe suivant decrit une mesure faite sur une version PRECEDENTE
du connecteur, celle qui neutralisait le HTML. Il est conserve comme
trace, et NE CONSTITUE PAS un test navigateur du build patch11.

  Verification MESUREE, non deduite : le comptage des requetes reellement
  emises a ete execute dans WebKit (Safari 26.6 pour macOS) sur une page
  hostile couvrant img/srcset, iframe/srcdoc, link, script, video/poster,
  audio, source, track, object, embed, input[type=image], SVG image et
  use, CSS url() et @import, en casse melangee, avec entites, et incluant
  les trois contournements par « > » cite : ZERO requete emise, et zero
  attribut reseau present dans le document parse.

Ce resultat valait POUR CE MOTEUR SEULEMENT et POUR CETTE ARCHITECTURE
SEULEMENT. Il n'a pas ete rejoue sur patch11.

ETAT DES TESTS DE CE BUILD
Les suites Node de patch11 ont ete executees par un audit externe et
sont passees integralement (508, 66, 159, 283 assertions, plus un test
reseau reel de 6 assertions, zero echec). Les suites NAVIGATEUR de
patch11 — dont le comptage de sous-requetes par PerformanceObserver —
N'ONT PAS ETE EXECUTEES. Le comportement sur iOS / iPhone reste NON
VALIDE ; Chromium et Gecko n'ont pas ete testes non plus. Les suites
navigateur sont fournies dans le dossier de harnais afin d'etre rejouees
sur chaque moteur cible.

DELAI DE PROPAGATION
GitHub Pages met les pages en cache. Une modification tout juste
publiee peut ne pas etre visible immediatement : la detection n'est pas
instantanee. Reessayer quelques minutes plus tard.

CACHE DE CE BUILD
  system-v0.9.3-production-connectors-rc1-shell
Les caches SYSTEM anterieurs ne sont supprimes qu'a l'activation.
Le worker n'est jamais active automatiquement : il attend une demande
explicite depuis l'interface. Aucun rechargement a la premiere
installation. Le service worker ne met en cache que l'app shell local
same-origin : aucune donnee utilisateur, aucune sauvegarde exportee,
aucun fichier importe, aucune reponse HAL ou Portfolio.

CONFIDENTIALITE — CE QUI SORT ET CE QUI NE SORT PAS
Aucune sauvegarde, aucun export, aucun import, aucune image, aucun etat
SYSTEM, aucun XP, aucune REP et aucune statistique n'est transmis a
quiconque. Aucune requete n'est emise automatiquement.

Deux requetes sortantes existent, seulement sur action explicite :
  - synchronisation HAL : la requete auteur configuree est transmise
    a l'API HAL (api.archives-ouvertes.fr) ;
  - synchronisation Portfolio : une requete GET est envoyee a
    l'hebergeur du site, a l'URL configuree.
Ces requetes utilisent credentials:'omit' et
referrerPolicy:'no-referrer'. Aucun etat local SYSTEM n'y est joint :
ni sauvegarde, ni evenement, ni statistique, ni nom de joueur.
LinkedIn reste entierement manuel : aucune requete.

Les donnees SYSTEM sont conservees localement et sans chiffrement dans
le stockage du navigateur. Une personne ayant acces au profil navigateur
ou a l'appareil peut potentiellement les lire. Un export JSON contient
l'etat personnel complet et doit etre protege par l'utilisateur.
file://, localhost et un domaine HTTPS utilisent des stockages distincts.
La camera est traitee localement ; aucune image n'est conservee.
La reinitialisation efface les cles locales de SYSTEM, y compris les
observations du site, mais pas les backups deja telecharges.

Cles de stockage : SYSTEM_STATE, SYSTEM_STATE_LAST_GOOD, SYSTEM_STATE_V01.
Aucune cle supplementaire n'est creee par le connecteur Portfolio :
l'etat de reference vit dans la sauvegarde normale, donc il est
exporte, importe et reinitialise avec elle.
Format de sauvegarde : SYSTEM_BACKUP, formatVersion 1, schemaVersion 24.

HEADERS SERVEUR RECOMMANDES
Ces en-tetes NE SONT PAS actifs du seul fait de ce README. Ils doivent
etre configures sur le serveur. Aucune CSP n'est appliquee par
l'application et aucune n'a ete testee.

  Referrer-Policy: no-referrer
  X-Content-Type-Options: nosniff
  Permissions-Policy: camera=(self), microphone=(), geolocation=()
  HTTPS en production

Voir README-DEPLOIEMENT-PHASE9.txt pour la procedure complete.
