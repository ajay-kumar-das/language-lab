console.log('Testing auth route import...');
try {
  const authRoutes = require('./src/routes/auth');
  console.log('✅ Auth routes imported successfully');
  console.log('✅ Auth routes object:', typeof authRoutes.default);
} catch (error) {
  console.error('❌ Auth routes import failed:', error.message);
}
TESTEND < /dev/null
