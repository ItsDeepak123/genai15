import { Resource, ScheduleItem } from './types';

// Simulate a semester schedule
// Assuming "today" is roughly around the time of the hackathon, let's pick fixed dates relative to a mock current date.
export const MOCK_SCHEDULE: ScheduleItem[] = [
  { date: '2025-02-10', topic: 'Introduction to Database Systems' },
  { date: '2025-02-12', topic: 'ER Model and Relational Model' },
  { date: '2025-02-17', topic: 'DBMS Normalization' }, // "Last Tuesday" relative to a future date
  { date: '2025-02-19', topic: 'SQL Basics' },
  { date: '2025-02-24', topic: 'Advanced SQL and Indexing' },
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Unit 1: Intro to DBMS',
    type: 'PPT',
    topic: 'Introduction to Database Systems',
    dateStr: '2025-02-10',
    tags: ['intro', 'dbms', 'unit 1'],
    downloads: 120,
    content: "A database is an organized collection of data, generally stored and accessed electronically from a computer system. Key concepts: DBMS, RDBMS, SQL, NoSQL. Advantages: Data independence, efficient access, data integrity.",
  },
  {
    id: 'res-2',
    title: 'Unit 2: Normalization Notes',
    type: 'PDF',
    topic: 'DBMS Normalization',
    dateStr: '2025-02-17',
    tags: ['normalization', '1nf', '2nf', '3nf', 'bcnf'],
    downloads: 45,
    content: "Normalization is the process of organizing data in a database. 1NF: Atomic values. 2NF: No partial dependency. 3NF: No transitive dependency. BCNF: A stricter version of 3NF. It reduces data redundancy and improves data integrity.",
  },
  {
    id: 'res-3',
    title: 'Assignment 3: SQL Queries',
    type: 'Assignment',
    topic: 'SQL Basics',
    dateStr: '2025-02-19',
    tags: ['homework', 'sql', 'queries'],
    downloads: 89,
    content: "1. Write a query to select all students. 2. Write a query to find the average grade. 3. Join the students and courses tables. Due date: 2025-02-26.",
  },
  {
    id: 'res-4',
    title: 'Advanced Indexing Strategies',
    type: 'PDF',
    topic: 'Advanced SQL and Indexing',
    dateStr: '2025-02-24',
    tags: ['indexing', 'b-tree', 'performance'],
    downloads: 12,
    content: "Indexes are used to quickly locate data without having to search every row in a database table. B-Trees and Hash Indexes are common types. Clustered vs Non-clustered indexes.",
  },
  {
    id: 'res-5',
    title: 'ER Diagram Structure',
    type: 'Image',
    topic: 'ER Model and Relational Model',
    dateStr: '2025-02-12',
    tags: ['diagram', 'er-model', 'image'],
    downloads: 34,
    content: "Visual diagram of Entity Relationship model components: Entities (Rectangles), Attributes (Ovals), Relationships (Diamonds).",
  },
  {
    id: 'res-6',
    title: 'Lecture Recording: SQL Joins',
    type: 'Video',
    topic: 'SQL Basics',
    dateStr: '2025-02-19',
    tags: ['recording', 'video', 'joins'],
    downloads: 56,
    content: "Video recording of the lecture covering Inner Join, Left Join, Right Join, and Full Outer Join examples.",
  }
];