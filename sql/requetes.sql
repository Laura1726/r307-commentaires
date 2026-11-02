-- =============================================================================
-- PARTIE A · Question 3 · Six requetes
-- Sous chaque question : votre requete, puis le resultat obtenu, en commentaire.
-- =============================================================================

-- R1. Les commentaires de l'article 2, du plus recent au plus ancien : nom, texte.

SELECT nom,texte FROM commentaires
WHERE article_id=2
ORDER BY nom, texte DESC;


-- R2. Le nombre de commentaires de CHAQUE article, y compris ceux qui n'en ont aucun :
--     id, titre, nb_commentaires.

SELECT a.id, a.titre, COUNT(c.id) AS nb_commentaires
FROM articles a
LEFT JOIN commentaires c ON c.article_id = a.id
GROUP BY (a.id);

-- R3. Les articles qui n'ont aucun commentaire : id, titre.
SELECT a.id, a.titre
FROM articles a
LEFT JOIN commentaires c ON c.article_id = a.id
WHERE c.texte IS NULL;


-- R4. Pour chaque auteur, le nombre total de commentaires recus sur ses articles,
--     du plus commente au moins commente.
SELECT aut.prenom, COUNT(c.id) AS nb_commentaires_total
FROM articles a
LEFT JOIN commentaires c ON c.article_id = a.id
JOIN auteurs aut ON a.auteur_id=aut.id
GROUP BY (aut.id, aut.prenom)
ORDER BY nb_commentaires_total DESC;


-- R5. Les visiteurs (nom) qui ont commente plus d'un article.
SELECT nom
FROM commentaires
GROUP BY nom
HAVING COUNT(DISTINCT article_id) > 1;


-- R6. Les trois commentaires les plus recents, avec le titre de leur article.
SELECT com.nom, com.texte, com.cree_le, a.titre
FROM commentaires com
JOIN articles a ON com.article_id = a.id
ORDER BY com.cree_le DESC
LIMIT 3;
