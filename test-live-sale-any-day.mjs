/**
 * Test Suite: Final Sale Requirement — Admin Controlled Live Sale (Any Day of the Week)
 */

const BASE_URL = 'http://localhost:5173/api';

async function runTests() {
  console.log('======================================================');
  console.log('FINAL SALE REQUIREMENT — ADMIN CONTROLLED LIVE SALE TESTS');
  console.log('======================================================\n');

  // 1. Admin Login
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@premmobile.com', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  if (!loginData.success || !loginData.token) {
    throw new Error('Admin login failed: ' + JSON.stringify(loginData));
  }
  const token = loginData.token;
  console.log('✓ Admin authenticated successfully.');

  // Clean any active live sale first
  await fetch(`${BASE_URL}/sale/admin/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  });

  // TEST 1: Customer sees OFFLINE when no sale is live
  console.log('\nTEST 1: Customer sees OFFLINE before activation.');
  const pubRes1 = await fetch(`${BASE_URL}/sale`);
  const pubData1 = await pubRes1.json();
  if (pubData1.isLive === false && pubData1.status === 'OFFLINE') {
    console.log(`  ✓ PASSED: Customer sees OFFLINE status. Message: ${pubData1.message}`);
  } else {
    throw new Error(`Test 1 failed: Expected OFFLINE, got: ${JSON.stringify(pubData1)}`);
  }

  // TEST 2: Admin configures sale for a Wednesday (ANY day of the week)
  console.log('\nTEST 2: Admin can configure sale for ANY day (e.g. Wednesday 10 Sept to Friday 12 Sept).');
  const saveRes = await fetch(`${BASE_URL}/sale/admin/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: 'Mega Wednesday Dhamaka',
      startDate: '2026-09-09', // Wednesday
      endDate: '2026-09-11',   // Friday
      startTime: '10:00',
      endTime: '20:00',
      items: [
        { productId: 1, salePrice: 699 }, // Regular 1249
        { productId: 2, salePrice: 449 }  // Regular 799
      ]
    })
  });
  const saveData = await saveRes.json();
  if (saveData.success && (saveData.status === 'READY' || saveData.status === 'DRAFT')) {
    console.log(`  ✓ PASSED: Sale created for Wednesday. Status is READY. Name: "${saveData.sale.name}"`);
  } else {
    throw new Error(`Test 2 failed: ${JSON.stringify(saveData)}`);
  }

  // TEST 3: Saving or scheduling does NOT activate the sale
  console.log('\nTEST 3: Saving/scheduling does NOT activate the sale (status remains OFFLINE for customers).');
  const pubRes2 = await fetch(`${BASE_URL}/sale`);
  const pubData2 = await pubRes2.json();
  if (pubData2.isLive === false) {
    console.log('  ✓ PASSED: Customer still sees OFFLINE. No automatic activation!');
  } else {
    throw new Error('Test 3 failed: Sale automatically activated on save!');
  }

  // TEST 4: Unauthorized customer cannot call GO LIVE
  console.log('\nTEST 4: Customer cannot activate the sale without admin auth.');
  const unauthRes = await fetch(`${BASE_URL}/sale/admin/go-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ saleId: saveData.sale.id })
  });
  if (unauthRes.status === 401) {
    console.log('  ✓ PASSED: Unauthorized request strictly rejected with 401.');
  } else {
    throw new Error(`Test 4 failed: Expected 401, got ${unauthRes.status}`);
  }

  // TEST 5: Admin explicitly clicks GO LIVE
  console.log('\nTEST 5: Admin explicitly clicks GO LIVE -> sale becomes LIVE.');
  const liveRes = await fetch(`${BASE_URL}/sale/admin/go-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ saleId: saveData.sale.id })
  });
  const liveData = await liveRes.json();
  if (liveData.success && liveData.status === 'LIVE') {
    console.log(`  ✓ PASSED: Sale activated by Admin! Message: ${liveData.message}`);
  } else {
    throw new Error(`Test 5 failed: ${JSON.stringify(liveData)}`);
  }

  // TEST 6: Customer now sees LIVE sale on Wednesday
  console.log('\nTEST 6: Customer website immediately shows LIVE sale.');
  const pubRes3 = await fetch(`${BASE_URL}/sale`);
  const pubData3 = await pubRes3.json();
  if (pubData3.isLive === true && pubData3.items.length === 2) {
    console.log(`  ✓ PASSED: Sale is LIVE for customers! Showing ${pubData3.items.length} discounted products.`);
    const item1 = pubData3.items.find(i => i.productId === 1);
    console.log(`    Product #1: Regular ₹${item1.regularPrice} -> Sale ₹${item1.salePrice} (Save ₹${item1.savings})`);
  } else {
    throw new Error(`Test 6 failed: ${JSON.stringify(pubData3)}`);
  }

  // TEST 7: Server-side price integrity on checkout
  console.log('\nTEST 7: Order checkout verifies server-side sale price.');
  const orderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Rohit Sharma',
      mobile: '9876543210',
      address: 'Shop 12, Pinto Park',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      pincode: '474005',
      items: [{ productId: 1, quantity: 1, price: 10 }] // Tampered client price ₹10
    })
  });
  const orderData = await orderRes.json();
  if (orderData.success && orderData.order.total === 699) {
    console.log(`  ✓ PASSED: Server ignored tampered ₹10 and charged verified sale price ₹699.`);
  } else {
    throw new Error(`Test 7 failed: ${JSON.stringify(orderData)}`);
  }

  // TEST 8: Only ONE active sale allowed (Requirement 12)
  console.log('\nTEST 8: Only ONE active sale allowed. Conflict rejected if another is live.');
  // Create another sale
  const saveSecondRes = await fetch(`${BASE_URL}/sale/admin/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: 'Conflicting Friday Sale',
      startDate: '2026-09-12',
      endDate: '2026-09-12',
      items: [{ productId: 3, salePrice: 199 }]
    })
  });
  const secondSaleData = await saveSecondRes.json();
  // Try to go live with second sale while first is still LIVE
  const conflictRes = await fetch(`${BASE_URL}/sale/admin/go-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ saleId: secondSaleData.sale.id })
  });
  const conflictData = await conflictRes.json();
  if (conflictRes.status === 400 && conflictData.error?.includes('currently live')) {
    console.log(`  ✓ PASSED: Conflict caught! "${conflictData.error}"`);
  } else {
    throw new Error(`Test 8 failed: Expected conflict rejection, got: ${JSON.stringify(conflictData)}`);
  }

  // TEST 9: Admin clicks END SALE -> sale disappears from customer view
  console.log('\nTEST 9: Admin clicks END SALE -> status becomes ENDED.');
  const endRes = await fetch(`${BASE_URL}/sale/admin/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ saleId: saveData.sale.id })
  });
  const endData = await endRes.json();
  if (endData.success && endData.status === 'ENDED') {
    console.log(`  ✓ PASSED: Sale ended. Message: ${endData.message}`);
  } else {
    throw new Error(`Test 9 failed: ${JSON.stringify(endData)}`);
  }

  // TEST 10: Customer sees OFFLINE immediately after end
  console.log('\nTEST 10: Customer sees OFFLINE immediately after sale ends.');
  const pubRes4 = await fetch(`${BASE_URL}/sale`);
  const pubData4 = await pubRes4.json();
  if (pubData4.isLive === false && pubData4.status === 'OFFLINE') {
    console.log('  ✓ PASSED: Customer immediately sees OFFLINE.');
  } else {
    throw new Error('Test 10 failed: Customer still sees live sale!');
  }

  // TEST 11: Product regular prices remain untouched
  console.log('\nTEST 11: Normal product prices remain intact without permanent overwrite.');
  const prodRes = await fetch(`${BASE_URL}/products/1`);
  const prodData = await prodRes.json();
  if (prodData.product.regularPrice === 1249) {
    console.log(`  ✓ PASSED: Regular price remains exactly ₹1249 in catalog.`);
  } else {
    throw new Error(`Test 11 failed: Price was overwritten: ${JSON.stringify(prodData)}`);
  }

  console.log('\n======================================================');
  console.log('ALL 11 ADMIN CONTROLLED LIVE SALE TESTS PASSED!');
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
