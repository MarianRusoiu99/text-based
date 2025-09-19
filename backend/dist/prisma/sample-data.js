"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding sample data...');
    const hashedPassword = await bcrypt.hash('password123', 12);
    const testUser = await prisma.user.create({
        data: {
            username: 'testuser',
            email: 'test@example.com',
            passwordHash: hashedPassword,
            displayName: 'Test User',
            bio: 'Default test user for automated testing',
            isVerified: true,
        },
    });
    const user1 = await prisma.user.create({
        data: {
            username: 'storyteller1',
            email: 'storyteller1@example.com',
            passwordHash: hashedPassword,
            displayName: 'Alice Johnson',
            bio: 'Passionate storyteller creating immersive adventures',
            isVerified: true,
        },
    });
    const user2 = await prisma.user.create({
        data: {
            username: 'adventure_writer',
            email: 'writer@example.com',
            passwordHash: hashedPassword,
            displayName: 'Bob Smith',
            bio: 'Fantasy and sci-fi adventure creator',
            isVerified: true,
        },
    });
    await prisma.story.create({
        data: {
            title: 'The Lost Temple',
            description: 'Embark on a thrilling adventure to discover an ancient temple filled with mysteries and treasures.',
            authorId: user1.id,
            visibility: 'public',
            isPublished: true,
            isFeatured: true,
            tags: ['adventure', 'fantasy', 'mystery'],
        },
    });
    await prisma.story.create({
        data: {
            title: 'Space Station Crisis',
            description: 'You are the captain of a space station facing a critical emergency. Make decisions that will determine the fate of your crew.',
            authorId: user2.id,
            visibility: 'public',
            isPublished: true,
            isFeatured: true,
            tags: ['sci-fi', 'space', 'survival'],
        },
    });
    await prisma.story.create({
        data: {
            title: 'Medieval Quest',
            description: 'A young knight sets out on a quest to defeat an evil dragon and save the kingdom.',
            authorId: user1.id,
            visibility: 'public',
            isPublished: true,
            tags: ['fantasy', 'medieval', 'heroic'],
        },
    });
    await prisma.story.create({
        data: {
            title: 'Cyberpunk Detective',
            description: 'Navigate the neon-lit streets of a futuristic city as a detective solving high-tech crimes.',
            authorId: user2.id,
            visibility: 'public',
            isPublished: true,
            tags: ['cyberpunk', 'detective', 'future'],
        },
    });
    console.log('Sample data seeded successfully!');
    console.log(`Created ${2} users and ${4} stories`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=sample-data.js.map