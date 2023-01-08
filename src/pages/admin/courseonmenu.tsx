import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CourseMatchMenuTable from "../../components/courseonmenu/CourseMatchMenu";
import { api } from "../../utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Courses and Menus Relation</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <CourseOnMenuRelation />
            <p className="text-center text-2xl text-white">Menu List</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const CourseOnMenuRelation = () => {
  const { data: sessionData, status } = useSession();
  const fetchData = api.courseOnMenu.get.useQuery();
  console.log(fetchData.data);
  const router = useRouter();
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/admin");
    }
  }, [router, sessionData, status]);
  if (status === "loading" || fetchData.status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }

  if (fetchData.status === "success") {
    return <CourseMatchMenuTable data={fetchData.data.result} />;
  }
  return <div>sth is unusual</div>;
};
