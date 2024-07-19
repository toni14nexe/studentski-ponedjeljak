import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState, logout } from "@/store/store";
import style from "./Header.module.scss";

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

  const handleLoginLogoutButton = () => {
    if (isAuthenticated) dispatch(logout());
    else router.push("/login");
  };

  return (
    <div className={style.headerContainer}>
      <h3 className={style.title}>Studentski Ponedjeljak</h3>
      <div className={style.rightHeaderWrapper}>
        <Button size="xs" onClick={goTo("/")}>
          Naslovnica
        </Button>
        <Button size="xs" onClick={handleLoginLogoutButton}>
          {isAuthenticated ? "Odjava" : "Prijava"}
        </Button>
      </div>
    </div>
  );
};

export default Header;
