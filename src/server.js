require('dotenv').config();
const Hapi = require('@hapi/hapi');
const songs = require('./api');
const ClientError = require('./exceptions/ClientError');
const SongsServices = require('./services/SongsService');
const SongsValidator = require('./validator/index');

const init = async () => {
  const songsServices = new SongsServices();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsServices,
      validator: SongsValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse =  h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse
    }
    // jika bukan ClientError, lanjutkan dengan response sebelumnya
    return response.continue || response;
  })

  await server.start();
  console.log(`Server listening on ${server.info.uri}`);
};

init();
