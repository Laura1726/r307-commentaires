-- =============================================================================
-- PARTIE A · Question 3 · Six requetes
-- Sous chaque question : votre requete, puis le resultat obtenu, en commentaire.
-- =============================================================================

-- R1. Les commentaires de l'article 2, du plus recent au plus ancien : nom, texte.

SELECT nom,texte FROM commentaires
WHERE article_id=2
ORDER BY nom, texte DESC;

"nom"	"texte"
"Hugo"	"Le noyer est magnifique. Combien de temps pour le séchage ?"
"Inès"	"Des photos de la pose seraient les bienvenues."


-- R2. Le nombre de commentaires de CHAQUE article, y compris ceux qui n'en ont aucun :
--     id, titre, nb_commentaires.

SELECT a.id, a.titre, COUNT(c.id) AS nb_commentaires
FROM articles a
LEFT JOIN commentaires c ON c.article_id = a.id
GROUP BY (a.id);

"id"	"titre"	"nb_commentaires"
4	"Restaurer une chaise paillée"	1
6	"Affûter ses ciseaux à bois"	0
2	"Une bibliothèque sur mesure à Besançon"	2
3	"Huile ou vernis : ce qui protège vraiment"	0
5	"Une cuisine en chêne massif à Dole"	2
1	"Choisir son bois pour une table de jardin"	3

-- R3. Les articles qui n'ont aucun commentaire : id, titre.
SELECT a.id, a.titre
FROM articles a
LEFT JOIN commentaires c ON c.article_id = a.id
WHERE c.texte IS NULL;

"id"	"titre"
6	"Affûter ses ciseaux à bois"
3	"Huile ou vernis : ce qui protège vraiment"


-- R4. Pour chaque auteur, le nombre total de commentaires recus sur ses articles,
--     du plus commente au moins commente.
SELECT aut.prenom, COUNT(c.id) AS nb_commentaires_total
FROM articles a
LEFT JOIN commentaires c ON c.article_id = a.id
JOIN auteurs aut ON a.auteur_id=aut.id
GROUP BY (aut.id, aut.prenom)
ORDER BY nb_commentaires_total DESC;

"prenom"	"nb_commentaires_total"
"Marc"	5
"Théo"	2
"Sophie"	1

-- R5. Les visiteurs (nom) qui ont commente plus d'un article.
SELECT nom
FROM commentaires
GROUP BY nom
HAVING COUNT(DISTINCT article_id) > 1;

"nom"
"Claire"


-- R6. Les trois commentaires les plus recents, avec le titre de leur article.
SELECT com.nom, com.texte, com.cree_le, a.titre
FROM commentaires com
JOIN articles a ON com.article_id = a.id
ORDER BY com.cree_le DESC
LIMIT 3;

"nom"	"texte"	"cree_le"	"titre"
"Karim"	"Superbe travail."	"2026-10-18 19:47:00+02"	"Une cuisine en chêne massif à Dole"
"Claire"	"Aucune vis visible : comment sont fixés les caissons ?"	"2026-10-16 14:22:00+02"	"Une cuisine en chêne massif à Dole"
"Lucie"	"J'ai une chaise à faire refaire, vous prenez les commandes ?"	"2026-10-09 09:00:00+02"	"Restaurer une chaise paillée"