const api = (url: string) => {
  return fetch("/api/" + url).then((x) => x.json());
};

export default {
  postByUser: (uid: number) => api("postsbyuser/" + uid),
  top: (from?: number, to?: number) => api(["topusers", from, to].filter(Boolean).join("/")),
  users: () => api("users"),
  last10: () => api("last10"),
  allpostsshort: () => api("allpostsshort"),
};
