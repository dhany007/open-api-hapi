const ClientError = require('../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);

      const { title = 'untitled', year, performer, genre, duration } = request.payload;
      // const duration = parseInt(request.payload.duration, 10);

      const songId = await this._service.addSong({ title, year, performer, genre, duration });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
        },
      });
      response.code(201);

      return response;
    } catch (error) {
      // error yang telah kita buat tadi
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);

        return response;
      }

      // khusus server error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();

    const response = {
      status: 'success',
      data: {
        songs,
      },
    };

    return response;
  }

  async getSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;

      const song = await this._service.getSongById(songId);

      const response = h.response({
        status: 'success',
        data: {
          song,
        },
      });
      response.code(200);

      return response;
    } catch (error) {
      // error yang telah kita buat tadi
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);

        return response;
      }

      // khusus server error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);

      const { songId } = request.params;
      const { title, year, performer, genre, duration } = request.payload;

      await this._service.editSongById(songId, { title, year, performer, genre, duration });

      const response = {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      };

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);

        return response;
      }

      // khusus server error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;

      await this._service.deleteSongById(songId);

      const response = {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);

        return response;
      }

      // khusus server error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);

      return response;
    }
  }
}

module.exports = SongsHandler;
