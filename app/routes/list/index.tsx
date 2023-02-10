import { LoaderArgs, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";

export async function loader({}: LoaderArgs) {
  const firstList = await prisma.list.findFirst();
  if (firstList) return redirect(`/list/${firstList.id}`);

  const newList = await prisma.list.create({
    data: { title: "Default List", color: "gray" },
  });
  return redirect(`/list/${newList.id}`);
}
