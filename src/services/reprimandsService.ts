import { PostReprimand, Reprimand } from "@/types/reprimand";

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

export async function GET_reprimand(id: string) {
  const response = await fetch(`/api/reprimands/${id}`, {
    headers: { "Content-Type": "application/json" },
  });

  return response;
}

export async function GET_reprimandsByMemberFullname(memberFullname: string) {
  const response = await fetch(
    `/api/reprimands?memberFullname=${memberFullname}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response;
}

export async function PUT_reprimand(reprimand: Reprimand) {
  const response = await fetch(`/api/reprimands/${reprimand.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...reprimand }),
  });

  return response;
}

export async function DELETE_reprimand(id: string) {
  const response = await fetch(`/api/reprimands/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  return response;
}
