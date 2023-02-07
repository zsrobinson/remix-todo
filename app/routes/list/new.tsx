import { ActionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { IconPlus } from "@tabler/icons-react";
import { prisma } from "~/db.server";

export default function NewList() {
  return (
    <main className="m-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Create a New List</h2>
      <Form method="post" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="">
            Name
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="rounded-md border border-zinc-700 bg-zinc-800 p-2"
          />
        </div>
        <div>
          <div className="flex flex-col gap-1">
            <label htmlFor="color" className="">
              Color
            </label>
            <select
              name="color"
              id="color"
              defaultValue="gray"
              required
              className="rounded-md border border-zinc-700 bg-zinc-800 p-2"
            >
              <option value="white">White</option>
              <option value="gray">Gray</option>
              <option value="black">Black</option>
              <option value="red">Red</option>
              <option value="orange">Orange</option>
              <option value="amber">Amber</option>
              <option value="yellow">Yellow</option>
              <option value="lime">Lime</option>
              <option value="green">Green</option>
              <option value="emerald">Emerald</option>
              <option value="teal">Teal</option>
              <option value="cyan">Cyan</option>
              <option value="sky">Sky</option>
              <option value="blue">Blue</option>
              <option value="indigo">Indigo</option>
              <option value="violet">Violet</option>
              <option value="purple">Purple</option>
              <option value="fuchsia">Fuchsia</option>
              <option value="pink">Pink</option>
              <option value="rose">Rose</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-md border border-zinc-700 p-3 text-zinc-300 transition hover:bg-zinc-700 hover:bg-opacity-50"
        >
          <IconPlus size={16} />
          <span className="font-semibold leading-none">Create List</span>
        </button>
      </Form>
    </main>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const color = formData.get("color") as string;

  const list = await prisma.list.create({ data: { title, color } });

  return redirect(`/list/${list.id}`);
}
