
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('product_actions_history', (table) => {
        table.increments('id');
        table.integer('shop_id');
        table.integer('product_id');
        table.string('action').notNullable();
        table.timestamp('action_date').defaultTo(knex.fn.now());
        table.json('data');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
   await knex.schema.dropTableIfExists('product_actions_history');
};
