import type { PostMember } from "@/types/member";

export async function POST_member(member: PostMember) {
  const response = await fetch("/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...member }),
  });

  return response;
}
