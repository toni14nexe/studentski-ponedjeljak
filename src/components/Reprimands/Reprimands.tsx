import { useState, useEffect } from "react";
import { ActionIcon, Button, LoadingOverlay, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import style from "./Reprimands.module.scss";
import { useRouter } from "next/router";
import { Reprimand } from "@prisma/client";
import { GET_reprimands } from "@/services/reprimandsService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Reprimands = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();
  const [reprimands, setReprimands] = useState<Reprimand[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => getReprimands(), []);

  const getReprimands = () => {
    GET_reprimands()
      .then((response) => response.json())
      .then((data) => {
        setReprimands(data);
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
        <h1>Ukori</h1>
        <div className={style.buttonContainer}>
          {isAuthenticated && (
            <ActionIcon
              className={style.plusButton}
              variant="outline"
              onClick={() => goTo("/reprimands/add")}
            >
              <IconPlus stroke={1.5} />
              Ukor
            </ActionIcon>
          )}
        </div>
      </div>

      <div className={style.reprimandsContainer}>
        {reprimands?.map((reprimand) => (
          <div key={reprimand.id}>
            <Text>
              <b>{reprimand.fullname}</b>
            </Text>
            <Text>{reprimand.note}</Text>
            {isAuthenticated && (
              <Button
                className={style.editButton}
                onClick={() => goTo(`reprimands/edit/${reprimand.id}`)}
                variant="outline"
              >
                Uredi
              </Button>
            )}
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reprimands;
