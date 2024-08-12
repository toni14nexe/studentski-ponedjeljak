import { useState } from "react";
import { Button, Input } from "@mantine/core";
import { useRouter } from "next/router";
import { DELETE_reprimand, GET_reprimand } from "@/services/reprimandsService";
import { GET_membersByUsername, PUT_member } from "@/services/membersService";
import { Member } from "@/types/member";

const DeleteReprimand = () => {
  const router = useRouter();
  let [id, setId] = useState<string>();

  const deleteReprimand = () => {
    GET_reprimand(String(id))
      .then((response) => response.json())
      .then((data) => {
        GET_membersByUsername(data.fullname)
          .then((response) => response.json())
          .then((data: Member) => {
            data.activeReprimands--;
            data.totalReprimands--;
            DELETE_reprimand(String(id));
            PUT_member(data);
            router.push("/");
          });
      });
  };

  return (
    <div>
      <h1>Obriši Ukor</h1>

      <Input.Wrapper label="ID ukora">
        <Input
          style={{ width: "200px" }}
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID ukora"
        />
      </Input.Wrapper>

      <br />
      <Button onClick={deleteReprimand}>Obriši</Button>
    </div>
  );
};

export default DeleteReprimand;
