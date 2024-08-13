import { useState, useEffect } from "react";
import {
  ActionIcon,
  Button,
  Collapse,
  LoadingOverlay,
  Pagination,
  Text,
} from "@mantine/core";
import { IconPlus, IconArrowBadgeRight } from "@tabler/icons-react";
import style from "./Dashboard.module.scss";
import { useRouter } from "next/router";
import { GET_assemblies } from "@/services/assembliesService";
import { formatDate } from "@/composables/timeHelpers";
import { Assembly } from "@/types/assembly";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Dashboard = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();
  const [assemblies, setAssemblies] = useState<Assembly[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openedAssemblyId, setOpenedAssemblyId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  useEffect(() => getAssemblies(), []);

  const getAssemblies = (newPage?: number) => {
    setLoading(true);
    GET_assemblies(newPage || page, 10)
      .then((response) => response.json())
      .then((data) => {
        data.assemblies.forEach((assembly: any) => {
          assembly.members = JSON.parse(assembly.members);
        });
        setAssemblies(data.assemblies);
        setTotalPages(data.totalPages);
        setLoading(false);
      });
  };

  const goTo = (path: string) => {
    router.push(`/${path}`);
  };

  const toggleAssemblyData = (assemblyId: number) => {
    setOpenedAssemblyId(openedAssemblyId === assemblyId ? null : assemblyId);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    getAssemblies(page);
    setOpenedAssemblyId(null);
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
        <h1>Sastanci</h1>
        <div className={style.buttonContainer}>
          <ActionIcon
            className={style.plusButton}
            variant="outline"
            onClick={() => goTo("laws")}
          >
            Zakoni
          </ActionIcon>
          <ActionIcon
            className={style.plusButton}
            variant="outline"
            onClick={() => goTo("reprimands")}
          >
            Ukori
          </ActionIcon>
          {isAuthenticated && (
            <ActionIcon
              className={style.plusButton}
              variant="outline"
              onClick={() => goTo("add-assembly")}
            >
              <IconPlus stroke={1.5} />
              Sastanak
            </ActionIcon>
          )}
        </div>
      </div>

      <div className={style.assembliesContainer}>
        {assemblies?.map((assembly) => (
          <div key={assembly.id} className={style.assemblyWrapper}>
            <Button
              className={style.assemblyButton}
              onClick={() => toggleAssemblyData(assembly.id)}
              variant="outline"
            >
              <div className={style.inbuttoContainer}>
                <div />
                {formatDate(assembly.date)}
                <IconArrowBadgeRight
                  className={`${style.iconTransition} ${
                    openedAssemblyId === assembly.id ? style.rotatedIcon : ""
                  }`}
                  stroke={1.5}
                />
              </div>
            </Button>
            <Collapse in={openedAssemblyId === assembly.id}>
              <Text>Napomena: {assembly.note || "Jebeš krmaču..."}</Text>
              <Text>Nabebio: {assembly.pregnant}</Text>
              <Text>Prisutni:</Text>
              {assembly.members.map((member) => (
                <div key={member.id}>
                  {member.arrived && <li>{member.fullname}</li>}
                </div>
              ))}
              <div className={style.editButtonWrapper}>
                {isAuthenticated && (
                  <Button
                    onClick={() => goTo(`edit-assembly/${assembly.id}`)}
                    variant="outline"
                  >
                    Uredi
                  </Button>
                )}
              </div>
            </Collapse>
          </div>
        ))}

        <Pagination
          value={page}
          onChange={handlePageChange}
          total={totalPages}
        />
      </div>
    </div>
  );
};

export default Dashboard;
