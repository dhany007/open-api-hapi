const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapDBToModel } = require('../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const query = 'SELECT id, title, performer FROM songs';
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editSongById(songId, { title, year, performer, genre, duration }) {
    const query = {
      text: 'UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5 WHERE id=$6 RETURNING id',
      values: [title, year, performer, genre, duration, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async deleteSongById(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. ID tidak ditemukan');
    }
  }
}

module.exports = SongsService;
