export type Assembly = {
  id: number;
  date: string;
  pregnant: string;
  note?: string;
  members: Array<{
    fullname: string;
    pregnant: boolean;
    arrived: boolean;
  }>;
};
