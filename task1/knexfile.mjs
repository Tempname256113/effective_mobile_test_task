import {dbConfig} from './common/db/pg.config.mjs';

export default {
  migrations: {
    extension: 'mjs',
    loadExtensions: ['.mjs']
  },
  ...dbConfig
};
