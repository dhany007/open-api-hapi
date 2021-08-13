require('dotenv').config();
const Hapi = require('@hapi/hapi');
const songs = require('./api');
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

  await server.start();
  console.log(`Server listening on ${server.info.uri}`);
};

init();
