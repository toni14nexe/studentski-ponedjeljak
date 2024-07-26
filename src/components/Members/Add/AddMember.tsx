import { useState } from "react";
import { Input, Button, Notification } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import style from "./AddMember.module.scss";
import { useRouter } from "next/router";
import { POST_member } from "@/services/membersService";
import { notifications } from "@mantine/notifications";

type FormData = {
  fullname: string;
  birthday: Date;
  associated: Date;
};

const AddMember = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    birthday: new Date(),
    associated: new Date(),
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
      const response = await POST_member({
        fullname: form.fullname,
        birthday: form.birthday.toISOString(),
        associated: form.associated.toISOString(),
      });

      if (response.ok) {
        router.push("/");
        notifications.show({
          title: "Uspješno dodano",
          message: "Novi član je uspješno dodan!",
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
    if (!form.fullname) {
      setShowNotification({
        show: true,
        title: "Ime i prezime moraju biti popunjeni!",
        color: "red",
      });
      return false;
    } else if (!form.birthday) {
      setShowNotification({
        show: true,
        title: "Rođendan mora biti izabran!",
        color: "red",
      });
      return false;
    } else if (!form.associated) {
      setShowNotification({
        show: true,
        title: "Datum registracije mora biti izabran!",
        color: "red",
      });
      return false;
    }

    return true;
  };

  const handleFullnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, fullname: event.target.value });
  };

  const handleBirthdayChange = (birthday: Date | null) => {
    if (birthday) setForm({ ...form, birthday });
  };

  const handleAssociatedChange = (associated: Date | null) => {
    if (associated) setForm({ ...form, associated });
  };

  const goToDashboard = () => {
    router.back();
  };

  return (
    <div className={style.addMemberContainer}>
      <h1>Novi Sastanak</h1>
      <form onSubmit={handleSubmit} className={style.formWrapper}>
        <Input.Wrapper className={style.input} label="Ime i prezime *">
          <Input
            className={style.input}
            name="note"
            value={form.fullname}
            onChange={handleFullnameChange}
            placeholder="Ime i prezime"
          />
        </Input.Wrapper>

        <DateInput
          className={style.input}
          name="date"
          valueFormat="DD.MM.YYYY."
          value={form.birthday}
          onChange={handleBirthdayChange}
          label="Datum rođenja *"
          placeholder="Datum rođenja"
          previousIcon={
            <IconChevronLeft size={20} style={{ marginRight: "10px" }} />
          }
          nextIcon={
            <IconChevronRight size={20} style={{ marginLeft: "10px" }} />
          }
        />

        <DateInput
          className={style.input}
          name="date"
          valueFormat="DD.MM.YYYY."
          value={form.birthday}
          onChange={handleAssociatedChange}
          label="Datum registracije *"
          placeholder="Datum registracije"
          previousIcon={
            <IconChevronLeft size={20} style={{ marginRight: "10px" }} />
          }
          nextIcon={
            <IconChevronRight size={20} style={{ marginLeft: "10px" }} />
          }
        />

        <div className={style.buttonsContainer}>
          <Button
            size="xs"
            variant="outline"
            color="red"
            onClick={goToDashboard}
          >
            Odustani
          </Button>
          <Button size="xs" variant="outline" type="submit">
            Dodaj Člana
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

export default AddMember;
