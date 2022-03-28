export type FullUserItem = {
  birth: number;
  createTime: number;
  email: string;
  ex: string;
  faceURL: string;
  gender: number;
  nickname: string;
  phoneNumber: string;
  userID: string;
};

export type PartialUserItem = Partial<Omit<FullUserItem, 'userID'>> & {
  userID: string;
};
