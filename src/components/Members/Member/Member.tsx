import { useState, useEffect } from "react";
import { LoadingOverlay, Button } from "@mantine/core";
import style from "./Member.module.scss";
import { useRouter } from "next/router";
import type { Member } from "@/types/member";
import { GET_member, PUT_member } from "@/services/membersService";
import { formatDate } from "@/composables/timeHelpers";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Member = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    if (router.isReady) getMember();
  }, [router.query.id]);

  const getMember = () => {
    const { id } = router.query;
    GET_member(String(id))
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          router.push("/");
          notifications.show({
            title: "Ne postojeći član",
            message: "Birani ID ne postoji!",
            color: "red",
          });
        }

        setMember(data);
        setLoading(false);
      })
      .catch(() => router.push("/"));
  };

  const goBack = () => {
    router.back();
  };

  const resetAbsences = () => {
    if (member) {
      member.activeAbsences = 0;
      PUT_member(member).then(() => getMember());
    }
  };

  const resetReprimands = () => {
    if (member) {
      member.activeReprimands = 0;
      PUT_member(member).then(() => getMember());
    }
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
    <div className={style.memberContainer}>
      <div className={style.headerWrapper}>
        <h1>{member?.fullname}</h1>
        <Button size="xs" variant="outline" color="red" onClick={goBack}>
          Natrag
        </Button>
      </div>

      <span>Registriran: {formatDate(String(member?.associated))}</span>
      <span>Nabebio: {member?.pregnantTimes} puta</span>

      <div className={style.rowWithButton}>
        <span>Aktivnih izostanaka: {member?.activeAbsences}</span>
        {Number(member?.activeAbsences) > 2 && isAuthenticated && (
          <Button
            size="xs"
            variant="outline"
            type="submit"
            onClick={resetAbsences}
          >
            Resetiraj
          </Button>
        )}
      </div>

      <span>Ukupno izostanaka: {member?.totalAbsences}</span>

      <div className={style.rowWithButton}>
        <span>Aktivnih ukora: {member?.activeReprimands}</span>
        {Number(member?.activeReprimands) > 1 && isAuthenticated && (
          <Button
            size="xs"
            variant="outline"
            type="submit"
            onClick={resetReprimands}
          >
            Resetiraj
          </Button>
        )}
      </div>

      <span>Ukupno ukora: {member?.totalReprimands}</span>

      <span>
        Dužan:{" "}
        <span
          className={
            Number(member?.activeAbsences) > 2 ||
            Number(member?.activeReprimands) > 1
              ? style.activeDebt
              : style.inactiveDebt
          }
        >
          {Number(member?.activeAbsences) > 2 ? "DA" : "NE"}
        </span>
      </span>

      <span>Rođendan: {formatDate(String(member?.birthday))}</span>
    </div>
  );
};

export default Member;
