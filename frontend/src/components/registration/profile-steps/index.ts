export { default as PersonalDetailsStep } from './PersonalDetailsStep';
export { default as AboutMeStep } from './AboutMeStep';
export { default as InterestsStep } from './InterestsStep';
export { default as PhysicalAttributesStep } from './PhysicalAttributesStep';
export { default as PreferencesStep } from './PreferencesStep';
export { default as LifestyleStep } from './LifestyleStep';
export { default as MediaStep } from './MediaStep';

// Combined data type for all profile steps
export interface ProfileData {
  personalDetails: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    location: string;
    latitude?: number;
    longitude?: number;
  };
  aboutMe: {
    bio: string;
  };
  interests: {
    interests: string[];
  };
  physicalAttributes: {
    height?: number;
    weight?: number;
    bodyType?: string;
    ethnicity?: string;
  };
  preferences: {
    interestedIn: string;
    relationshipGoal?: string;
    sexualOrientation?: string;
  };
  lifestyle: {
    pets?: string;
    drinking?: string;
    smoking?: string;
    workout?: string;
    dietaryPreference?: string;
    socialMedia?: string;
    sleepingHabits?: string;
    languages?: string[];
  };
  media: {
    photos: File[];
    profilePhotoIndex?: number;
    audioIntro?: File;
  };
}