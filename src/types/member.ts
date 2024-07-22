export type Member = {
  id: number;
  fullname: string;
  birthday: string;
  pregnantTimes: number;
  associated: string;
  activeReprimands: number;
  totalReprimands: number;
  activeAbsences: number;
  totalAbsences: number;
  foodDebt: boolean;
};

export type PostMember = {
  fullname: string;
  birthday: string;
  associated: string;
};
