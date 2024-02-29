import { createContext } from './context'
import { createCaller } from './router'
// 2. create a caller using your `Context`
export const appCaller = createCaller(await createContext())

// // 3. use the caller to add and list posts
// const addedPost = await caller.post.add({
//   title: 'How to make server-side call in tRPC',
// });

// const postList = await appCaller.post.list();

export type AppCaller = typeof appCaller
