import type { PostMember, Member } from "@/types/member";

export async function POST_member(member: PostMember) {
  const response = await fetch("/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...member }),
  });

  return response;
}

export async function GET_allMembers() {
  const response = await fetch("/api/members", {
    headers: { "Content-Type": "application/json" },
  });

  return response;
}

export async function GET_member(id: string) {
  const response = await fetch(`/api/members/${id}`, {
    headers: { "Content-Type": "application/json" },
  });

  return response;
}

export async function PUT_member(member: Member) {
  const response = await fetch(`/api/members/${member.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...member }),
  });

  return response;
}

export async function DELETE_member(id: string) {
  const response = await fetch(`/api/members/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  return response;
}
