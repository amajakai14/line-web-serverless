import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TableList from "../../components/tables/TableList";
import TableRegisterForm from "../../components/tables/TableRegisterform";
import { api } from "../../utils/api";
export type TTable = {
  id: number;
  table_name: string;
  is_occupied: boolean;
};
const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Table</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <Table />
            <p className="text-center text-2xl text-white">Table List</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;

const Table = () => {
  const { data: sessionData, status } = useSession();
  const [refetchStaff, setRefetchStaff] = useState(false);
  const router = useRouter();
  const fetchData = api.table.getTables.useQuery();
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/login");
    }
    fetchData.refetch();
  }, [sessionData, status, refetchStaff, router, fetchData]);
  if (status === "loading" || fetchData.status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }
  let tableList: TTable[] | undefined;
  if (fetchData.status === "error") {
    tableList = undefined;
  }
  tableList = fetchData.data?.result;
  return (
    <>
      <TableRegisterForm
        refetchStaff={refetchStaff}
        setRefetchStaff={setRefetchStaff}
      />
      <TableList tableList={tableList} />
    </>
  );
};
