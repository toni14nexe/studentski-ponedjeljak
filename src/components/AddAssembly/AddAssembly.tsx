import { useState } from "react";
import {
  Input,
  Button,
  Select,
  MultiSelect,
  Notification,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { POST_assembly } from "@/services/assembliesService";
import style from "./AddAssembly.module.scss";
import { useRouter } from "next/router";

type FormData = {
  date: Date;
  pregnant: string;
  note: string;
  members: string[];
};

const AddAssembly = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    date: new Date(),
    pregnant: "",
    note: "",
    members: [] as string[],
  });
  const [notification, setShowNotification] = useState({
    show: false,
    title: "",
    color: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = isFormDataValid(form);

    // TODO convert members utoAssemblyMembers[] type (object array - all members):
    // {
    //  fullname: string
    //  pregnant: boolean
    //  arrived: boolean
    // }[]

    if (isValid) {
      const response = await POST_assembly({
        date: form.date.toISOString(),
        pregnant: form.pregnant,
        note: form.note || "",
        members: form.members,
      });

      if (response.ok) router.push("/");
      else
        setShowNotification({
          show: true,
          title: "Nešto je pošlo po krivu!",
          color: "red",
        });
    }
  };

  const isFormDataValid = (form: FormData) => {
    if (!form.date) {
      setShowNotification({
        show: true,
        title: "Datum mora biti izabran!",
        color: "red",
      });
      return false;
    } else if (!form.pregnant) {
      setShowNotification({
        show: true,
        title: "Netko mora nabebiti!",
        color: "red",
      });
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) setForm({ ...form, date });
  };

  const handleSelectChange = (value: string | null) => {
    if (value !== null) setForm({ ...form, pregnant: value });
  };

  const handleMultiSelectChange = (values: string[]) => {
    setForm({ ...form, members: values });
  };

  return (
    <div className={style.addAssemblyContainer}>
      <h1>Novi Sastanak</h1>
      <form onSubmit={handleSubmit} className={style.formWrapper}>
        <DateInput
          className={style.input}
          name="date"
          valueFormat="DD.MM.YYYY."
          value={form.date}
          onChange={handleDateChange}
          label="Datum *"
          placeholder="Datum"
          previousIcon={
            <IconChevronLeft size={20} style={{ marginRight: "10px" }} />
          }
          nextIcon={
            <IconChevronRight size={20} style={{ marginLeft: "10px" }} />
          }
        />
        <Select
          className={style.input}
          label="Nabebio *"
          placeholder="Nabebio"
          data={["TK", "MM", "DM", "FB"]}
          value={form.pregnant}
          onChange={handleSelectChange}
        />
        <Input.Wrapper className={style.input} label="Bilješka">
          <Input
            className={style.input}
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Bilješka"
          />
        </Input.Wrapper>
        <MultiSelect
          className={style.input}
          label="Prisutni Članovi"
          placeholder={form.members.length ? "" : "Prisutni Članovi"}
          data={["TK", "MM", "DM", "FB"]}
          value={form.members}
          onChange={handleMultiSelectChange}
        />
        <div className={style.buttonsContainer}>
          <Button size="xs" variant="outline" color="red">
            Odustani
          </Button>
          <Button size="xs" variant="outline" type="submit">
            Dodaj Sastanak
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

export default AddAssembly;
