import {dbConfig} from './common/pg.config.mjs';

export default {
  migrations: {
    extension: 'mjs',
    loadExtensions: ['.mjs']
  },
  ...dbConfig
};
