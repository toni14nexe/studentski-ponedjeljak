import { PostReprimand } from "@/types/reprimand";

export async function GET_reprimands() {
  const response = await fetch(`/api/reprimands`);

  return response;
}

export async function POST_reprimand(reprimand: PostReprimand) {
  const response = await fetch("/api/reprimands", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...reprimand }),
  });

  return response;
}
