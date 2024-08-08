import { useState } from "react";
import { Button, Input } from "@mantine/core";
import { useRouter } from "next/router";
import { DELETE_reprimand } from "@/services/reprimandsService";

const DeleteReprimand = () => {
  const router = useRouter();
  let [id, setId] = useState<string>();

  const deleteReprimand = () => {
    DELETE_reprimand(String(id)).then(() => router.push("/"));
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
