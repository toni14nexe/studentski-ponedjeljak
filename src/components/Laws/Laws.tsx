import { useState, useEffect } from "react";
import { ActionIcon, Button, LoadingOverlay, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import style from "./Laws.module.scss";
import { useRouter } from "next/router";
import { GET_laws } from "@/services/lawsService";
import { Law } from "@/types/law";

const Laws = () => {
  const router = useRouter();
  const [laws, setLaws] = useState<Law[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => getLaws(), []);

  const getLaws = () => {
    GET_laws()
      .then((response) => response.json())
      .then((data) => {
        setLaws(data);
        setLoading(false);
      });
  };

  const goTo = (url: string) => {
    router.push(url);
  };

  if (loading)
    return (
      <LoadingOverlay
        visible={true}
        overlayProps={{ backgroundOpacity: 0.5, color: "black" }}
        loaderProps={{ type: "bars" }}
      />
    );

  return (
    <div>
      <div className={style.mainWrapper}>
        <h1>Zakoni</h1>
        <div className={style.buttonContainer}>
          <ActionIcon
            className={style.plusButton}
            variant="outline"
            onClick={() => goTo("/laws/add")}
          >
            <IconPlus stroke={1.5} />
            Zakon
          </ActionIcon>
        </div>
      </div>

      <div className={style.lawsContainer}>
        {laws?.map((law) => (
          <div key={law.id}>
            <Text>
              <b>{law.name}</b>
            </Text>
            <Text>{law.description}</Text>
            <div className={style.buttonsWrapper}>
              <Button onClick={() => goTo(`/laws/edit/${law.id}`)}>
                Uredi
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Laws;
