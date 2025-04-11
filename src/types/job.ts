
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string; // Full-time, Part-time, Contract, etc.
  category: string;
  salary: string;
  description: string;
  posted: string;
  deadline: string;
  createdBy?: number;
}
