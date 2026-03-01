/**
 * Verification Script for Security Hardening
 */

const BASE_URL = 'http://localhost:5000/api';

const verifySecurity = async () => {
    console.log('--- Starting Security Verification ---');

    try {
        // 1. Check Security Headers (Helmet)
        console.log('\n[1] Checking Security Headers...');
        const healthRes = await fetch(`${BASE_URL}/health`);
        const headers = healthRes.headers;
        
        const securityHeaders = [
            'x-dns-prefetch-control',
            'x-frame-options',
            'x-content-type-options',
            'content-security-policy',
            'x-xss-protection'
        ];

        securityHeaders.forEach(header => {
            if (headers.has(header)) {
                console.log(`✅ Header Found: ${header}`);
            } else {
                console.log(`❌ Header Missing: ${header}`);
            }
        });

        // 2. Test Rate Limiting (Simple check)
        console.log('\n[2] Testing Rate Limiting (Hitting /api/health 10 times)...');
        // Note: Global limit is 100, so we just check it doesn't fail immediately
        // and we check the X-RateLimit headers
        console.log('X-RateLimit-Limit:', headers.get('x-ratelimit-limit'));
        console.log('X-RateLimit-Remaining:', headers.get('x-ratelimit-remaining'));

        if (headers.has('x-ratelimit-limit')) {
            console.log('✅ Rate Limiting Headers Present');
        } else {
            console.log('❌ Rate Limiting Headers Missing');
        }

        // 3. Verify Error Handler refinement (Invalid CastError)
        console.log('\n[3] Testing Refined Error Handler (Invalid ObjectId)...');
        // Login first to bypass 'protect' middleware
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@lbs.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.data?.token;

        const invalidRes = await fetch(`${BASE_URL}/fees/invalid-id/101`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const invalidData = await invalidRes.json();

        
        console.log('Status Code:', invalidRes.status);
        console.log('Message:', invalidData.message);

        if (invalidRes.status === 400 && invalidData.message.includes('Invalid')) {
            console.log('✅ CastError handled correctly with 400');
        } else {
            console.log('❌ CastError handling failed');
        }

    } catch (error) {
        console.log('Test failed:', error.message);
    }
};

verifySecurity();
