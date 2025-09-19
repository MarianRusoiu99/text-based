import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding sample data...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create default test user for E2E tests
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

  // Create sample stories
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