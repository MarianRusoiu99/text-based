import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding comprehensive sample data...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create default test user for E2E tests
  await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: hashedPassword,
      displayName: 'Test User',
      bio: 'Default test user for automated testing',
      isVerified: true,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { username: 'storyteller1' },
    update: {},
    create: {
      username: 'storyteller1',
      email: 'storyteller1@example.com',
      passwordHash: hashedPassword,
      displayName: 'Alice Johnson',
      bio: 'Passionate storyteller creating immersive adventures',
      isVerified: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'adventure_writer' },
    update: {},
    create: {
      username: 'adventure_writer',
      email: 'writer@example.com',
      passwordHash: hashedPassword,
      displayName: 'Bob Smith',
      bio: 'Fantasy and sci-fi adventure creator',
      isVerified: true,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { username: 'rpg_master' },
    update: {},
    create: {
      username: 'rpg_master',
      email: 'rpg@example.com',
      passwordHash: hashedPassword,
      displayName: 'Charlie RPG',
      bio: 'RPG template designer and game master',
      isVerified: true,
    },
  });

  // Create RPG Templates
  const fantasyTemplate = await prisma.rpgTemplate.create({
    data: {
      name: 'Classic Fantasy RPG',
      description: 'A traditional fantasy RPG system with stats like strength, intelligence, and charisma',
      version: '1.0.0',
      isPublic: true,
      creatorId: user3.id,
      config: {
        stats: [
          { name: 'strength', type: 'integer', defaultValue: 10, description: 'Physical power and combat ability' },
          { name: 'intelligence', type: 'integer', defaultValue: 10, description: 'Mental acuity and spellcasting' },
          { name: 'charisma', type: 'integer', defaultValue: 10, description: 'Social skills and persuasion' },
          { name: 'dexterity', type: 'integer', defaultValue: 10, description: 'Agility and precision' },
          { name: 'constitution', type: 'integer', defaultValue: 10, description: 'Health and endurance' },
        ],
        skills: [
          { name: 'swordsmanship', type: 'integer', defaultValue: 0, description: 'Skill with swords' },
          { name: 'magic', type: 'integer', defaultValue: 0, description: 'Magical ability' },
          { name: 'stealth', type: 'integer', defaultValue: 0, description: 'Ability to move unseen' },
        ],
        checkTypes: ['skill', 'stat', 'luck'],
      },
    },
  });

  const cyberpunkTemplate = await prisma.rpgTemplate.create({
    data: {
      name: 'Cyberpunk 2077 RPG',
      description: 'High-tech, low-life RPG system for cyberpunk adventures',
      version: '1.0.0',
      isPublic: true,
      creatorId: user3.id,
      config: {
        stats: [
          { name: 'hacking', type: 'integer', defaultValue: 5, description: 'Digital intrusion skills' },
          { name: 'combat', type: 'integer', defaultValue: 5, description: 'Firearms and close combat' },
          { name: 'social', type: 'integer', defaultValue: 5, description: 'Persuasion and deception' },
          { name: 'driving', type: 'integer', defaultValue: 5, description: 'Vehicle operation' },
        ],
        skills: [
          { name: 'programming', type: 'integer', defaultValue: 0, description: 'Software development' },
          { name: 'firearms', type: 'integer', defaultValue: 0, description: 'Gun handling' },
          { name: 'negotiation', type: 'integer', defaultValue: 0, description: 'Deal making' },
        ],
        checkTypes: ['skill', 'stat', 'tech'],
      },
    },
  });

  // Create sample stories
  const lostTempleStory = await prisma.story.create({
    data: {
      title: 'The Lost Temple',
      description: 'Embark on a thrilling adventure to discover an ancient temple filled with mysteries and treasures.',
      authorId: user1.id,
      visibility: 'public',
      isPublished: true,
      isFeatured: true,
      tags: ['adventure', 'fantasy', 'mystery'],
      rpgTemplateId: fantasyTemplate.id,
    },
  });

  const spaceStationStory = await prisma.story.create({
    data: {
      title: 'Space Station Crisis',
      description: 'You are the captain of a space station facing a critical emergency. Make decisions that will determine the fate of your crew.',
      authorId: user2.id,
      visibility: 'public',
      isPublished: true,
      isFeatured: true,
      tags: ['sci-fi', 'space', 'survival'],
      rpgTemplateId: cyberpunkTemplate.id,
    },
  });

  const medievalQuestStory = await prisma.story.create({
    data: {
      title: 'Medieval Quest',
      description: 'A young knight sets out on a quest to defeat an evil dragon and save the kingdom.',
      authorId: user1.id,
      visibility: 'public',
      isPublished: true,
      tags: ['fantasy', 'medieval', 'heroic'],
      rpgTemplateId: fantasyTemplate.id,
    },
  });

  const cyberpunkDetectiveStory = await prisma.story.create({
    data: {
      title: 'Cyberpunk Detective',
      description: 'Navigate the neon-lit streets of a futuristic city as a detective solving high-tech crimes.',
      authorId: user2.id,
      visibility: 'public',
      isPublished: true,
      tags: ['cyberpunk', 'detective', 'future'],
      rpgTemplateId: cyberpunkTemplate.id,
    },
  });

  // Create chapters for stories
  const templeChapter1 = await prisma.chapter.create({
    data: {
      title: 'The Journey Begins',
      description: 'Your adventure starts at the edge of the mysterious jungle',
      chapterOrder: 1,
      isPublished: true,
      storyId: lostTempleStory.id,
    },
  });

  const spaceChapter1 = await prisma.chapter.create({
    data: {
      title: 'Alert Status',
      description: 'The station alarms are blaring - something is wrong',
      chapterOrder: 1,
      isPublished: true,
      storyId: spaceStationStory.id,
    },
  });

  // Create story variables
  await prisma.storyVariable.createMany({
    data: [
      {
        storyId: lostTempleStory.id,
        variableName: 'has_torch',
        variableType: 'boolean',
        defaultValue: false,
      },
      {
        storyId: lostTempleStory.id,
        variableName: 'health',
        variableType: 'integer',
        defaultValue: 100,
      },
      {
        storyId: spaceStationStory.id,
        variableName: 'oxygen_level',
        variableType: 'integer',
        defaultValue: 100,
      },
      {
        storyId: spaceStationStory.id,
        variableName: 'crew_alive',
        variableType: 'integer',
        defaultValue: 50,
      },
    ],
  });

  // Create items
  await prisma.item.createMany({
    data: [
      {
        storyId: lostTempleStory.id,
        itemName: 'Ancient Key',
        description: 'A rusty key that might open ancient doors',
      },
      {
        storyId: lostTempleStory.id,
        itemName: 'Torch',
        description: 'Provides light in dark places',
      },
      {
        storyId: spaceStationStory.id,
        itemName: 'Access Card',
        description: 'Grants access to restricted areas',
      },
      {
        storyId: spaceStationStory.id,
        itemName: 'Repair Kit',
        description: 'Essential for fixing station systems',
      },
    ],
  });

  // Create nodes for chapters
  const startNode = await prisma.node.create({
    data: {
      title: 'Jungle Entrance',
      content: {
        text: 'You stand at the entrance of a dense jungle. Ancient ruins are said to lie within. The path ahead is dark and mysterious.',
        choices: ['Enter the jungle', 'Look for another way', 'Set up camp'],
      },
      position: { x: 100, y: 100 },
      storyId: lostTempleStory.id,
      chapterId: templeChapter1.id,
      nodeType: 'story',
    },
  });

  const spaceStartNode = await prisma.node.create({
    data: {
      title: 'Command Center',
      content: {
        text: 'RED ALERT! The station is under attack. Systems are failing. What do you do?',
        choices: ['Check security cameras', 'Contact Earth command', 'Evacuate the crew'],
      },
      position: { x: 100, y: 100 },
      storyId: spaceStationStory.id,
      chapterId: spaceChapter1.id,
      nodeType: 'story',
    },
  });

  const junglePathNode = await prisma.node.create({
    data: {
      title: 'Dark Jungle Path',
      content: {
        text: 'The jungle path is dark and treacherous. You can barely see ahead.',
        choices: ['Continue forward', 'Turn back', 'Light a torch'],
      },
      position: { x: 300, y: 100 },
      storyId: lostTempleStory.id,
      chapterId: templeChapter1.id,
      nodeType: 'story',
    },
  });

  // Create choices connecting nodes
  await prisma.choice.createMany({
    data: [
      {
        fromNodeId: startNode.id,
        toNodeId: junglePathNode.id,
        choiceText: 'Enter the jungle',
      },
      {
        fromNodeId: junglePathNode.id,
        toNodeId: startNode.id,
        choiceText: 'Turn back',
      },
    ],
  });

  // Create ratings
  await prisma.rating.createMany({
    data: [
      {
        storyId: lostTempleStory.id,
        userId: user2.id,
        rating: 5,
        review: 'Amazing adventure! The choices really matter.',
      },
      {
        storyId: spaceStationStory.id,
        userId: user1.id,
        rating: 4,
        review: 'Great sci-fi story with tough decisions.',
      },
      {
        storyId: medievalQuestStory.id,
        userId: user3.id,
        rating: 5,
        review: 'Classic fantasy done right!',
      },
    ],
  });

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        storyId: lostTempleStory.id,
        userId: user2.id,
        content: 'This story kept me on the edge of my seat!',
      },
      {
        storyId: spaceStationStory.id,
        userId: user1.id,
        content: 'The space setting is really immersive.',
      },
    ],
  });

  // Create user follows
  await prisma.userFollow.createMany({
    data: [
      {
        followerId: user2.id,
        followingId: user1.id,
      },
      {
        followerId: user3.id,
        followingId: user1.id,
      },
      {
        followerId: user1.id,
        followingId: user3.id,
      },
    ],
  });

  // Create story bookmarks
  await prisma.storyBookmark.createMany({
    data: [
      {
        userId: user2.id,
        storyId: lostTempleStory.id,
      },
      {
        userId: user3.id,
        storyId: spaceStationStory.id,
      },
    ],
  });

  // Create achievements
  const firstStoryAchievement = await prisma.achievement.create({
    data: {
      name: 'First Story',
      description: 'Created your first story',
      category: 'creation',
      triggerType: 'story_created',
      points: 10,
      rarity: 'common',
    },
  });

  const popularAuthorAchievement = await prisma.achievement.create({
    data: {
      name: 'Popular Author',
      description: 'Get 5+ ratings on a story',
      category: 'popularity',
      triggerType: 'story_ratings',
      triggerData: { minRatings: 5 },
      points: 50,
      rarity: 'rare',
    },
  });

  // Create user achievements
  await prisma.userAchievement.createMany({
    data: [
      {
        userId: user1.id,
        achievementId: firstStoryAchievement.id,
      },
      {
        userId: user2.id,
        achievementId: firstStoryAchievement.id,
      },
      {
        userId: user1.id,
        achievementId: popularAuthorAchievement.id,
      },
    ],
  });

  // Create play sessions
  const playSession1 = await prisma.playSession.create({
    data: {
      userId: user2.id,
      storyId: lostTempleStory.id,
      currentNodeId: startNode.id,
      gameState: {
        variables: { has_torch: false, health: 100 },
        inventory: [],
      },
      isCompleted: false,
    },
  });

  // Create saved games
  await prisma.savedGame.create({
    data: {
      userId: user2.id,
      sessionId: playSession1.id,
      storyId: lostTempleStory.id,
      saveName: 'Jungle Entrance',
      currentNodeId: startNode.id,
      gameState: {
        variables: { has_torch: false, health: 100 },
        inventory: [],
      },
      isCompleted: false,
    },
  });

  console.log('Comprehensive sample data seeded successfully!');
  console.log(`Created:`);
  console.log(`- ${4} users`);
  console.log(`- ${2} RPG templates`);
  console.log(`- ${4} stories`);
  console.log(`- ${2} chapters`);
  console.log(`- ${3} nodes`);
  console.log(`- ${2} choices`);
  console.log(`- ${4} story variables`);
  console.log(`- ${4} items`);
  console.log(`- ${3} ratings`);
  console.log(`- ${2} comments`);
  console.log(`- ${3} user follows`);
  console.log(`- ${2} story bookmarks`);
  console.log(`- ${2} achievements`);
  console.log(`- ${3} user achievements`);
  console.log(`- ${1} play session`);
  console.log(`- ${1} saved game`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });