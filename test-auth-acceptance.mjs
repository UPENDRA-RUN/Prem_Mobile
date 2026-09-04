import app from './server/index.js';

const PORT = 5099;
const server = app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`PREM MOBILE — ROLE-BASED AUTH & SECURITY ACCEPTANCE TESTS`);
  console.log(`======================================================\n`);

  const BASE_URL = `http://localhost:${PORT}/api`;

  async function request(endpoint, options = {}) {
    const { headers, ...rest } = options;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {})
      }
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data };
  }

  let passed = 0;
  let total = 12;

  try {
    // 1. Admin Login (Valid)
    console.log('TEST 1: Admin Login with valid credentials');
    const adminRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@premmobile.com', password: 'admin123' })
    });
    if (adminRes.ok && adminRes.data.token && adminRes.data.admin.role === 'ADMIN') {
      console.log('  ✓ PASSED: Admin authenticated with role ADMIN');
      passed++;
    } else {
      console.error('  ✗ FAILED:', adminRes);
    }
    const adminToken = adminRes.data.token;

    // 2. Admin Login (Invalid)
    console.log('\nTEST 2: Admin Login with invalid password');
    const invalidAdmin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@premmobile.com', password: 'wrongpassword' })
    });
    if (invalidAdmin.status === 401 && invalidAdmin.data.success === false) {
      console.log('  ✓ PASSED: Rejected invalid credentials with 401');
      passed++;
    } else {
      console.error('  ✗ FAILED:', invalidAdmin);
    }

    // 3. Customer Login Validation: Empty Credentials (Requirement 4)
    console.log('\nTEST 3: Customer Login empty fields validation');
    const emptyCust = await request('/auth/customer/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: '', password: '' })
    });
    if (emptyCust.status === 400 && emptyCust.data.error === 'Please enter your login details.') {
      console.log('  ✓ PASSED: Friendly message "Please enter your login details."');
      passed++;
    } else {
      console.error('  ✗ FAILED:', emptyCust);
    }

    // 4. Customer Login Validation: Account Not Found (Requirement 4)
    console.log('\nTEST 4: Customer Login non-existent account');
    const notFoundCust = await request('/auth/customer/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'nonexistent_user@gmail.com', password: 'password123' })
    });
    if (notFoundCust.status === 401 && notFoundCust.data.error === 'Account not found. Please create an account.') {
      console.log('  ✓ PASSED: Friendly message "Account not found. Please create an account."');
      passed++;
    } else {
      console.error('  ✗ FAILED:', notFoundCust);
    }

    // 5. Customer Registration (Requirement 3)
    console.log('\nTEST 5: Customer Registration');
    const testEmail = `testuser_${Date.now()}@example.com`;
    const testMobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    const regRes = await request('/auth/customer/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Aman Verma',
        mobile: testMobile,
        email: testEmail,
        password: 'securePassword123',
        confirmPassword: 'securePassword123'
      })
    });
    if (regRes.status === 201 && regRes.data.token && regRes.data.user.role === 'CUSTOMER') {
      console.log('  ✓ PASSED: Customer registered with role CUSTOMER');
      passed++;
    } else {
      console.error('  ✗ FAILED:', regRes);
    }
    const customerToken = regRes.data.token;

    // 6. Customer Login with mobile & password (Requirement 2 & 4)
    console.log('\nTEST 6: Customer Login with mobile number');
    const loginMobileRes = await request('/auth/customer/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: testMobile,
        password: 'securePassword123'
      })
    });
    if (loginMobileRes.ok && loginMobileRes.data.user.name === 'Aman Verma') {
      console.log('  ✓ PASSED: Customer logged in via mobile number');
      passed++;
    } else {
      console.error('  ✗ FAILED:', loginMobileRes);
    }

    // 7. Customer Login with wrong password (Requirement 4)
    console.log('\nTEST 7: Customer Login with incorrect password');
    const wrongPassRes = await request('/auth/customer/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: testEmail,
        password: 'wrongPassword!'
      })
    });
    if (wrongPassRes.status === 401 && wrongPassRes.data.error === 'Incorrect email/mobile number or password.') {
      console.log('  ✓ PASSED: Friendly message "Incorrect email/mobile number or password."');
      passed++;
    } else {
      console.error('  ✗ FAILED:', wrongPassRes);
    }

    // 8. Security Check: Customer Token CANNOT access Admin Endpoints (Requirement 7 & 8)
    console.log('\nTEST 8: Customer token blocked from Admin Product Management (403 Forbidden)');
    const custOnAdmin = await request('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        name: 'Hacked Product',
        category: 'Earbuds',
        regularPrice: 99
      })
    });
    if (custOnAdmin.status === 403 && custOnAdmin.data.error.includes('Access denied')) {
      console.log('  ✓ PASSED: Backend strictly enforced 403 Access Denied on customer');
      passed++;
    } else {
      console.error('  ✗ FAILED:', custOnAdmin);
    }

    // 9. Admin can add product with isFeatured (Requirement 10)
    console.log('\nTEST 9: Admin Product Creation with isFeatured');
    const adminProductRes = await request('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: 'Prem Signature Wireless Neckband Pro',
        category: 'Headphones',
        brand: 'Prem Mobile',
        description: 'Heavy bass stereo wireless neckband with fast charging',
        regularPrice: 899,
        stock: 25,
        isActive: 1,
        isFeatured: 1
      })
    });
    if (adminProductRes.status === 201 && adminProductRes.data.productId) {
      console.log('  ✓ PASSED: Admin created product with isFeatured = 1');
      passed++;
    } else {
      console.error('  ✗ FAILED:', adminProductRes);
    }
    const newProdId = adminProductRes.data.productId;

    // 10. Admin Categories Management (Requirement 9 & 10)
    console.log('\nTEST 10: Admin Category Creation');
    const catRes = await request('/categories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: `Gaming Triggers ${Date.now()}`,
        icon: '🎮'
      })
    });
    if (catRes.status === 201 && catRes.data.category.name.startsWith('Gaming Triggers')) {
      console.log('  ✓ PASSED: Category created successfully without modifying code');
      passed++;
    } else {
      console.error('  ✗ FAILED:', catRes);
    }

    // 11. Customer order creation (Requirement 5)
    console.log('\nTEST 11: Customer Order Placement');
    const orderRes = await request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        customerName: 'Aman Verma',
        mobile: testMobile,
        email: testEmail,
        address: 'B-12 Pinto Park',
        city: 'Gwalior',
        state: 'Madhya Pradesh',
        pincode: '474006',
        items: [{ productId: newProdId, quantity: 2 }]
      })
    });
    if (orderRes.status === 201 && orderRes.data.order.orderNumber) {
      console.log('  ✓ PASSED: Order placed successfully:', orderRes.data.order.orderNumber);
      passed++;
    } else {
      console.error('  ✗ FAILED:', orderRes);
    }

    // 12. Customer fetch my-orders (Requirement 5 & 19)
    console.log('\nTEST 12: Customer My Orders Fetch');
    const myOrdersRes = await request('/orders/my-orders', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    if (myOrdersRes.ok && myOrdersRes.data.orders.length >= 1) {
      console.log('  ✓ PASSED: Customer retrieved their placed orders');
      passed++;
    } else {
      console.error('  ✗ FAILED:', myOrdersRes);
    }

    console.log(`\n======================================================`);
    console.log(`RESULTS: ${passed} / ${total} TESTS PASSED`);
    console.log(`======================================================\n`);
    
    server.close();
    process.exit(passed === total ? 0 : 1);
  } catch (err) {
    console.error('Unexpected test error:', err);
    server.close();
    process.exit(1);
  }
});
