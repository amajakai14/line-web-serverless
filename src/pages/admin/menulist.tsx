import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AddMenu from "../../components/menus/AddMenu";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>menulist</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <Menulist />
            <p className="text-center text-2xl text-white">Menu List</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const Menulist = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/admin");
    }
  }, [router, sessionData, status]);
  if (status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }
  return <AddMenu />;
};
