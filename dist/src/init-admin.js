import bcrypt from 'bcryptjs';
import prisma from './config/database.js';
async function initializeFirstAdmin() {
    try {
        console.log('🚀 Starting admin initialization...');
        console.log('');
        // Check if any admin exists
        const existingAdmin = await prisma.admin.findFirst();
        if (existingAdmin) {
            console.log('⚠️  Admin already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('');
            console.log('If you forgot your password, you can reset it in the database.');
            return;
        }
        console.log('📝 Creating first admin account...');
        // Hash the password
        const hashedPassword = await bcrypt.hash('ChiKukw@stra', 10);
        // Create the admin
        const admin = await prisma.admin.create({
            data: {
                email: 'stategicbuilderss@gmail.com',
                password: hashedPassword,
                phone: '', // or you can set a phone number like '+263771234567'
                role: 'super_admin'
            }
        });
        console.log('');
        console.log('✅ SUCCESS! First admin created!');
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:    stategicbuilderss@gmail.com');
        console.log('🔑 Password: ChiKukw@stra');
        console.log('👤 Role:     super_admin');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('🔐 You can now login at: POST /api/admin/login');
        console.log('');
        console.log('Example login request:');
        console.log(JSON.stringify({
            email: 'stategicbuilderss@gmail.com',
            password: 'ChiKukw@stra'
        }, null, 2));
        console.log('');
    }
    catch (error) {
        console.error('');
        console.error('❌ ERROR:', error.message);
        console.error('');
        if (error.code === 'P2002') {
            console.error('This email is already registered.');
        }
        else if (error.code === 'P2003') {
            console.error('Database connection issue. Make sure your database is running.');
        }
        else {
            console.error('Full error:', error);
        }
    }
    finally {
        await prisma.$disconnect();
        console.log('🔌 Database connection closed.');
    }
}
// Run the initialization
initializeFirstAdmin();
