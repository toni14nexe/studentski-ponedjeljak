import AddAssemblieButton from "@/components/Dashboard/AddAssemblieButton";
import AssembliesTable from "@/components/Dashboard/AssembliesTable";
import style from "./Dashboard.module.scss";

const Home = () => {
  return (
    <div className={style.mainWrapper}>
      <h1>Sastanci</h1>
      <AddAssemblieButton />
    </div>
  );
};

export default Home;
