const BASE_URL = 'http://localhost:5173/api';

async function request(endpoint, options = {}) {
  const { headers, ...rest } = options;
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {})
    }
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}


let adminToken = '';

async function runTests() {
  console.log('\n======================================================');
  console.log('PREM MOBILE — SUNDAY SALE ACCEPTANCE TESTS (15 SCENARIOS)');
  console.log('======================================================\n');

  let passed = 0;
  let total = 13;

  // 0. Login Admin
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@premmobile.com', password: 'admin123' })
  });
  if (!loginRes.ok || !loginRes.data?.token) {
    throw new Error('Failed to log in as admin: ' + JSON.stringify(loginRes.data));
  }
  adminToken = loginRes.data.token;
  const adminHeaders = { Authorization: `Bearer ${adminToken}` };
  console.log('✓ Admin authenticated successfully.');

  async function setDay(day) {
    const res = await request('/settings', {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ simulated_day: day })
    });
    if (!res.ok) throw new Error('Failed to set simulated day: ' + JSON.stringify(res.data));
  }

  // --- TEST 1: Monday -> Sunday Sale must be OFF ---
  console.log('\nTEST 1: Monday → Sunday Sale must be OFF.');
  await setDay('MONDAY');
  const resT1 = await request('/sunday-sale');
  if (resT1.data.isLive === false && resT1.data.status === 'OFF') {
    console.log('  ✓ PASSED: Sale is OFF on Monday.');
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT1.data);
  }

  // --- TEST 2: Tuesday -> Admin cannot activate Sunday Sale ---
  console.log('\nTEST 2: Tuesday → Admin cannot activate Sunday Sale.');
  await setDay('TUESDAY');
  const resT2 = await request('/sunday-sale/admin/go-live', {
    method: 'POST',
    headers: adminHeaders
  });
  if (resT2.status === 400 && resT2.data.error?.includes('only be activated on Sunday')) {
    console.log('  ✓ PASSED: Activation rejected on Tuesday. Error:', resT2.data.error);
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT2);
  }

  // --- TEST 3: Saturday -> Sale remains OFF ---
  console.log('\nTEST 3: Saturday → Sale remains OFF.');
  await setDay('SATURDAY');
  const resT3 = await request('/sunday-sale');
  if (resT3.data.isLive === false && resT3.data.status === 'OFF') {
    console.log('  ✓ PASSED: Sale is OFF on Saturday.');
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT3.data);
  }

  // --- TEST 4: Sunday -> Admin can prepare sale ---
  console.log('\nTEST 4: Sunday → Admin can prepare sale.');
  await setDay('SUNDAY');
  const resT4 = await request('/sunday-sale/admin', { headers: adminHeaders });
  if (resT4.ok && resT4.data.candidateProducts?.length > 0) {
    console.log(`  ✓ PASSED: Admin inspected ${resT4.data.candidateProducts.length} candidate products.`);
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT4.data);
  }

  // --- TEST 5: Sunday -> Admin sets products and prices ---
  console.log('\nTEST 5: Sunday → Admin sets products and prices.');
  const testProduct = resT4.data.candidateProducts[0];
  const regularPrice = testProduct.regularPrice;
  const sundaySpecialPrice = 699;

  const resT5 = await request('/sunday-sale/admin', {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      items: [
        { productId: testProduct.id, salePrice: sundaySpecialPrice }
      ]
    })
  });
  if (resT5.ok && resT5.data.success) {
    console.log(`  ✓ PASSED: Saved Sunday sale for product #${testProduct.id} at ₹${sundaySpecialPrice} (Regular: ₹${regularPrice}).`);
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT5.data);
  }

  // --- TEST 6: Sunday -> Sale remains OFF until GO LIVE is clicked ---
  console.log('\nTEST 6: Sunday → Sale remains OFF until GO LIVE is clicked.');
  const resT6 = await request('/sunday-sale');
  if (resT6.data.isLive === false && resT6.data.customerState === 'SUNDAY_PREPARING') {
    console.log("  ✓ PASSED: Customer sees 'Getting Ready' state before GO LIVE:", resT6.data.message);
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT6.data);
  }

  // --- TEST 7: Sunday -> Admin clicks GO LIVE → customer sees sale ---
  console.log('\nTEST 7: Sunday → Admin clicks GO LIVE → customer sees sale.');
  const resT7Live = await request('/sunday-sale/admin/go-live', {
    method: 'POST',
    headers: adminHeaders
  });
  const resT7Cust = await request('/sunday-sale');
  if (resT7Live.ok && resT7Cust.data.isLive === true && resT7Cust.data.products?.length > 0) {
    console.log(`  ✓ PASSED: Sale is LIVE! Customer sees ${resT7Cust.data.products.length} products. Message:`, resT7Cust.data.message);
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT7Cust.data);
  }

  // --- TEST 8: Customer cannot activate the sale ---
  console.log('\nTEST 8: Customer cannot activate the sale.');
  const resT8 = await request('/sunday-sale/admin/go-live', {
    method: 'POST' // No auth header
  });
  if (resT8.status === 401) {
    console.log('  ✓ PASSED: Unauthorized request safely rejected with 401.');
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT8);
  }

  // --- TEST 9: Customer cannot modify prices ---
  console.log('\nTEST 9: Customer cannot modify prices (tampered price ignored during live sale).');
  const resT9 = await request('/orders', {
    method: 'POST',
    body: JSON.stringify({
      customerName: 'Rahul Sharma',
      mobile: '9876543210',
      address: 'Pinto Park, Gwalior',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      pincode: '474005',
      items: [
        { productId: testProduct.id, quantity: 1, price: 10 } // Tampered ₹10
      ]
    })
  });
  if (resT9.ok && resT9.data.order?.total === sundaySpecialPrice) {
    console.log(`  ✓ PASSED: Server ignored tampered ₹10 and enforced verified Sunday price ₹${resT9.data.order.total}!`);
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT9.data);
  }

  // --- TEST 10: Admin clicks END SALE → sale disappears from customer view ---
  console.log('\nTEST 10: Admin clicks END SALE → sale disappears from customer view.');
  const resT10End = await request('/sunday-sale/admin/end', {
    method: 'POST',
    headers: adminHeaders
  });
  const resT10Cust = await request('/sunday-sale');
  if (resT10End.ok && resT10Cust.data.isLive === false) {
    console.log('  ✓ PASSED: Sale ended. Customer sees offline status.');
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT10Cust.data);
  }

  // --- TEST 11: Monday after an active Sunday → sale automatically becomes unavailable ---
  console.log('\nTEST 11: Monday after an active Sunday → sale automatically becomes unavailable.');
  // Go live again on Sunday
  await request('/sunday-sale/admin/go-live', { method: 'POST', headers: adminHeaders });
  // Monday arrives automatically without admin ending
  await setDay('MONDAY');
  const resT11 = await request('/sunday-sale');
  if (resT11.data.isLive === false && resT11.data.status === 'OFF') {
    console.log('  ✓ PASSED: Automatic Weekly Reset: On Monday, customer status is strictly OFF!');
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT11.data);
  }

  // --- TEST 12: Normal product prices remain unchanged after Sunday Sale ends ---
  console.log('\nTEST 12: Normal product prices remain unchanged after Sunday Sale ends.');
  const resT12 = await request(`/products/${testProduct.id}`);
  if (resT12.data.product?.regularPrice === regularPrice && resT12.data.product?.currentPrice === regularPrice) {
    console.log(`  ✓ PASSED: Regular price remains exactly ₹${regularPrice} without permanent overwrite.`);
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT12.data);
  }

  // --- TEST 13: Customer cannot manipulate price through browser developer tools on regular day ---
  console.log('\nTEST 13: Customer cannot manipulate price on regular day.');
  const resT13 = await request('/orders', {
    method: 'POST',
    body: JSON.stringify({
      customerName: 'Vikram Singh',
      mobile: '9876543210',
      address: 'City Center',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      pincode: '474011',
      items: [
        { productId: testProduct.id, quantity: 2, price: 1 } // Customer tries paying ₹1 each
      ]
    })
  });
  const expectedTotal = regularPrice * 2;
  if (resT13.ok && resT13.data.order?.total === expectedTotal) {
    console.log(`  ✓ PASSED: Order strictly recalculated to ₹${expectedTotal} by server (ignored ₹1 tampered price).`);
    passed++;
  } else {
    console.error('  ✗ FAILED:', resT13.data);
  }

  // Reset day setting back to REAL
  await setDay('REAL');
  console.log('\nReset simulation back to REAL day mode.');

  console.log('\n======================================================');
  console.log(`RESULTS: ${passed}/${total} BACKEND ACCEPTANCE TESTS PASSED!`);
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
