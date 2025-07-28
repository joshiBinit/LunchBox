declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_BACKEND_URL: string;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
