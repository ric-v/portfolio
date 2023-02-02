import { createContext, useEffect, useState } from "react";


export const GithubCtx = createContext({
  user: {} as GithubUserType,
  setUser: (user: GithubUserType) => { },
  repos: [] as GithubRepoType[],
  setRepos: (repos: GithubRepoType[]) => { },
});

const GithubProvider = ({ children }: any) => {
  const [user, setUser] = useState({} as GithubUserType);
  const [repos, setRepos] = useState([] as GithubRepoType[]);

  // fetch user and repos from github api
  useEffect(() => {

    // fetch user from local storage if available or from github api
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      fetch("https://api.github.com/users/ric-v")
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        });
    }

    // fetch repos from local storage if available or from github api
    const localRepos = localStorage.getItem("repos");
    if (localRepos) {
      setRepos(JSON.parse(localRepos));
    } else {
      fetch("https://api.github.com/users/ric-v/repos")
        .then((res) => res.json())
        .then((data) => {
          setRepos(data);
          localStorage.setItem("repos", JSON.stringify(data));
        }
        );
    }
  }, []);

  return (
    <GithubCtx.Provider value={{ user, setUser, repos, setRepos }}>
      {children}
    </GithubCtx.Provider>
  );
};

export default GithubProvider;
