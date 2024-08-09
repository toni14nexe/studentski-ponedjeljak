import { useState, useEffect, ChangeEvent } from "react";
import {
  Input,
  Button,
  Select,
  MultiSelect,
  Notification,
  LoadingOverlay,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import style from "./EditAssembly.module.scss";
import { useRouter } from "next/router";
import type { Member } from "@/types/member";
import { GET_assembly, PUT_assembly } from "@/services/assembliesService";
import {
  GET_allMembers,
  GET_member,
  PUT_member,
} from "@/services/membersService";
import { notifications } from "@mantine/notifications";
import { Assembly } from "@/types/assembly";

type FormDataMember = {
  id: number;
  fullname: string;
  pregnant: boolean;
  arrived: boolean;
};

type FormData = {
  date: Date;
  pregnant: string;
  note: string;
  members: Array<FormDataMember>;
};

type Option = {
  value: string;
  label: string;
};

const EditAssembly = () => {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [pregnantState, setPregnantState] = useState<string>();
  const [membersState, setMembersState] = useState<Member[]>([]);
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
    if (router.query.id) {
      GET_assembly(String(router.query.id))
        .then((response) => response.json())
        .then((data: Assembly) => {
          setMembersState(JSON.parse(String(data.members)));
          setPregnantState(data.pregnant);
          getMembers(data);
        });
    }
  }, [router.query.id]);

  const getMembers = (ass: Assembly) => {
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
        const pregnant = String(
          data.filter((member: Member) => member.fullname === ass?.pregnant)[0]
            .id
        );
        setForm({
          date: new Date(String(ass.date)),
          pregnant,
          note: ass.note || "Jebeš krmaču...",
          members: JSON.parse(String(ass.members)).filter(
            (mem: FormDataMember) => mem.arrived
          ),
        });
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = isFormDataValid(form);

    if (isValid) {
      const notArrivedMemberIds = membersState
        .filter(
          (initialMember) =>
            !form.members.some((member) => member.id === initialMember.id)
        )
        .map((initialMember) => initialMember.id);

      const arrivedMemberIds = form.members
        .filter(
          (initialMember) =>
            !membersState.some((member) => member.id === initialMember.id)
        )
        .map((initialMember) => initialMember.id);

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
      const pregnantStateObject = members.find(
        (member) => String(member.fullname) === pregnantState
      );

      if (pregnantState !== pregnantFullname) {
        if (pregnantStateObject) removePregnant(pregnantStateObject.id);
        addPregnant(form.pregnant);
      }

      notArrivedMemberIds.forEach((id) => removeAbsence(id));
      arrivedMemberIds.forEach((id) => addAbsence(id));

      const response = await PUT_assembly({
        id: Number(router.query.id),
        date: form.date.toISOString(),
        pregnant: String(pregnantFullname),
        note: form.note || "",
        members: JSON.stringify(formattedMembers),
      });

      if (response.ok) {
        router.push("/");
        notifications.show({
          title: "Uspješno uređeno",
          message: "Sastanak je uspješno uređen!",
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

  const addAbsence = (id: number) => {
    GET_member(String(id))
      .then((response) => response.json())
      .then((data: Member) => {
        data.activeAbsences++;
        data.totalAbsences++;
        PUT_member(data);
      });
  };

  const removeAbsence = (id: number) => {
    GET_member(String(id))
      .then((response) => response.json())
      .then((data: Member) => {
        data.activeAbsences--;
        data.totalAbsences--;
        PUT_member(data);
      });
  };

  const addPregnant = (id: string) => {
    GET_member(id)
      .then((response) => response.json())
      .then((data: Member) => {
        data.pregnantTimes++;
        PUT_member(data);
      });
  };

  const removePregnant = (id: number) => {
    GET_member(String(id))
      .then((response) => response.json())
      .then((data: Member) => {
        data.pregnantTimes--;
        PUT_member(data);
      });
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

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
      <h1>Uredi Sastanak</h1>
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

        <Input.Wrapper className={style.input} label="Napomena">
          <Textarea
            className={style.input}
            name="note"
            value={form.note}
            onChange={handleTextAreaChange}
            placeholder="Napomena"
            autosize
            minRows={2}
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
            Uredi Sastanak
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

export default EditAssembly;
