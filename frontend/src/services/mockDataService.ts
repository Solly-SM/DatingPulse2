import { DiscoverUser, Match, Conversation, Message, ReceivedLike } from '../types/Dating';

// Mock photos from Unsplash
const samplePhotos = [
  'https://images.unsplash.com/photo-1494790108755-2616b2bef569?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
];

const interests = [
  'Photography', 'Hiking', 'Coffee', 'Travel', 'Art', 'Music', 'Dancing', 'Fitness',
  'Cooking', 'Books', 'Movies', 'Wine', 'Beach', 'Yoga', 'Gaming', 'Nature'
];

const locations = [
  'Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'
];

const occupations = [
  'Software Engineer', 'Graphic Designer', 'Marketing Manager', 'Teacher', 'Doctor',
  'Lawyer', 'Photographer', 'Consultant', 'Architect', 'Chef', 'Artist', 'Nurse'
];

const educations = [
  'University of Cape Town', 'Wits University', 'Stellenbosch University',
  'UKZN', 'Rhodes University', 'UP'
];

function getRandomItems<T>(array: T[], count: number): T[] {
  return array.sort(() => 0.5 - Math.random()).slice(0, count);
}

function generateMockUser(id: number): DiscoverUser {
  const firstNames = ['Sarah', 'Emma', 'Michael', 'James', 'Jessica', 'David', 'Ashley', 'Chris', 'Amanda', 'Ryan'];
  const lastNames = ['Johnson', 'Smith', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const age = Math.floor(Math.random() * 15) + 20; // 20-35
  const gender = Math.random() > 0.5 ? 'female' : 'male';
  
  const bios = [
    "Adventure seeker and coffee enthusiast ☕ Love hiking, photography, and trying new restaurants. Looking for someone to explore the world with! 🌍",
    "Passionate about life and always up for a good laugh! Love traveling, dancing, and meeting new people. Let's create some amazing memories together! ✨",
    "Fitness enthusiast and foodie 🏃‍♀️🍕 Believe in living life to the fullest. Looking for someone who can keep up with my energy and sense of humor!",
    "Creative soul with a love for art and music 🎨🎵 When I'm not working, you'll find me at galleries, concerts, or cozy bookshops. Let's discover new places together!",
    "Tech professional by day, chef by night 👨‍💻👨‍🍳 Love cooking for others and exploring new cuisines. Seeking someone who appreciates good food and great conversation!",
    "Nature lover and weekend warrior 🏔️ Hiking, camping, and outdoor adventures are my thing. Looking for a partner to share these experiences with!",
    "Yoga instructor and wellness enthusiast 🧘‍♀️ Believe in mindful living and positive energy. Searching for someone who values personal growth and inner peace.",
    "Book lover and wine enthusiast 📚🍷 Perfect evening for me is a good book, great wine, and meaningful conversation. Let's explore life's beautiful moments together!"
  ];

  // Enhanced attributes for comprehensive profiles
  const bodyTypes = ['Slim', 'Athletic', 'Average', 'Curvy', 'Muscular'];
  const ethnicities = ['Mixed', 'African', 'Caucasian', 'Asian', 'Hispanic', 'Other'];
  const petPreferences = ['Dog lover', 'Cat person', 'No pets', 'All animals'];
  const drinkingHabits = ['Never', 'Socially', 'Regularly', 'Occasionally'];
  const smokingHabits = ['Never', 'Socially', 'Regularly', 'Trying to quit'];
  const workoutFrequency = ['Daily', 'Weekly', 'Occasionally', 'Rarely'];
  const relationshipGoals = ['Casual dating', 'Long-term', 'Marriage', 'Friends first'];
  const lookingFor = ['Serious relationship', 'Casual dating', 'New friends', 'Networking'];

  // Audio intro URL - ensure ALL users have audio intros for consistency
  const audioIntroUrl = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAfBz2L0/PJdSgFKn3J8N2QQgoeaLvu5Z9NEAxPqeXwtWQcBz2N1fDMeywFJHfA8N2QQAoUXrTp66hWFApFmuPztV8gCj2L0/PJdSgEKn3J8N2QQgoeaLvu5Z9NEAxPqeXwtWQcBz2N1fDNeysFJHfI8N2QQAoUXrTp66hWFApGn+PytV8gCj2L0/PJdSgFK3zJ8N2QQgoeaLvu5Z9NEAxPpuHvxGklEwdBlM3vzW0rEzQ7stn1wGP/AP2gYuAyB3YAAAAASUVORK0=";

  return {
    userID: id,
    username: `${firstName.toLowerCase()}${id}`,
    firstName,
    lastName,
    age,
    bio: bios[Math.floor(Math.random() * bios.length)],
    location: `${locations[Math.floor(Math.random() * locations.length)]}, ${Math.floor(Math.random() * 10) + 1}km away`,
    interests: getRandomItems(interests, Math.floor(Math.random() * 6) + 3),
    photos: [
      {
        photoID: id * 10,
        userID: id,
        url: samplePhotos[Math.floor(Math.random() * samplePhotos.length)],
        isPrimary: true,
        uploadedAt: new Date().toISOString(),
      },
      {
        photoID: id * 10 + 1,
        userID: id,
        url: samplePhotos[Math.floor(Math.random() * samplePhotos.length)],
        isPrimary: false,
        uploadedAt: new Date().toISOString(),
      }
    ],
    education: educations[Math.floor(Math.random() * educations.length)],
    occupation: occupations[Math.floor(Math.random() * occupations.length)],
    height: Math.floor(Math.random() * 30) + 160, // 160-190cm
    gender: gender as 'male' | 'female',
    distance: Math.floor(Math.random() * 20) + 1,
    verified: Math.random() > 0.3,
    
    // Enhanced profile attributes
    audioIntroUrl,
    bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
    ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
    pets: petPreferences[Math.floor(Math.random() * petPreferences.length)],
    drinking: drinkingHabits[Math.floor(Math.random() * drinkingHabits.length)],
    smoking: smokingHabits[Math.floor(Math.random() * smokingHabits.length)],
    workout: workoutFrequency[Math.floor(Math.random() * workoutFrequency.length)],
    relationshipGoal: relationshipGoals[Math.floor(Math.random() * relationshipGoals.length)],
    lookingFor: lookingFor[Math.floor(Math.random() * lookingFor.length)],
  };
}

export const mockDataService = {
  // Generate mock users for discovery
  generateDiscoverUsers(count: number = 10): DiscoverUser[] {
    return Array.from({ length: count }, (_, i) => generateMockUser(i + 2));
  },

  // Generate mock matches
  generateMatches(count: number = 5): Match[] {
    const matches: Match[] = [];
    for (let i = 0; i < count; i++) {
      const user1 = generateMockUser(100 + i);
      const user2 = { ...generateMockUser(200 + i), userID: 1 }; // Current user
      
      matches.push({
        matchID: i + 1,
        user1ID: user1.userID,
        user2ID: user2.userID,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        user1,
        user2,
      });
    }
    return matches;
  },

  // Generate mock conversations
  generateConversations(count: number = 3): Conversation[] {
    const conversations: Conversation[] = [];
    const lastMessages = [
      "Hey! How are you doing?",
      "That sounds like fun! I'd love to join 😊",
      "Thanks for the recommendation, I'll check it out!",
      "Great to meet you! Looking forward to chatting more",
      "Haha, that's hilarious! 😂",
    ];

    for (let i = 0; i < count; i++) {
      const otherUser = generateMockUser(300 + i);
      conversations.push({
        conversationID: i + 1,
        user1ID: 1, // Current user
        user2ID: otherUser.userID,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastMessageAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        lastMessage: lastMessages[Math.floor(Math.random() * lastMessages.length)],
        unreadCount: Math.floor(Math.random() * 3),
        otherUser,
      });
    }
    return conversations;
  },

  // Generate mock messages for a conversation
  generateMessages(conversationId: number, count: number = 10): Message[] {
    const messages: Message[] = [];
    const sampleMessages = [
      "Hey! How's it going?",
      "Great to match with you!",
      "What do you like to do for fun?",
      "I love your photos! That hiking trip looked amazing",
      "Thanks! I had such a great time there",
      "I see you're into photography too",
      "Yes! I'm always looking for new places to shoot",
      "We should go together sometime!",
      "That sounds perfect! I know some great spots",
      "Looking forward to it! 😊",
    ];

    for (let i = 0; i < count; i++) {
      const isFromCurrentUser = Math.random() > 0.5;
      messages.push({
        messageID: i + 1,
        conversationID: conversationId,
        senderID: isFromCurrentUser ? 1 : 300 + conversationId,
        content: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
        sentAt: new Date(Date.now() - (count - i) * 60 * 60 * 1000).toISOString(),
        isRead: Math.random() > 0.2,
        messageType: 'TEXT',
      });
    }
    return messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  },

  // Generate received likes with grouping
  generateReceivedLikes(count: number = 12) {
    const likes = [];
    const likeTypes = ['LIKE', 'SUPER_LIKE'] as const;
    
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 7); // Last 7 days
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      
      likes.push({
        likeID: 1000 + i,
        likerID: 100 + i,
        likedID: 1, // Current user
        type: likeTypes[Math.floor(Math.random() * likeTypes.length)],
        createdAt: createdAt.toISOString(),
        liker: generateMockUser(100 + i)
      });
    }
    
    // Sort by most recent first
    return likes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Simulate delays for realistic UX
  delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
};