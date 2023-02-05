import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import {
  IconSquareRounded,
  IconSquareRoundedCheck,
  IconSquareRoundedPlus,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { prisma } from "~/db.server";

export async function loader({}: LoaderArgs) {
  let todos = await prisma.todos.findMany();
  return json(todos);
}

export default function Index() {
  const todos = useLoaderData<typeof loader>();

  const transition = useTransition();
  const isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "add";
  let addFormRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    // triggers after adding a todo
    if (!isAdding) {
      addFormRef.current?.reset();
    }
  }, [isAdding]);

  return (
    <main className="m-4">
      <h2 className="text-xl font-semibold mb-4">Default Todo List</h2>
      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex gap-2 items-center">
            <Form method="post" className="flex items-center">
              <input type="hidden" name="id" value={todo.id} />
              <input
                type="hidden"
                name="completed"
                value={todo.completed.toString()}
              />
              <button type="submit" name="_action" value="toggle">
                {todo.completed ? (
                  <IconSquareRoundedCheck />
                ) : (
                  <IconSquareRounded />
                )}
              </button>
            </Form>

            {todo.title}

            <Form method="post" className="flex items-center">
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit" name="_action" value="remove">
                <IconX size={16} className="text-zinc-500 mt-[2px]" />
              </button>
            </Form>
          </li>
        ))}

        <li>
          <Form
            method="post"
            className="flex gap-2 items-center"
            ref={addFormRef}
          >
            <button type="submit" name="_action" value="add">
              <IconSquareRoundedPlus />
            </button>
            <input
              name="title"
              className="bg-zinc-900 border-zinc-500 border-b focus:border-zinc-300 focus:outline-0"
            />
          </Form>
        </li>
      </ul>
    </main>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action") as string;

  if (action === "add") {
    const title = formData.get("title") as string;
    await prisma.todos.create({ data: { title } });
  }

  if (action === "remove") {
    const id = formData.get("id") as string;
    await prisma.todos.delete({ where: { id } });
  }

  if (action === "toggle") {
    const id = formData.get("id") as string;
    const completed = formData.get("completed") === "true";

    await prisma.todos.update({
      where: { id },
      data: { completed: !completed },
    });
  }

  return {};
}
