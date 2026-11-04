// SERVICE des commentaires · VERSION FICHIER JSON (celle de depart).
// Elle respecte le contrat (CONTRAT.md) : le cote API peut s'en servir tout de suite pour tester
// ses routes. Le cote base la remplace par une version PostgreSQL, avec les MEMES fonctions.
// Les articles, eux, sont deja dans PostgreSQL (services/articles.service.js).

const pool = require('../db/pool');
const ErreurHttp = require('../utils/erreur-http');
 
const introuvable = (id) =>
  new ErreurHttp(404, 'COMMENTAIRE_INTROUVABLE', `Le commentaire ${id} n'existe pas.`);
const articleIntrouvable = (id) =>
  new ErreurHttp(404, 'ARTICLE_INTROUVABLE', `L'article ${id} n'existe pas.`);
 
async function lister(articleId) {
  if (!Number.isInteger(articleId)) throw articleIntrouvable(articleId);
  const verif = await pool.query('SELECT 1 FROM articles WHERE id = $1', [articleId]);
  if (verif.rowCount === 0) throw articleIntrouvable(articleId);
 
  const resultat = await pool.query(
    'SELECT * FROM commentaires WHERE article_id = $1 ORDER BY cree_le',[articleId],);
  return resultat.rows;
}
 
async function trouver(id) {
  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query('SELECT * FROM commentaires WHERE id = $1', [id]);
  if (resultat.rowCount === 0) throw introuvable(id);
  return resultat.rows[0];
}
 
async function parVisiteur(nom) {
  const resultat = await pool.query(
    `SELECT c.*, a.titre
     FROM commentaires c
     JOIN articles a ON a.id = c.article_id
     WHERE c.nom = $1
     ORDER BY c.cree_le DESC`,
    [nom],);
  return resultat.rows;
}

async function creer(articleId, { nom, texte }) {
  if (!Number.isInteger(articleId)) throw articleIntrouvable(articleId);
  try {
    const resultat = await pool.query('INSERT INTO commentaires (article_id, nom, texte) VALUES ($1, $2, $3) RETURNING *',[articleId, nom, texte], );
    return resultat.rows[0];
  } catch (err) {
    if (err.code === '23503') throw articleIntrouvable(articleId);
    throw err;
  }
}

async function modifier(id, { texte }) {
  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query('UPDATE commentaires SET texte = $2 WHERE id = $1 RETURNING *',[id, texte],);
  if (resultat.rowCount === 0) throw introuvable(id);
  return resultat.rows[0];
}
 
async function supprimer(id) {
  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query('DELETE FROM commentaires WHERE id = $1', [id]);
  if (resultat.rowCount === 0) throw introuvable(id);
}
 
module.exports = { lister, trouver, parVisiteur, creer, modifier, supprimer };