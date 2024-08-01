import { PostLaw } from "@/types/law";

export async function GET_laws() {
  const response = await fetch(`/api/laws`);

  return response;
}

export async function POST_law(law: PostLaw) {
  const response = await fetch("/api/laws", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...law }),
  });

  return response;
}
