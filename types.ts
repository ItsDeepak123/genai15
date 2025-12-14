export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'PPT' | 'Recording' | 'Assignment' | 'Image' | 'Video';
  topic: string;
  dateStr: string; // ISO Date YYYY-MM-DD
  tags: string[];
  content: string; // Simulated content for summarization
  downloads: number;
  url?: string; // Direct link to the resource
}

export interface ScheduleItem {
  date: string; // YYYY-MM-DD
  topic: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  relatedResource?: Resource;
  generatedContent?: string; // For summaries/cheat sheets
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  resourceTitle: string;
  topic: string;
  query: string;
  timestamp: number;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
