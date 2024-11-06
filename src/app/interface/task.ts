export interface Task {
    id?: string; 
    title: string;
    description: string;
    date: number;
    priority?: string; 
    assignetTo?: string[];
    category: string;
    subtasks?: string[];
    publishedTimestamp: number;
    createtBy: string;
  }
  