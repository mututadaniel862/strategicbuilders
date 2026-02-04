"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_js_1 = __importDefault(require("./config/database.js"));
async function fixAdmin() {
    try {
        console.log('🔄 Fixing admin NOW...\n');
        // Delete ALL admins
        const deleted = await database_js_1.default.admin.deleteMany({});
        console.log(`✅ Deleted ${deleted.count} admin(s)`);
        // Create NEW admin with CORRECT password
        const hashedPassword = await bcryptjs_1.default.hash('ChiKukw@stra', 10);
        const admin = await database_js_1.default.admin.create({
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
        const test = await bcryptjs_1.default.compare('ChiKukw@stra', admin.password);
        console.log('🧪 Password test:', test ? '✅ WORKS!' : '❌ FAILED!');
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
    finally {
        await database_js_1.default.$disconnect();
    }
}
fixAdmin();
