# Remix Todo Demo

A demo of using Remix loaders and actions in a simple todo app to learn more about Prisma ORM. 

### Run this project locally

Since I don't want to host a public database and deal with authentication and all of that for a simple demo project, you'll have to run it locally to see it in action. Thankfully, it's not that many steps:

```bash
git clone https://github.com/zsrobinson/remix-todo.git
cd remix-todo
npm install
npx prisma db push
npm run dev
```
