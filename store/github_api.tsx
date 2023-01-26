import { createContext, useEffect, useState } from "react";

export type GithubUserType = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: string;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export const GithubCtx = createContext({
  user: {} as GithubUserType,
  setUser: (user: GithubUserType) => { },
});

const GithubProvider = ({ children }: any) => {
  const [user, setUser] = useState({} as GithubUserType);

  useEffect(() => {
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
  }, []);

  return (
    <GithubCtx.Provider value={{ user, setUser }}>
      {children}
    </GithubCtx.Provider>
  );
};

export default GithubProvider;
