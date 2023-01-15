import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StaffList from "../../components/staff/StaffList";
import StaffRegisterForm from "../../components/staff/StaffRegisterform";
export type TStaff = {
  id: string;
  name: string | null;
};
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Staff</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <Staff />
            <p className="text-center text-2xl text-white">Menu List</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const Staff = () => {
  const { data: sessionData, status } = useSession();
  const [refetchStaff, setRefetchStaff] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/admin");
    }
    console.log("staff page re render");
  }, [router, sessionData, status]);
  if (status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }
  return (
    <>
      <StaffRegisterForm
        refetchStaff={refetchStaff}
        setRefetchStaff={setRefetchStaff}
      />
      <StaffList refetchStaff={refetchStaff} />
    </>
  );
};
