import {dbConfig} from './apps/product-service/repositories/pg.config.mjs';

export default {
  migrations: {
    extension: 'mjs',
    loadExtensions: ['.mjs']
  },
  ...dbConfig
};
