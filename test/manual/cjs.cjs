/**
 * Manual test — CJS (Node.js)
 *
 * Requires a build: npm run build
 * Run: node test/manual/cjs.cjs
 */

const { Neysla } = require('../../dist/cjs/index.cjs');

async function run() {
  // Test 1: GET directo
  console.log('--- Test 1: Neysla.get ---');
  const get = await Neysla.get({ url: 'https://jsonplaceholder.typicode.com/todos/1' });
  console.log('status:', get.status);
  console.log('data:', get.data);

  // Test 2: POST directo con body
  console.log('\n--- Test 2: Neysla.post ---');
  const post = await Neysla.post({
    url: 'https://jsonplaceholder.typicode.com/posts',
    requestType: 'json',
    body: { title: 'Neysla v4', body: 'test', userId: 1 },
  });
  console.log('status:', post.status);
  console.log('data:', post.data);

  // Test 3: Error handling
  console.log('\n--- Test 3: Error handling (404) ---');
  try {
    await Neysla.get({ url: 'https://jsonplaceholder.typicode.com/todos/9999999' });
  } catch (err) {
    console.log('status:', err.status);
    console.log('caught correctly ✓');
  }

  // Test 4: Neysla.init + setModel
  console.log('\n--- Test 4: neysla.init + setModel ---');
  const neysla = new Neysla();
  const { todos } = await neysla.init({ name: 'todos', url: 'https://jsonplaceholder.typicode.com' });
  const todosModel = todos.setModel('todos');
  const modelGet = await todosModel.get({ id: 1 });
  console.log('status:', modelGet.status);
  console.log('data:', modelGet.data);

  console.log('\n✓ All manual tests passed');
}

run().catch(console.error);
