import { useEffect, useState } from "react";
import { Input, Button, Notification, LoadingOverlay } from "@mantine/core";
import style from "./EditReprimand.module.scss";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { GET_reprimand, PUT_reprimand } from "@/services/reprimandsService";
import { Reprimand } from "@/types/reprimand";

const EditReprimand = () => {
  const router = useRouter();
  const [form, setForm] = useState<Reprimand>({
    id: 0,
    fullname: "",
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [notification, setShowNotification] = useState({
    show: false,
    title: "",
    color: "",
  });

  useEffect(() => {
    if (router.query.id) {
      GET_reprimand(String(router.query.id))
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
      const response = await PUT_reprimand(form);

      if (response.ok) {
        router.push("/reprimands");
        notifications.show({
          title: "Uspješno uređeno",
          message: "Ukor je uspješno uređen!",
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

  const isFormDataValid = (form: Reprimand) => {
    if (!form.note) {
      setShowNotification({
        show: true,
        title: "Opis mora biti popunjen!",
        color: "red",
      });
      return false;
    }

    return true;
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, note: event.target.value });
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
    <div className={style.editReprimandContainer}>
      <h1>Uredi Ukor</h1>
      <form onSubmit={handleSubmit} className={style.formWrapper}>
        <span>
          Član: <b>{form.fullname}</b>
        </span>

        <Input.Wrapper className={style.input} label="Opis *">
          <Input
            className={style.input}
            name="note"
            value={form.note}
            onChange={handleNoteChange}
            placeholder="Opis..."
          />
        </Input.Wrapper>

        <div className={style.buttonsContainer}>
          <Button size="xs" variant="outline" color="red" onClick={goBack}>
            Odustani
          </Button>
          <Button size="xs" variant="outline" type="submit">
            Uredi Ukor
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

export default EditReprimand;
