export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'PPT' | 'Recording' | 'Assignment';
  topic: string;
  dateStr: string; // ISO Date YYYY-MM-DD
  tags: string[];
  content: string; // Simulated content for summarization
  downloads: number;
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

export interface QueryLog {
  topic: string;
  timestamp: number;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}