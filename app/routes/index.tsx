import { LoaderArgs, redirect } from "@remix-run/node";

export async function loader({}: LoaderArgs) {
  return redirect("list");
}
