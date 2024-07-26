import { useState, useEffect } from "react";
import {
  ActionIcon,
  Button,
  Collapse,
  LoadingOverlay,
  Pagination,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import style from "./Dashboard.module.scss";
import { useRouter } from "next/router";
import { GET_assemblies } from "@/services/assembliesService";
import { formatDate } from "@/composables/timeHelpers";
import { Assembly } from "@/types/assembly";

const Dashboard = () => {
  const router = useRouter();
  const [assemblies, setAssemblies] = useState<Assembly[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openedAssemblyId, setOpenedAssemblyId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => getAssemblies(), []);

  const getAssemblies = (newPage?: number) => {
    setLoading(true);
    GET_assemblies(newPage || page, perPage)
      .then((response) => response.json())
      .then((data) => {
        data.assemblies.forEach((assembly: any) => {
          assembly.members = JSON.parse(assembly.members);
        });
        setAssemblies(data.assemblies);
        setPerPage(data.totalPages);
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
          <ActionIcon
            className={style.plusButton}
            variant="outline"
            onClick={() => goTo("/laws")}
          >
            Zakoni
          </ActionIcon>
          <ActionIcon
            className={style.plusButton}
            variant="outline"
            onClick={() => goTo("/reprimands")}
          >
            Ukori
          </ActionIcon>
          <ActionIcon
            className={style.plusButton}
            variant="outline"
            onClick={() => goTo("add-assembly")}
          >
            <IconPlus stroke={1.5} />
            Sastanak
          </ActionIcon>
        </div>
      </div>

      <div className={style.assembliesContainer}>
        {assemblies?.map((assembly) => (
          <div key={assembly.id} className={style.assemblyWrapper}>
            <Button
              className={style.assemblyButton}
              onClick={() => toggleAssemblyData(assembly.id)}
            >
              {formatDate(assembly.date)}
            </Button>
            <Collapse in={openedAssemblyId === assembly.id}>
              <Text>Bilješka: {assembly.note || "Jebeš krmaču..."}</Text>
              <Text>Nabebio: {assembly.pregnant}</Text>
              <Text>Prisutni:</Text>
              {assembly.members.map((member) => (
                <div key={member.id}>
                  <li>{member.fullname}</li>
                </div>
              ))}
            </Collapse>
          </div>
        ))}

        <Pagination value={page} onChange={handlePageChange} total={perPage} />
      </div>
    </div>
  );
};

export default Dashboard;
