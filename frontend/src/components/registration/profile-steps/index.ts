export { default as PersonalDetailsStep } from './PersonalDetailsStep';
export { default as AboutMeStep } from './AboutMeStep';
export { default as InterestsStep } from './InterestsStep';
export { default as PhysicalAttributesStep } from './PhysicalAttributesStep';
export { default as PreferencesStep } from './PreferencesStep';
export { default as LifestyleStep } from './LifestyleStep';
export { default as MediaStep } from './MediaStep';

// New simplified steps
export { default as NameAboutStep } from './NameAboutStep';
export { default as BirthDateStep } from './BirthDateStep';
export { default as GenderDisplayStep } from './GenderDisplayStep';
export { default as SexualOrientationStep } from './SexualOrientationStep';

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
    showGender?: boolean;
    showOrientation?: boolean;
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