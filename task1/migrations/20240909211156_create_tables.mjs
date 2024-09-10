/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('products', (table) => {
        table.increments('id');
        table.uuid('plu').defaultTo(knex.raw('gen_random_uuid()')).unique().notNullable();
        table.string('name').notNullable();
        table.timestamps(true, true);
    });

    await knex.schema.createTable('shops', (table) => {
        table.increments('id');
        table.string('name').notNullable();
        table.timestamps(true, true);
    });

    // таблица остатков (stocks)
    await knex.schema.createTable('stocks', (table) => {
        table.increments('id');
        table
            .integer('product_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('products')
            .onDelete('CASCADE')
        table
            .integer('shop_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('shops')
            .onDelete('CASCADE')
        table.integer('stock_quantity').defaultTo(0).notNullable(); // количество товара на полке
        table.integer('order_quantity').defaultTo(0).notNullable(); // количество товара в заказе
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.dropTableIfExists('stocks');
    await knex.schema.dropTableIfExists('shops');
    await knex.schema.dropTableIfExists('products');
};
