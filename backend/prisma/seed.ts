import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding achievements...');

  // Clear existing achievements
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();

  // Create achievements
  const achievements = [
    {
      name: 'First Steps',
      description: 'Start your first story',
      triggerType: 'play_sessions_started',
      triggerData: { count: 1 },
      points: 10,
      rarity: 'common',
      category: 'player',
    },
    {
      name: 'Story Explorer',
      description: 'Start 5 different stories',
      triggerType: 'play_sessions_started',
      triggerData: { count: 5 },
      points: 25,
      rarity: 'common',
      category: 'player',
    },
    {
      name: 'Choice Maker',
      description: 'Make 10 choices across all stories',
      triggerType: 'choices_made',
      triggerData: { count: 10 },
      points: 15,
      rarity: 'common',
      category: 'player',
    },
    {
      name: 'Story Completer',
      description: 'Complete your first story',
      triggerType: 'story_completed',
      triggerData: { count: 1 },
      points: 50,
      rarity: 'rare',
      category: 'player',
    },
    {
      name: 'Master Storyteller',
      description: 'Complete 10 stories',
      triggerType: 'story_completed',
      triggerData: { count: 10 },
      points: 100,
      rarity: 'epic',
      category: 'player',
    },
    {
      name: 'Creator',
      description: 'Create your first story',
      triggerType: 'stories_created',
      triggerData: { count: 1 },
      points: 30,
      rarity: 'rare',
      category: 'creator',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement,
    });
  }

  console.log('Achievements seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });