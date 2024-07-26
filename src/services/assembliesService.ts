import type { PostAssembly } from "@/types/assembly";
import type { Member } from "@/types/member";
import { PUT_member } from "./membersService";

export async function GET_assemblies() {
  const response = await fetch("/api/assemblies");

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
