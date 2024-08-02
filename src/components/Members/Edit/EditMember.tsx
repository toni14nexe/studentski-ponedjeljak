import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Notification,
  LoadingOverlay,
  NumberInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import style from "./EditMember.module.scss";
import { useRouter } from "next/router";
import { GET_member, PUT_member } from "@/services/membersService";
import { notifications } from "@mantine/notifications";
import { Member } from "@/types/member";

type FormData = {
  id: number;
  fullname: string;
  birthday: Date;
  pregnantTimes: number;
  associated: Date;
  activeReprimands: number;
  totalReprimands: number;
  activeAbsences: number;
  totalAbsences: number;
  foodDebt: boolean;
};

const EditMember = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    id: 0,
    fullname: "",
    birthday: new Date(),
    pregnantTimes: 0,
    associated: new Date(),
    activeReprimands: 0,
    totalReprimands: 0,
    activeAbsences: 0,
    totalAbsences: 0,
    foodDebt: false,
  });
  const [notification, setShowNotification] = useState({
    show: false,
    title: "",
    color: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeAbsencesState, setActiveAbsencesState] = useState(0);
  const [activeReprimandsState, setActiveReprimandsState] = useState(0);

  useEffect(() => {
    if (router.query.id) {
      GET_member(String(router.query.id))
        .then((response) => response.json())
        .then((data: Member) => {
          setForm({ ...data, birthday: new Date(), associated: new Date() });
          setActiveAbsencesState(data.activeAbsences);
          setActiveReprimandsState(data.activeReprimands);
          setLoading(false);
        });
    }
  }, [router.query.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = isFormDataValid(form);

    if (isValid) {
      const newTotalAbsences = form.activeAbsences - activeAbsencesState;
      const newTotalReprimands = form.activeReprimands - activeReprimandsState;

      const response = await PUT_member({
        ...form,
        birthday: form.birthday.toISOString(),
        associated: form.associated.toISOString(),
        totalAbsences: form.totalAbsences + newTotalAbsences,
        totalReprimands: form.totalReprimands + newTotalReprimands,
      });

      if (response.ok) {
        router.push("/members");
        notifications.show({
          title: "Uspješno uređeno",
          message: "Član je uspješno uređen!",
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
    }

    return true;
  };

  const handleFullnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, fullname: event.target.value });
  };

  const handlePregnantTimesChange = (value: string | number) => {
    setForm({ ...form, pregnantTimes: Number(value) });
  };

  const handleBirthdayChange = (birthday: Date | null) => {
    if (birthday) setForm({ ...form, birthday });
  };

  const handleActiveAbsencesChange = (value: string | number) => {
    setForm({ ...form, activeAbsences: Number(value) });
  };

  const handleActiveReprimandsChange = (value: string | number) => {
    setForm({ ...form, activeReprimands: Number(value) });
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
      <h1>Uredi Člana</h1>
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

        <NumberInput
          label="Nabebio"
          placeholder="Nabebio"
          defaultValue={form.pregnantTimes}
          min={0}
          onChange={handlePregnantTimesChange}
        />

        <NumberInput
          label="Aktivnih izostanaka"
          placeholder="Aktivnih izostanaka"
          defaultValue={form.activeAbsences}
          min={0}
          onChange={handleActiveAbsencesChange}
        />

        <NumberInput
          label="Aktivnih ukora"
          placeholder="Aktivnih ukora"
          defaultValue={form.activeReprimands}
          min={0}
          onChange={handleActiveReprimandsChange}
        />

        <div className={style.buttonsContainer}>
          <Button size="xs" variant="outline" color="red" onClick={goBack}>
            Odustani
          </Button>
          <Button size="xs" variant="outline" type="submit">
            Uredi Člana
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

export default EditMember;
