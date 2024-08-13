import { useState, useEffect } from "react";
import {
  ActionIcon,
  Button,
  Collapse,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { IconPlus, IconArrowBadgeRight } from "@tabler/icons-react";
import style from "./Members.module.scss";
import { useRouter } from "next/router";
import { GET_allMembers } from "@/services/membersService";
import { Member } from "@/types/member";
import { formatDate } from "@/composables/timeHelpers";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const Members = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openedMemberId, setOpenedMemberId] = useState<number | null>(null);

  useEffect(() => getMembers(), []);

  const getMembers = () => {
    GET_allMembers()
      .then((response) => response.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      });
  };

  const goToAddMemberPage = () => {
    router.push("/members/add");
  };

  const toggleMemberData = (memberId: number) => {
    setOpenedMemberId(openedMemberId === memberId ? null : memberId);
  };

  const goTo = (url: string) => {
    router.push(url);
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
    <div>
      <div className={style.mainWrapper}>
        <h1>Članovi</h1>
        <div className={style.buttonContainer}>
          {isAuthenticated && (
            <ActionIcon
              className={style.plusButton}
              variant="outline"
              onClick={goToAddMemberPage}
            >
              <IconPlus stroke={1.5} />
              Član
            </ActionIcon>
          )}
        </div>
      </div>

      <div className={style.membersContainer}>
        {members?.map((member) => (
          <div key={member.id} className={style.memberWrapper}>
            <Button
              className={style.memberButton}
              onClick={() => toggleMemberData(member.id)}
              variant="outline"
            >
              <div className={style.inbuttoContainer}>
                <div />
                {member.fullname}
                <IconArrowBadgeRight
                  className={`${style.iconTransition} ${
                    openedMemberId === member.id ? style.rotatedIcon : ""
                  }`}
                  stroke={1.5}
                />
              </div>
            </Button>
            <Collapse in={openedMemberId === member.id}>
              <Text>Full Name: {member.fullname}</Text>
              <Text>Rođendan: {formatDate(member.birthday)}</Text>
              <Text>Nabebio: {member.pregnantTimes}</Text>
              <Text>Registriran: {formatDate(member.associated)}</Text>
              <Text>Aktivnih ukora: {member.activeReprimands}</Text>
              <Text>Ukupno ukora: {member.totalReprimands}</Text>
              <Text>Aktivnih izostanaka: {member.activeAbsences}</Text>
              <Text>Ukupno izostanaka: {member.totalAbsences}</Text>
              <span>
                Dužan:{" "}
                <span
                  className={
                    member.activeAbsences > 2 || member.activeReprimands > 1
                      ? style.activeDebt
                      : style.inactiveDebt
                  }
                >
                  {member.activeAbsences > 2 || member.activeReprimands > 1
                    ? "Da"
                    : "Ne"}
                </span>
              </span>
              <div className={style.collapseButtonsWrapper}>
                {isAuthenticated && (
                  <Button
                    onClick={() => goTo(`members/edit/${member.id}`)}
                    variant="outline"
                  >
                    Uredi
                  </Button>
                )}
                <Button
                  onClick={() => goTo(`members/${member.id}`)}
                  variant="outline"
                >
                  Profil
                </Button>
              </div>
            </Collapse>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
