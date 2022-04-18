declare global {
  interface Window {
    //   require: (module: 'electron') => {
    // 	ipcRenderer: IpcRenderer
    //   };
    userClick: (id: string) => void;
    urlClick: (id: string) => void;
  }
}
