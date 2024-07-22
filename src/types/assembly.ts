export type AssemblyMember = {
  id: number;
  fullname: string;
  pregnant: boolean;
  arrived: boolean;
};

export type Assembly = {
  id: number;
  date: string;
  pregnant: string;
  note?: string;
  members: AssemblyMember[];
};

export type PostAssembly = {
  date: string;
  pregnant: string;
  note?: string;
  members: AssemblyMember[];
};
