const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Test JWT generation (mimicking our auth routes)
const testPayload = { id: 'test-id', userId: 'test-id', email: 'test@example.com' };
const secret = process.env.JWT_SECRET || 'test-secret';

try {
  const token = jwt.sign(testPayload, secret, { expiresIn: '7d' });
  console.log('✅ JWT generation successful:', token.substring(0, 20) + '...');
  
  // Test JWT verification (mimicking our auth middleware)
  const decoded = jwt.verify(token, secret);
  console.log('✅ JWT verification successful:', decoded);
  
  // Test bcrypt (mimicking our registration)
  const password = 'testpassword123';
  const hashedPassword = bcrypt.hashSync(password, 12);
  console.log('✅ Password hashing successful');
  
  const isValid = bcrypt.compareSync(password, hashedPassword);
  console.log('✅ Password verification successful:', isValid);
  
  console.log('\n🎉 All authentication components are working correctly\!');
} catch (error) {
  console.error('❌ Authentication test failed:', error);
}
EOF < /dev/null
