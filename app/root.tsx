import { List } from "@prisma/client";
import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { IconSquareRoundedCheck } from "@tabler/icons-react";
import { prisma } from "./db.server";
import styles from "./styles/app.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader({}: LoaderArgs) {
  let lists = await prisma.list.findMany();
  return json(lists);
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex h-screen bg-zinc-900 text-zinc-50">
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
  const lists = useLoaderData<typeof loader>();

  return (
    <div className="h-full w-64 bg-zinc-800 bg-opacity-50 text-zinc-50">
      <div className="flex items-center justify-center gap-2 border-b border-zinc-700">
        <IconSquareRoundedCheck />
        <h1 className="my-4 text-2xl font-bold">Remix Todo</h1>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {lists.map((list) => (
          <ListLink key={list.id} {...list} />
        ))}
      </nav>
    </div>
  );
}

function ListLink({
  id,
  title,
  color,
}: {
  id: string;
  title: string;
  color: string;
}) {
  const colorVariants = {
    white: "bg-zinc-50",
    gray: "bg-zinc-500",
    black: "bg-zinc-900",
    red: "bg-red-500",
    orange: "bg-orange-500",
    amber: "bg-amber-500",
    yellow: "bg-yellow-500",
    lime: "bg-lime-500",
    green: "bg-green-500",
    emerald: "bg-emerald-500",
    teal: "bg-teal-500",
    cyan: "bg-cyan-500",
    sky: "bg-sky-500",
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    purple: "bg-purple-500",
    fuchsia: "bg-fuchsia-500",
    pink: "bg-pink-500",
    rose: "bg-rose-500",
  };

  if (!colorVariants[color as keyof typeof colorVariants]) {
    color = "gray";
  }

  return (
    <NavLink
      to={`/list/${id}`}
      className="flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-zinc-700 hover:bg-opacity-50"
    >
      <div
        className={`h-3 w-3 rounded-full ${
          colorVariants[color as keyof typeof colorVariants]
        }`}
      ></div>
      <span className="font-semibold leading-none">{title}</span>
    </NavLink>
  );
}
