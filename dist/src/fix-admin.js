import bcrypt from 'bcryptjs';
import prisma from './config/database.js';
async function fixAdmin() {
    try {
        console.log('🔄 Fixing admin NOW...\n');
        // Delete ALL admins
        const deleted = await prisma.admin.deleteMany({});
        console.log(`✅ Deleted ${deleted.count} admin(s)`);
        // Create NEW admin with CORRECT password
        const hashedPassword = await bcrypt.hash('ChiKukw@stra', 10);
        const admin = await prisma.admin.create({
            data: {
                email: 'stategicbuilderss@gmail.com',
                password: hashedPassword,
                phone: '',
                role: 'super_admin'
            }
        });
        console.log('\n✅ SUCCESS! Admin fixed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:    stategicbuilderss@gmail.com');
        console.log('🔑 Password: ChiKukw@stra');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        // TEST IT
        const test = await bcrypt.compare('ChiKukw@stra', admin.password);
        console.log('🧪 Password test:', test ? '✅ WORKS!' : '❌ FAILED!');
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
    finally {
        await prisma.$disconnect();
    }
}
fixAdmin();
