import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState, logout } from "@/store/store";
import style from "./Header.module.scss";
import { notifications } from "@mantine/notifications";

const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();
  const goTo = (route: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(route);
  };
  const titleGoTo = () => {
    router.push("/");
  };

  const handleLoginLogoutButton = () => {
    if (isAuthenticated) {
      notifications.show({
        title: "Uspješna odjava",
        message: "Uspješno ste se odjavili!",
        color: "green",
      });
      dispatch(logout());
      router.push("/");
    } else router.push("/login");
  };

  return (
    <div className={style.headerContainer}>
      <h3 className={style.titleContainer} onClick={titleGoTo}>
        <img className={style.icon} src="/favicon.png" />
        Studentski Ponedjeljak
      </h3>
      <div className={style.rightHeaderWrapper}>
        <Button size="xs" variant="outline" onClick={goTo("/")}>
          Naslovnica
        </Button>
        <Button size="xs" variant="outline" onClick={goTo("/members")}>
          Članovi
        </Button>
        <Button size="xs" variant="outline" onClick={handleLoginLogoutButton}>
          {isAuthenticated ? "Odjava" : "Prijava"}
        </Button>
      </div>
    </div>
  );
};

export default Header;
