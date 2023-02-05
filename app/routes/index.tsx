import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import {
  IconSquareRounded,
  IconSquareRoundedCheck,
  IconSquareRoundedPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { prisma } from "~/db.server";

export async function loader({}: LoaderArgs) {
  const [todos, completedItems] = await Promise.all([
    prisma.todos.findMany({
      orderBy: {
        completed: "asc",
      },
    }),
    prisma.todos.count({
      where: {
        completed: true,
      },
    }),
  ]);

  return json({ todos, completedItems });
}

export default function Index() {
  const { todos, completedItems } = useLoaderData<typeof loader>();

  const transition = useTransition();
  const isAdding = transition.submission?.formData.get("_action") === "add";
  const isRemoving =
    transition.submission?.formData.get("_action") === "remove";

  let addFormRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    // triggers after adding a todo
    if (!isAdding) {
      addFormRef.current?.reset();
    }
  }, [isAdding]);

  return (
    <main className="m-4">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-xl font-semibold">Default Todo List</h2>
        {completedItems > 0 && (
          <Form method="post">
            <button
              type="submit"
              name="_action"
              value="clear"
              className="flex items-center gap-1 rounded-md bg-zinc-800 py-1 px-2 text-xs text-zinc-400"
            >
              <IconTrash size={14} />
              Clear Completed Items
            </button>
          </Form>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center gap-2 ${
              todo.completed && "text-zinc-500 line-through"
            }`}
          >
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
              <button
                type="submit"
                name="_action"
                value="remove"
                disabled={
                  isRemoving &&
                  todo.id === transition.submission?.formData.get("id")
                }
              >
                <IconX size={16} className="mt-[2px] text-zinc-500" />
              </button>
            </Form>
          </li>
        ))}

        <li>
          <Form
            method="post"
            className="flex items-center gap-2"
            ref={addFormRef}
          >
            <button
              type="submit"
              name="_action"
              value="add"
              disabled={isAdding}
            >
              <IconSquareRoundedPlus />
            </button>
            <input
              name="title"
              className="border-b border-zinc-500 bg-zinc-900 focus:border-zinc-300 focus:outline-0"
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

  if (action === "clear") {
    return await prisma.todos.deleteMany({ where: { completed: true } });
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
