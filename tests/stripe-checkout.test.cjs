const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'app/api/stripe/checkout/route.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

// Run the real handler with isolated database and Stripe boundaries.
async function checkout(items) {
  const calls = { sessions: [], batches: [], filters: [] };
  const schema = Object.fromEntries(['cart', 'shopItems', 'orders', 'orderItems'].map(name => [
    name, new Proxy({ table: name }, { get: (target, key) => target[key] ?? `${name}.${key}` }),
  ]));
  const query = {
    from() { return this; },
    innerJoin() { return this; },
    where(filter) { calls.filters.push(filter); return Promise.resolve(items); },
  };
  const modules = {
    'next/server': { NextResponse: {
      json: (body, options) => ({ body, status: options.status }),
      redirect: (url, options) => ({ url, status: options.status }),
    } },
    'next/headers': { headers: async () => new Headers({ origin: 'https://shop.example' }) },
    'drizzle-orm': { eq: (left, right) => [left, right] },
    '@/db/schema': schema,
    '@/db/drizzle': { db: {
      select: () => query,
      insert: table => ({ values: values => ({ table: table.table, values }) }),
      batch: async batch => { calls.batches.push(batch); },
    } },
    '@/lib/stripe': { stripe: { checkout: { sessions: { create: async params => {
      calls.sessions.push(params);
      return { id: 'cs_test', url: 'https://checkout.stripe.com/test' };
    } } } } },
  };
  const sandbox = {
    exports: {}, console, crypto: { randomUUID: () => 'test-order' },
    require: name => {
      if (!(name in modules)) throw new Error(`Unexpected import: ${name}`);
      return modules[name];
    },
  };
  vm.runInNewContext(compiled, sandbox);
  const form = new FormData();
  // No product title or client-supplied price is submitted.
  for (const [key, value] of Object.entries({
    firstName: 'Test', lastName: 'Customer', email: 'test@example.com', phone: '9165550123',
    streetAddress: '123 Main St', city: 'Sacramento', state: 'CA', zipCode: '95814',
  })) form.set(key, value);
  return { response: await sandbox.exports.POST({ formData: async () => form }), calls };
}

const shirt = {
  productId: 'shirt', title: 'Shirt', price: 2500, stripePriceId: 'price_shirt',
  deletedAt: null, size: 'M', quantity: 2,
};

test('checks out database cart items without a hardcoded title and saves the receipt', async () => {
  const { response, calls } = await checkout([
    shirt, { ...shirt, productId: 'cap', title: 'Cap', price: 1500, stripePriceId: 'price_cap', quantity: 1 },
  ]);
  assert.equal(response.status, 303);
  assert.equal(response.url, 'https://checkout.stripe.com/test');
  assert.deepEqual(JSON.parse(JSON.stringify(calls.sessions[0].line_items)), [
    { price: 'price_shirt', quantity: 2 }, { price: 'price_cap', quantity: 1 },
  ]);
  assert.equal(calls.sessions[0].success_url, 'https://shop.example/order-confirmation/test-order');
  assert.equal(calls.filters[0][0], 'cart.userId');
  assert.equal(calls.batches[0][0].values.total, 6500);
  assert.equal(calls.batches[0][1].values.length, 2);
  assert.equal(calls.batches[0][1].values[0].size, 'M');
  assert.equal(calls.batches[0][1].values[0].orderId, 'test-order');
});

for (const [name, items] of [
  ['empty cart', []],
  ['missing Stripe price', [{ ...shirt, stripePriceId: null }]],
  ['payment URL instead of Price ID', [{ ...shirt, stripePriceId: 'https://buy.stripe.com/test' }]],
  ['invalid quantity', [{ ...shirt, quantity: 0 }]],
  ['deleted product', [{ ...shirt, deletedAt: new Date() }]],
]) {
  test(`rejects ${name} before calling Stripe or saving an order`, async () => {
    const { response, calls } = await checkout(items);
    assert.equal(response.status, 400);
    assert.equal(calls.sessions.length, 0);
    assert.equal(calls.batches.length, 0);
  });
}
