import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Staff</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <div>
            <p>Staff Page</p>
            <Index />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const Index = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/login");
    }
  }, [sessionData, status, router]);
  if (status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }

  if (sessionData?.user?.role !== "STAFF") {
    router.push("/login");
  }
  return (
    <>
      <div>Hello {sessionData?.user?.name}</div>
    </>
  );
};
