import { createContext } from "react";

export const ghContext = createContext({
  data: [] as GithubRepoType[],
  setData: (data: GithubRepoType[]) => { },
});
