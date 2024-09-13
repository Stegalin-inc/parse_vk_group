const api = <T = any>(url: string) => {
  return fetch("/api/" + url).then((x) => x.json() as Promise<T>);
};

export default {
  postByUser: (uid: number) => api("postsbyuser/" + uid),
  top: (from?: number, to?: number) => api(["topusers", from, to].filter(Boolean).join("/")),
  users: () => api("users"),
  last10: () => api("last10"),
  allpostsshort: () =>
    api<{ uid: number; d: number; c: number; l: number; t: number }[]>("allpostsshort"),
};
