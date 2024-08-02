import { useState } from "react";
import { Button, Input } from "@mantine/core";
import { DELETE_assembly } from "@/services/assembliesService";
import { useRouter } from "next/router";

const Reprimands = () => {
  const router = useRouter();
  let [id, setId] = useState<string>();

  const deleteAssembly = () => {
    DELETE_assembly(String(id)).then(() => router.push("/"));
  };

  return (
    <div>
      <h1>Obriši sastanak</h1>

      <Input.Wrapper label="ID sastanka">
        <Input
          name="note"
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

export default Reprimands;
