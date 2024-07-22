import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import style from "./AddAssemblieButton.module.scss";

const Home = () => {
  const router = useRouter();
  const goToAddAssemblyPage = () => {
    router.push("/add-assembly");
  };

  return (
    <div>
      <ActionIcon
        className={style.plusButton}
        variant="filled"
        onClick={goToAddAssemblyPage}
      >
        <IconPlus stroke={1.5} />
        Sastanak
      </ActionIcon>
    </div>
  );
};

export default Home;
