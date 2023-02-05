import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { IconSquareRoundedCheck } from "@tabler/icons-react";
import styles from "./styles/app.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-zinc-900 text-zinc-50 flex h-screen">
        <Sidebar />
        <Outlet />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Sidebar() {
  return (
    <div className="w-64 h-full bg-zinc-800 bg-opacity-50 text-zinc-50">
      <div className="flex items-center justify-center border-b border-zinc-700 gap-2">
        <IconSquareRoundedCheck />
        <h1 className="text-2xl font-bold my-4">Remix Todo</h1>
      </div>
      <nav className="flex flex-col p-4 gap-2">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/todos">Todos</NavLink>
      </nav>
    </div>
  );
}
