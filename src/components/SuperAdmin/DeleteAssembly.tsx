import { useState } from "react";
import { Button, Input } from "@mantine/core";
import { DELETE_assembly, GET_assembly } from "@/services/assembliesService";
import { useRouter } from "next/router";
import { GET_member, PUT_member } from "@/services/membersService";
import { Member } from "@/types/member";

const DeleteAssembly = () => {
  const router = useRouter();
  let [id, setId] = useState<string>();

  const deleteAssembly = () => {
    GET_assembly(String(id))
      .then((response) => response.json())
      .then((data) => {
        const members = JSON.parse(data.members).filter(
          (member: any) => member.arrived
        );
        DELETE_assembly(String(id));
        members.forEach((member: Member) => {
          GET_member(String(member.id)).then((memberResponse) => {
            memberResponse.json().then((memberData: Member) => {
              memberData.activeAbsences--;
              memberData.totalAbsences--;
              PUT_member(memberData);
              router.push("/");
            });
          });
        });
      });
  };

  return (
    <div>
      <h1>Obriši Sastanak</h1>

      <Input.Wrapper label="ID sastanka">
        <Input
          style={{ width: "200px" }}
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID sastanka"
        />
      </Input.Wrapper>

      <br />
      <Button onClick={deleteAssembly}>Obriši</Button>
    </div>
  );
};

export default DeleteAssembly;
