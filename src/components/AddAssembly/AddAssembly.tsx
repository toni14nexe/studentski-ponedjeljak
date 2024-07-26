import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  MultiSelect,
  Notification,
  LoadingOverlay,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import style from "./AddAssembly.module.scss";
import { useRouter } from "next/router";
import type { Member } from "@/types/member";
import { POST_assembly } from "@/services/assembliesService";
import { GET_allMembers } from "@/services/membersService";
import { notifications } from "@mantine/notifications";

type FormData = {
  date: Date;
  pregnant: string;
  note: string;
  members: Array<{
    id: number;
    fullname: string;
    pregnant: boolean;
    arrived: boolean;
  }>;
};

type Option = {
  value: string;
  label: string;
};

const AddAssembly = () => {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [memberOptions, setMemberOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>({
    date: new Date(),
    pregnant: "",
    note: "Jebeš krmaču...",
    members: [],
  });
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
      const selectedMemberIds = form.members.map((member) => member.id);
      const formattedMembers = members.map((member) => ({
        id: member.id,
        fullname: member.fullname,
        pregnant: Number(form.pregnant) === member.id,
        arrived: selectedMemberIds.includes(member.id),
      }));
      const pregnantFullname = members.filter(
        (member) => String(member.id) === form.pregnant
      )[0].fullname;

      const response = await POST_assembly(
        {
          date: form.date.toISOString(),
          pregnant: String(pregnantFullname),
          note: form.note || "",
          members: formattedMembers,
        },
        members
      );

      if (response.ok) {
        router.push("/");
        notifications.show({
          title: "Uspješno dodano",
          message: "Novi sastanak je uspješno dodan!",
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

  const handleMultiSelectChange = (selectedIds: string[]) => {
    const selectedMembers = members
      .filter((member) => selectedIds.includes(member.id.toString()))
      .map((member: any) => ({
        id: member.id,
        fullname: member.fullname,
        pregnant: member.pregnant,
        arrived: member.arrived,
      }));

    setForm({ ...form, members: selectedMembers });
  };

  const goToDashboard = () => {
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
          data={memberOptions}
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
          data={memberOptions}
          value={form.members.map((member) => member.id.toString())}
          onChange={handleMultiSelectChange}
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
