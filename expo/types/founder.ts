export interface Founder {
  id: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  interests: string[];
  lookingFor: string;
  location: string;
  imageUrl: string;
}

export interface Match {
  founder: Founder;
  matchedAt: Date;
}

export type SwipeAction = 'like' | 'pass';
