import { useState } from "react";
import { Button, Input } from "@mantine/core";
import { useRouter } from "next/router";
import { DELETE_member, GET_member } from "@/services/membersService";
import {
  DELETE_reprimand,
  GET_reprimandsByMemberFullname,
} from "@/services/reprimandsService";
import { Reprimand } from "@/types/reprimand";

const DeleteMember = () => {
  const router = useRouter();
  let [id, setId] = useState<string>();

  const deleteMember = () => {
    GET_member(String(id)).then((memberResponse) =>
      memberResponse.json().then((memberData) => {
        GET_reprimandsByMemberFullname(memberData.fullname).then(
          (reprimandsResponse) =>
            reprimandsResponse.json().then((reprimandsData) => {
              reprimandsData.forEach((reprimand: Reprimand) =>
                DELETE_reprimand(String(reprimand.id))
              );
              DELETE_member(String(id));
              router.push("/");
            })
        );
      })
    );
  };

  return (
    <div>
      <h1>Obriši Člana</h1>

      <Input.Wrapper label="ID člana">
        <Input
          style={{ width: "200px" }}
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID člana"
        />
      </Input.Wrapper>

      <br />
      <Button onClick={deleteMember} variant="outline">
        Obriši
      </Button>
    </div>
  );
};

export default DeleteMember;
