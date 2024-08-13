import { useState } from "react";
import { Button, Input } from "@mantine/core";
import { useRouter } from "next/router";
import { DELETE_law } from "@/services/lawsService";

const DeleteLaw = () => {
  const router = useRouter();
  let [id, setId] = useState<string>();

  const deleteLaw = () => {
    DELETE_law(String(id)).then(() => router.push("/"));
  };

  return (
    <div>
      <h1>Obriši Zakon</h1>

      <Input.Wrapper label="ID zakona">
        <Input
          style={{ width: "200px" }}
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID zakona"
        />
      </Input.Wrapper>

      <br />
      <Button onClick={deleteLaw} variant="outline">
        Obriši
      </Button>
    </div>
  );
};

export default DeleteLaw;
