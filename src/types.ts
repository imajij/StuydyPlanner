export type Subject = {
  id: string;
  name: string;
  deadline: string;
  color: string;
  createdAt: number;
};

export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  id: string;
  subjectId: string;
  title: string;
  status: TaskStatus;
  createdAt: number;
};

export type Note = {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  lastModified: number;
};
