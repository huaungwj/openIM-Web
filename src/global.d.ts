declare interface Window {
  userClick: (id: string) => void;
  urlClick: (id: string) => void;
  seeDetailInfo: (userID: string) => void;
  removeLoading: () => void;
}
