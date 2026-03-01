/**
 * Verification Script for PDF Receipts
 */

const fs = require('fs');

const BASE_URL = 'http://localhost:5000/api';

const testPdfReceipt = async () => {
    console.log('--- Starting PDF Receipt Verification ---');

    try {
        // 1. Login Admin
        console.log('\n[1] Logging in Admin...');
        const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@lbs.com', password: 'password123' })
        });
        const adminLoginData = await adminLogin.json();
        const token = adminLoginData.data?.token;

        if (!token) {
            console.log('Admin login failed.');
            return;
        }

        // 2. Get a student (using the one from previous tests)
        console.log('\n[2] Fetching Students...');
        const studentsRes = await fetch(`${BASE_URL}/students`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const studentsData = await studentsRes.json();
        const student = studentsData.data?.students?.[0];

        if (!student) {
            console.log('No student found to test.');
            return;
        }

        // 3. Record a payment and get receipt URL
        console.log('\n[3] Recording Payment and Generating PDF...');
        const payRes = await fetch(`${BASE_URL}/fees/pay`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                studentId: student._id,
                amount: 2500,
                type: 'Transport',
                transactionId: `PDF-TXN-${Date.now()}`,
                remarks: 'Testing PDF generation'
            })
        });
        const payData = await payRes.json();
        
        console.log('Status:', payRes.status);
        console.log('Receipt URL:', payData.data?.receiptUrl);

        if (payData.data?.receiptUrl) {
            console.log('SUCCESS: Receipt URL generated.');
        } else {
            console.log('FAILED: No receipt URL in response.');
            console.log('Response Message:', payData.message);
        }

    } catch (error) {
        console.log('Test failed:', error.message);
    }
};

testPdfReceipt();
