import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
const { Pool } = pg;
// Create PostgreSQL connection pool with explicit user configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Explicitly set user to postgres (superuser)
    user: 'postgres',
    password: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    database: 'strategic_builders',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
// Create Prisma adapter
const adapter = new PrismaPg(pool);
// Create Prisma Client with adapter
const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
});
// Connect to database
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ PostgreSQL connected successfully via Prisma');
        // TEMPORARILY DISABLED - Admin creation has permission issues
        // The admin already exists in the database (you created it manually via psql)
        console.log('ℹ️  Admin creation skipped - use existing admin or create manually via psql');
        // Uncomment this once we fix the permission issue
        // await createDefaultAdmin();
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
// Create default admin
const createDefaultAdmin = async () => {
    try {
        const adminCount = await prisma.admin.count();
        if (adminCount === 0) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await prisma.admin.create({
                data: {
                    email: process.env.ADMIN_EMAIL,
                    password: hashedPassword,
                    phone: process.env.ADMIN_PHONE,
                    role: 'admin'
                }
            });
            console.log('👑 Default admin created successfully');
            console.log('📧 Email:', process.env.ADMIN_EMAIL);
            console.log('🔑 Password:', process.env.ADMIN_PASSWORD);
            console.log('📱 Phone:', process.env.ADMIN_PHONE);
        }
        else {
            console.log('✅ Admin already exists in database');
        }
    }
    catch (error) {
        console.error('⚠️  Error creating default admin:', error);
    }
};
// Test database connection
export const testConnection = async () => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch (error) {
        console.error('Database test failed:', error);
        return false;
    }
};
export default prisma;
// import { PrismaClient } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
// import pg from 'pg';
// import bcrypt from 'bcryptjs';
// const { Pool } = pg;
// // Create PostgreSQL connection pool
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
// // Create Prisma adapter
// const adapter = new PrismaPg(pool);
// // Create Prisma Client with adapter
// const prisma = new PrismaClient({
//   adapter,
//   log: process.env.NODE_ENV === 'development' 
//     ? ['query', 'info', 'warn', 'error'] 
//     : ['error'],
// });
// // Connect to database
// export const connectDB = async (): Promise<void> => {
//   try {
//     await prisma.$connect();
//     console.log('✅ PostgreSQL connected successfully via Prisma');
//     // TEMPORARILY DISABLED - Admin creation has permission issues
//     // The admin already exists in the database (you created it manually via psql)
//     console.log('ℹ️  Admin creation skipped - use existing admin or create manually via psql');
//     // Uncomment this once we fix the permission issue
//     // await createDefaultAdmin();
//   } catch (error) {
//     console.error('❌ Database connection failed:', error);
//     process.exit(1);
//   }
// };
// // Create default admin
// const createDefaultAdmin = async (): Promise<void> => {
//   try {
//     const adminCount = await prisma.admin.count();
//     if (adminCount === 0) {
//       const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
//       await prisma.admin.create({
//         data: {
//           email: process.env.ADMIN_EMAIL!,
//           password: hashedPassword,
//           phone: process.env.ADMIN_PHONE!,
//           role: 'admin'
//         }
//       });
//       console.log('👑 Default admin created successfully');
//       console.log('📧 Email:', process.env.ADMIN_EMAIL);
//       console.log('🔑 Password:', process.env.ADMIN_PASSWORD);
//       console.log('📱 Phone:', process.env.ADMIN_PHONE);
//     } else {
//       console.log('✅ Admin already exists in database');
//     }
//   } catch (error) {
//     console.error('⚠️  Error creating default admin:', error);
//   }
// };
// // Test database connection
// export const testConnection = async (): Promise<boolean> => {
//   try {
//     await prisma.$queryRaw`SELECT 1`;
//     return true;
//   } catch (error) {
//     console.error('Database test failed:', error);
//     return false;
//   }
// };
// export default prisma;
