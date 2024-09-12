import {dbConfig} from './common/db/knex.config.mjs';

export default {
  migrations: {
    extension: 'mjs',
    loadExtensions: ['.mjs']
  },
  ...dbConfig
};
