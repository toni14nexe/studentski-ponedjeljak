import { Input, PasswordInput, Button, Notification } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/store";
import { useRouter } from "next/router";
import style from "./Login.module.scss";
import { notifications } from "@mantine/notifications";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loginValue, setLoginValue] = useState({
    username: "",
    password: "",
  });
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const login = () => {
    if (
      loginValue.username === process.env.NEXT_PUBLIC_LOGIN_USERNAME &&
      loginValue.password === process.env.NEXT_PUBLIC_LOGIN_PASSWORD
    ) {
      dispatch(loginSuccess());
      router.push("/");
      notifications.show({
        title: "Uspješna prijava",
        message: "Uspješno ste se prijavili!",
        color: "green",
      });
    } else {
      setShowErrorNotification(true);
      setLoginValue(() => ({
        username: "",
        password: "",
      }));
    }
  };

  return (
    <div className={style.loginContainer}>
      <h3>Prijava</h3>
      <Input.Wrapper className={style.input} label="Korisničko ime">
        <Input
          name="username"
          value={loginValue.username}
          onChange={handleInputChange}
          placeholder="Korisničko ime"
          radius="xl"
          onKeyDown={getHotkeyHandler([["enter", login]])}
        />
      </Input.Wrapper>
      <Input.Wrapper className={style.input} label="Lozinka">
        <PasswordInput
          name="password"
          value={loginValue.password}
          onChange={handleInputChange}
          placeholder="Lozinka"
          radius="xl"
          onKeyDown={getHotkeyHandler([["enter", login]])}
        />
      </Input.Wrapper>
      <Button size="xs" variant="outline" onClick={login}>
        Prijava
      </Button>

      {showErrorNotification && (
        <Notification
          className={style.errorNotification}
          title="Obavijest"
          color="red"
          onClose={() => setShowErrorNotification(false)}
          withCloseButton
        >
          Pogrešno korisničko ime ili lozinka. Molimo pokušajte ponovo.
        </Notification>
      )}
    </div>
  );
};

export default Login;
