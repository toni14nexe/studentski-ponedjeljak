import { useState } from "react";
import { Button, Input } from "@mantine/core";
import { useRouter } from "next/router";
import { DELETE_member } from "@/services/membersService";

const Reprimands = () => {
  const router = useRouter();
  let [id, setId] = useState<string>();

  const deleteMember = () => {
    DELETE_member(String(id)).then(() => router.push("/"));
  };

  return (
    <div>
      <h1>Obriši člana</h1>

      <Input.Wrapper label="ID člana">
        <Input
          style={{ width: "200px" }}
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID člana"
        />
      </Input.Wrapper>

      <br />
      <Button onClick={deleteMember}>Obriši</Button>
    </div>
  );
};

export default Reprimands;
