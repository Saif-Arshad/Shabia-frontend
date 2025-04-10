
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  image: string;
  attendees?: number;
  createdBy?: number;
}
