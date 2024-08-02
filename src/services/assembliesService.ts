import type { PostAssembly } from "@/types/assembly";
import type { Member } from "@/types/member";
import { PUT_member } from "./membersService";
import { Assembly } from "@prisma/client";

export async function GET_assemblies(page: number, perPage: number) {
  const response = await fetch(
    `/api/assemblies?page=${page}&perPage=${perPage}`
  );

  return response;
}

export async function POST_assembly(
  assembly: PostAssembly,
  allMembers: Member[]
) {
  assembly.members.forEach((member) => {
    const tempMember = allMembers.filter(
      (fullMember) => fullMember.id === member.id
    )[0];
    if (member.pregnant || !member.arrived) {
      if (member.pregnant) tempMember.pregnantTimes++;
      if (!member.arrived) {
        tempMember.totalAbsences++;
        tempMember.activeAbsences++;
      }
      PUT_member(tempMember);
    }
  });

  const response = await fetch("/api/assemblies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...assembly }),
  });

  return response;
}

export async function GET_assembly(id: string) {
  const response = await fetch(`/api/assemblies/${id}`, {
    headers: { "Content-Type": "application/json" },
  });

  return response;
}

export async function PUT_assembly(assembly: Assembly) {
  const response = await fetch(`/api/assemblies/${assembly.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...assembly }),
  });

  return response;
}

export async function DELETE_assembly(id: string) {
  const response = await fetch(`/api/assemblies/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  return response;
}
