import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import style from "./Header.module.scss";

const Header = () => {
  const router = useRouter();
  const goTo = (route: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(route);
  };

  return (
    <div className={style.headerContainer}>
      <h3 className={style.title}>Studentski Ponedjeljak</h3>
      <div className={style.rightHeaderWrapper}>
        <Button size="xs" onClick={goTo("/")}>
          Naslovnica
        </Button>
        <Button size="xs" onClick={goTo("/login")}>
          Prijava
        </Button>
      </div>
    </div>
  );
};

export default Header;
