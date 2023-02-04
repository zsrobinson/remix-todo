import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader({}: LoaderArgs) {
  let todos = await prisma.todos.findMany();
  return json(todos);
}

export default function Index() {
  const todos = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix Todo!</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <Form
              method="post"
              style={{ display: "inline", paddingRight: "4px" }}
            >
              <input type="hidden" name="id" value={todo.id} />
              <input
                type="hidden"
                name="completed"
                value={todo.completed.toString()}
              />
              <button type="submit" name="_action" value="toggle">
                {todo.completed ? "[✓]" : "[ ]"}
              </button>
            </Form>

            {todo.title}

            <Form
              method="post"
              style={{ display: "inline", paddingLeft: "4px" }}
            >
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit" name="_action" value="remove">
                X
              </button>
            </Form>
          </li>
        ))}
        <li>
          <Form method="post">
            <input name="title" />
            <button
              type="submit"
              name="_action"
              value="add"
              style={{ marginLeft: "4px" }}
            >
              Add Todo
            </button>
          </Form>
        </li>
      </ul>
    </div>
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
