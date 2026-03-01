/**
 * Verification Script for Secure Auth
 * 
 * Tests:
 * 1. Register Admin
 * 2. Register Teacher
 * 3. Login Admin -> Get Token
 * 4. Login Teacher -> Get Token
 * 5. Access Protected Route (Me) with both tokens
 * 6. Access Admin Dashboard with Admin token (Success)
 * 7. Access Admin Dashboard with Teacher token (Failure)
 */

const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, 'test_results.log');

const log = (...args) => {
    const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
};


const BASE_URL = 'http://localhost:5000/api';

if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

const testAuth = async () => {
    log('--- Starting Auth Verification ---');


    try {
        // 1. Register Admin
        log('\n[1] Registering Admin...');
        const adminReg = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Admin User',
                email: 'admin@lbs.com',
                password: 'password123',
                role: 'admin'
            })
        });
        const adminRegData = await adminReg.json();
        log('Admin Register Status:', adminReg.status, adminRegData.message);

        // 2. Register Teacher
        log('\n[2] Registering Teacher...');
        const teacherReg = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Teacher User',
                email: 'teacher@lbs.com',
                password: 'password123',
                role: 'teacher'
            })
        });
        const teacherRegData = await teacherReg.json();
        log('Teacher Register Status:', teacherReg.status, teacherRegData.message);

        // 3. Login Admin
        log('\n[3] Logging in Admin...');
        const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@lbs.com',
                password: 'password123'
            })
        });
        const adminLoginData = await adminLogin.json();
        const adminToken = adminLoginData.data?.token;
        log('Admin Login Status:', adminLogin.status, adminToken ? 'Token Received' : 'No Token');

        // 4. Login Teacher
        log('\n[4] Logging in Teacher...');
        const teacherLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'teacher@lbs.com',
                password: 'password123'
            })
        });
        const teacherLoginData = await teacherLogin.json();
        const teacherToken = teacherLoginData.data?.token;
        log('Teacher Login Status:', teacherLogin.status, teacherToken ? 'Token Received' : 'No Token');

        // 5. Test Protected Route (/me)
        if (adminToken) {
            log('\n[5a] Testing /auth/me with Admin Token...');
            const meAdmin = await fetch(`${BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            log('Admin /me Status:', meAdmin.status);
        }

        // 6. Test Admin Dashboard with Admin Token
        if (adminToken) {
            log('\n[6] Testing /admin/dashboard with Admin Token (Should be 200)...');
            const adminDash = await fetch(`${BASE_URL}/admin/dashboard`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            log('Admin Dashboard Status:', adminDash.status);
        }

        // 7. Test Admin Dashboard with Teacher Token
        if (teacherToken) {
            log('\n[7] Testing /admin/dashboard with Teacher Token (Should be 403)...');
            const teacherAdminDash = await fetch(`${BASE_URL}/admin/dashboard`, {
                headers: { 'Authorization': `Bearer ${teacherToken}` }
            });
            log('Teacher accessing Admin Dashboard Status:', teacherAdminDash.status);
        }

        // 8. Test Teacher Dashboard with Teacher Token
        if (teacherToken) {
            log('\n[8] Testing /teacher/dashboard with Teacher Token (Should be 200)...');
            const teacherDash = await fetch(`${BASE_URL}/teacher/dashboard`, {
                headers: { 'Authorization': `Bearer ${teacherToken}` }
            });
            log('Teacher Dashboard Status:', teacherDash.status);
        }

        // 9. Test Teacher Dashboard with Admin Token
        if (adminToken) {
            log('\n[9] Testing /teacher/dashboard with Admin Token (Should be 403)...');
            const adminTeacherDash = await fetch(`${BASE_URL}/teacher/dashboard`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            log('Admin accessing Teacher Dashboard Status:', adminTeacherDash.status);
        }


    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

testAuth();
