import { LoaderArgs, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";

export async function loader({}: LoaderArgs) {
  const firstList = await prisma.list.findFirst();

  if (!firstList) throw new Response("No Lists Found", { status: 404 });

  return redirect(`/list/${firstList.id}`);
}
