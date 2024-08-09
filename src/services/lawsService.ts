import { Law, PostLaw } from "@/types/law";

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

export async function GET_law(id: string) {
  const response = await fetch(`/api/laws/${id}`, {
    headers: { "Content-Type": "application/json" },
  });

  console.log(response);

  return response;
}

export async function PUT_law(law: Law) {
  const response = await fetch(`/api/laws/${law.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...law }),
  });

  return response;
}

export async function DELETE_law(id: string) {
  const response = await fetch(`/api/laws/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  return response;
}
