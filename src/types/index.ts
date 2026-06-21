export interface ICourse {
  id: string;
  name: string;
  shortcut: string;
  difficult: string;
  color: "green" | "blue" | "purple" | "red" | "yellow" | "orange";
  pages: number;
  content: string[];
  description: string;
  preview: string;
  image: string[];
  author: string;
  duration: string;
  intoCourse: string[];
}
export interface IUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  level: number;
  totalXP: number;
  rewardClaimed: boolean;
  completedCourses: number[];
  registrationDate: string;
  bio: string;
  skills: string[];
  social: {
    github: string;
    telegram: string;
    website: string;
  };
  settings: {
    theme: string;
    notifications: boolean;
    language: string;
  };
}
interface ITestCase {
  description: string;
  check: string;
}

export interface IChallenge {
  id: string;
  title: string;
  language: "html" | "javascript";
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  category: string;
  description: string;
  initialCode: string;
  expectedOutput: string;
  hints: string[];
  testCases: ITestCase[];
}
export interface IUserExp {
  [level: number]: number;
}

export interface IAnswer {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  isBest: boolean;
}

export interface IQuestion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  views: number;
  answers: IAnswer[];
}

// Для создания нового вопроса (без id, createdAt, views, answers)
export interface ICreateQuestion {
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
}

// Для добавления ответа
export interface ICreateAnswer {
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
}
export interface IQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number; // индекс правильного ответа (0-based)
}

export interface IQuiz {
  courseId: string;
  questions: IQuizQuestion[];
  passingScore: number; // сколько нужно правильных ответов (например, 4 из 5)
}
