import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const users = [];
  const chunkSize = 5000;

  // Генерация данных
  for (let i = 1; i <= 1000000; i++) {
    users.push({
      first_name: `FirstName${i}`,
      last_name: `LastName${i}`,
      age: Math.floor(Math.random() * 50) + 18,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      problems: Math.random() > 0.5,
    });

    if (users.length === chunkSize) {
      await knex.insert(users).into('users');
      users.length = 0;
    }
  }

  if (users.length > 0) {
    await knex.insert(users).into('users');
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('users').truncate();
}
