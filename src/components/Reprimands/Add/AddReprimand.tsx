import { ChangeEvent, useEffect, useState } from "react";
import {
  Input,
  Button,
  Notification,
  Select,
  LoadingOverlay,
  Textarea,
} from "@mantine/core";
import style from "./AddReprimand.module.scss";
import { useRouter } from "next/router";
import { GET_allMembers } from "@/services/membersService";
import { Member } from "@/types/member";
import { notifications } from "@mantine/notifications";
import { POST_reprimand } from "@/services/reprimandsService";

type FormData = {
  member: string;
  note: string;
};

type Option = {
  value: string;
  label: string;
};

const AddReprimand = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    member: "",
    note: "",
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [memberOptions, setMemberOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setShowNotification] = useState({
    show: false,
    title: "",
    color: "",
  });

  useEffect(() => {
    GET_allMembers()
      .then((response) => response.json())
      .then((data) => {
        setMembers(data);
        setMemberOptions(
          data.map((member: Member) => ({
            value: member.id.toString(),
            label: member.fullname,
          }))
        );
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = isFormDataValid(form);

    if (isValid) {
      const selectedMemberFullname = members.filter(
        (member) => member.id === Number(form.member)
      )[0].fullname;
      const response = await POST_reprimand({
        fullname: selectedMemberFullname,
        note: form.note,
      });

      if (response.ok) {
        router.push("/reprimands");
        notifications.show({
          title: "Uspješno dodano",
          message: "Novi ukor je uspješno dodan!",
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
    if (!form.member) {
      setShowNotification({
        show: true,
        title: "Član mora biti izabran!",
        color: "red",
      });
      return false;
    } else if (!form.note) {
      setShowNotification({
        show: true,
        title: "Opis mora biti popunjen!",
        color: "red",
      });
      return false;
    }

    return true;
  };

  const handleFullnameChange = (value: string | null) => {
    if (value !== null) setForm({ ...form, member: value });
  };

  const handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, note: e.target.value });
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
    <div className={style.addReprimandContainer}>
      <h1>Novi Ukor</h1>
      <form onSubmit={handleSubmit} className={style.formWrapper}>
        <Select
          className={style.input}
          label="Član *"
          placeholder="Član"
          data={memberOptions}
          value={form.member}
          onChange={handleFullnameChange}
        />

        <Input.Wrapper className={style.input} label="Opis *">
          <Textarea
            className={style.input}
            name="note"
            value={form.note}
            onChange={handleNoteChange}
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
            Dodaj Ukor
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

export default AddReprimand;
