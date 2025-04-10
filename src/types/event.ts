/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  image: string;
  participants?: any;
  createdBy?: number;
}
