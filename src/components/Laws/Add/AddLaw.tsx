import { useState } from "react";
import { Input, Button, Notification } from "@mantine/core";
import style from "./AddLaw.module.scss";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { POST_law } from "@/services/lawsService";

type FormData = {
  name: string;
  description: string;
};

const AddLaw = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [notification, setShowNotification] = useState({
    show: false,
    title: "",
    color: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = isFormDataValid(form);

    if (isValid) {
      const response = await POST_law({
        name: form.name,
        description: form.description,
      });

      if (response.ok) {
        router.push("/laws");
        notifications.show({
          title: "Uspješno dodano",
          message: "Novi zakon je uspješno dodan!",
          color: "green",
        });
      } else
        setShowNotification({
          show: true,
          title: "Nešto je pošlo po krivu!",
          color: "red",
        });
    }
  };

  const isFormDataValid = (form: FormData) => {
    if (!form.name) {
      setShowNotification({
        show: true,
        title: "Naziv mora biti popunjeni!",
        color: "red",
      });
      return false;
    } else if (!form.description) {
      setShowNotification({
        show: true,
        title: "Opis mora biti popunjen!",
        color: "red",
      });
      return false;
    }

    return true;
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, name: event.target.value });
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, description: event.target.value });
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className={style.addLawContainer}>
      <h1>Novi Zakon</h1>
      <form onSubmit={handleSubmit} className={style.formWrapper}>
        <Input.Wrapper className={style.input} label="Naziv *">
          <Input
            className={style.input}
            name="note"
            value={form.name}
            onChange={handleNameChange}
            placeholder="Zakon 1 Stavak 1"
          />
        </Input.Wrapper>

        <Input.Wrapper className={style.input} label="Opis *">
          <Input
            className={style.input}
            name="note"
            value={form.description}
            onChange={handleDescriptionChange}
            placeholder="Opis..."
          />
        </Input.Wrapper>

        <div className={style.buttonsContainer}>
          <Button size="xs" variant="outline" color="red" onClick={goBack}>
            Odustani
          </Button>
          <Button size="xs" variant="outline" type="submit">
            Dodaj Zakon
          </Button>
        </div>
      </form>

      {notification.show && (
        <Notification
          className={style.errorNotification}
          title="Obavijest"
          color={notification.color}
          onClose={() =>
            setShowNotification((prevState) => ({
              ...prevState,
              show: false,
            }))
          }
          withCloseButton
        >
          {notification.title}
        </Notification>
      )}
    </div>
  );
};

export default AddLaw;
