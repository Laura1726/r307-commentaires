// SERVICE : le seul a toucher aux donnees, ici la base PostgreSQL.
// Il ne connait ni req, ni res, ni HTTP. Il recoit des valeurs, il rend des valeurs,
// ou il lance une erreur. Memes fonctions, memes reponses que la version JSON :
// le routeur et le controleur n'ont pas change.
//
// Les valeurs ne sont JAMAIS collees dans le texte SQL : elles passent par $1, $2...

const pool = require('../db/pool');
const ErreurHttp = require('../utils/erreur-http');

const introuvable = (id) => new ErreurHttp(404, 'COMMENTAIRE_INTROUVABLE', `Le commentaire ${id} n'existe pas.`);
const articleIntrouvable = (id) => new ErreurHttp(404, 'ARTICLE_INTROUVABLE', `L'article ${id} n'existe pas.`);

async function trouver(id) {
  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query('SELECT * FROM commentaires WHERE id = $1', [id]);
  if (resultat.rowCount === 0) throw introuvable(id);
  return resultat.rows[0];
}

async function supprimer(id) {
  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query('DELETE FROM commentaires WHERE id = $1', [id]);
  if (resultat.rowCount === 0) throw introuvable(id);
}

async function modifier(id, { texte }) {
  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query('UPDATE commentaires SET texte = $2 WHERE id = $1 RETURNING *',[id, texte],);
  if (resultat.rowCount === 0) throw introuvable(id);
  return resultat.rows[0];
}

async function lister(articleId) {
  if (!Number.isInteger(articleId)) throw articleIntrouvable(articleId);
  const verif = await pool.query('SELECT 1 FROM articles WHERE id = $1', [articleId]);
  if (verif.rowCount === 0) throw articleIntrouvable(articleId);

  const resultat = await pool.query('SELECT * FROM commentaires WHERE article_id = $1 ORDER BY cree_le',[articleId],);
  return resultat.rows;
}

async function creer(articleId, { nom, texte }) {
  try {
    const resultat = await pool.query(
      'INSERT INTO commentaires (article_id, nom, texte) VALUES ($1, $2, $3) RETURNING *',[articleId, nom, texte],);
    return resultat.rows[0];
  } catch (err) {
    if (err.code === '23503') throw articleIntrouvable(articleId);
    throw err;
  }
}

async function parVisiteur(nom) {
  const resultat = await pool.query(
    `SELECT c.*, a.titre
     FROM commentaires c
     JOIN articles a ON a.id = c.article_id
     WHERE c.nom = $1
     ORDER BY c.cree_le DESC`,[nom],);
  return resultat.rows;
}

module.exports = { lister, trouver, parVisiteur, creer, modifier, supprimer };
