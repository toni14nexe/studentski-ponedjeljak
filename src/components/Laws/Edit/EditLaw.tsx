import { ChangeEvent, useEffect, useState } from "react";
import {
  Input,
  Button,
  Notification,
  LoadingOverlay,
  Textarea,
} from "@mantine/core";
import style from "./EditLaw.module.scss";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { Law } from "@/types/law";
import { GET_law, PUT_law } from "@/services/lawsService";

const EditLaw = () => {
  const router = useRouter();
  const [form, setForm] = useState<Law>({
    id: 0,
    name: "",
    description: "",
  });
  const [notification, setShowNotification] = useState({
    show: false,
    title: "",
    color: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.query.id) {
      GET_law(String(router.query.id))
        .then((response) => response.json())
        .then((data) => {
          setForm(data);
          setLoading(false);
        });
    }
  }, [router.query.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = isFormDataValid(form);

    if (isValid) {
      const response = await PUT_law(form);

      if (response.ok) {
        router.push("/laws");
        notifications.show({
          title: "Uspješno uređeno",
          message: "Zakon je uspješno uređen!",
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

  const isFormDataValid = (form: Law) => {
    if (!form.name) {
      setShowNotification({
        show: true,
        title: "Naziv mora biti popunjen!",
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

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, description: e.target.value });
  };

  const goBack = () => {
    router.back();
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
    <div className={style.editMemberContainer}>
      <h1>Uredi Zakon</h1>
      <form onSubmit={handleSubmit} className={style.formWrapper}>
        <Input.Wrapper className={style.input} label="Naziv *">
          <Input
            className={style.input}
            name="note"
            value={form.name}
            onChange={handleNameChange}
            placeholder="Članak 1"
          />
        </Input.Wrapper>

        <Input.Wrapper className={style.input} label="Opis *">
          <Textarea
            className={style.input}
            name="note"
            value={form.description}
            onChange={handleDescriptionChange}
            placeholder="Opis..."
            autosize
            minRows={2}
          />
        </Input.Wrapper>

        <div className={style.buttonsContainer}>
          <Button size="xs" variant="outline" color="red" onClick={goBack}>
            Odustani
          </Button>
          <Button size="xs" variant="outline" type="submit">
            Uredi Zakon
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

export default EditLaw;
