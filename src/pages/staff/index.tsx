import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import QRCode from "qrcode.react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { TNavbar } from "../../components/Navbar";
import Navbar from "../../components/Navbar";
import { api } from "../../utils/api";

const linkList: TNavbar = [
  { uri: "/", text: "Home" },
  { uri: "#", text: "TODO2" },
  { uri: "#", text: "TODO3" },
  { uri: "#", text: "TODO4" },
  { uri: "#", text: "TODO5" },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Staff</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-slate-50">
        <Navbar linkList={linkList} />
        <div className="px-4">
          <div>
            <p>Staff Page</p>
            <Index />
            <TableList />
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
    router.push("/");
  }
  return (
    <>
      <div>Hello {sessionData?.user?.name}</div>
    </>
  );
};

type TTableList = {
  table_id: number;
  table_name: string;
};

const TableList = () => {
  const fetchData = api.desk.getTables.useQuery();
  const [tableId, setTableId] = useState<TTableList | undefined>(undefined);
  if (fetchData.status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }
  let tableList;
  if (fetchData.status === "error") {
    tableList = undefined;
  }
  tableList = fetchData.data?.result;
  if (!tableList || tableList?.length === 0) return <div></div>;
  const handleGetTableDetail = (table_id: number, table_name: string) => {
    setTableId({ table_id, table_name });
  };
  return (
    <div>
      {!tableId && (
        <ul className="grid grid-cols-3 gap-6 xl:grid-cols-5">
          {tableList &&
            tableList.map((staff) => (
              <li
                className={`rounded-2xl border-2 
                ${
                  staff.is_occupied
                    ? "border-red-100 bg-red-200 py-5 text-center hover:bg-red-300 active:bg-red-400"
                    : "border-emerald-100 bg-emerald-200 py-5 text-center hover:bg-emerald-300 active:bg-emerald-400"
                }`}
                key={staff.id}
                onClick={() => handleGetTableDetail(staff.id, staff.table_name)}
                value={staff.id}
              >
                {staff.table_name}
              </li>
            ))}
        </ul>
      )}
      {tableId && <TableDetail table={tableId} setTableId={setTableId} />}
    </div>
  );
};

const TableDetail = ({
  table,
  setTableId,
}: {
  table: TTableList;
  setTableId: Dispatch<SetStateAction<TTableList | undefined>>;
}) => {
  const { table_id, table_name } = table;
  const fetchData = api.desk.getTable.useQuery({ table_id });
  const fetchCourseData = api.course.get.useQuery();
  const [courseFetch, setCourseFetch] = useState(false);
  useEffect(() => {
    fetchData.refetch();
  }, [courseFetch]);
  if (fetchData.status === "loading" || fetchCourseData.status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }
  const coursesDetail = fetchCourseData.data?.result;
  const tableDetail = fetchData.data?.result;
  const inUseChannel = tableDetail?.filter(
    (table) => table.status === "ONLINE"
  )[0];
  const pastChannel = tableDetail?.filter(
    (table) => table.status === "EXPIRED"
  );
  if (!tableDetail || !inUseChannel)
    return (
      <div>
        <SetZero setTableId={setTableId} />
        <ChannelHistory tableDetail={pastChannel} />
        <CreateChannel
          table_id={table_id}
          courses={coursesDetail}
          courseFetch={courseFetch}
          setCourseFetch={setCourseFetch}
        />
      </div>
    );
  const baseUrl = window.location.origin;
  return (
    <div>
      <div>
        <div className="flex flex-row justify-center gap-2">
          <div className="rounded-md border-2 bg-slate-400 p-4">{`Start: ${inUseChannel.time_start.toLocaleTimeString()}  End: ${inUseChannel.time_end.toLocaleTimeString()}`}</div>
          <div className="rounded-md border-2 bg-red-300 p-4">ONLINE</div>
        </div>
        <SetZero setTableId={setTableId} />
        <div className="flex justify-center">
          <QRCode
            value={`${baseUrl}/service/${inUseChannel.id}`}
            renderAs="canvas"
            size={300}
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="border-2 bg-green-300 p-4 text-center">Course</div>
          <div className="border-2 bg-slate-50">
            <p className="border-2 border-gray-50">
              Type Table Code to Delete current channel
            </p>
            <input
              type="text"
              className="w-full border-2 bg-white"
              placeholder={table_name}
            />
            <div className="border-2 bg-red-600 text-center">
              <button>Close Channel</button>
            </div>
          </div>
        </div>
        <div>PastChannel</div>
      </div>
    </div>
  );
};

const ChannelHistory = ({
  tableDetail,
}: {
  tableDetail:
    | {
        id: string;
        status: string;
        time_start: Date | null;
        time_end: Date | null;
      }[]
    | undefined;
}) => {
  return (
    <>
      {tableDetail &&
        tableDetail.map((val) => (
          <div key={val.id}>
            <div></div>
          </div>
        ))}
    </>
  );
};

const SetZero = ({
  setTableId,
}: {
  setTableId: Dispatch<SetStateAction<TTableList | undefined>>;
}) => {
  const handleSetUndefined = () => {
    setTableId(undefined);
  };
  return (
    <div>
      <button onClick={() => handleSetUndefined()}>return</button>
    </div>
  );
};

const CreateChannel = ({
  table_id,
  courses,
  courseFetch,
  setCourseFetch,
}: {
  table_id: number;
  courses:
    | { id: number; course_name: string; course_timelimit: number }[]
    | undefined;
  courseFetch: boolean;
  setCourseFetch: Dispatch<SetStateAction<boolean>>;
}) => {
  const [courseId, setCourseId] = useState<number | undefined>(undefined);
  const mutation = api.channel.register.useMutation({
    onError: (error) => console.error(error),
    onSuccess: (data) => console.log(data),
  });
  const handleCreateChannel = async () => {
    if (!courseId) {
      return;
    }

    const created = await mutation.mutateAsync({
      table_id,
      course_id: courseId,
    });
    created.status === 201 && setCourseFetch(!courseFetch);
  };

  const handleCourseSelect = (e: React.MouseEvent<HTMLLIElement>) => {
    const inputElement = e.currentTarget.querySelector(
      "input[type='radio']"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.checked = true;
      setCourseId(parseInt(inputElement.value));
    }
  };
  return (
    <div>
      <ul className="grid grid-cols-3 content-center gap-4">
        {courses &&
          courses.map((course) => {
            return (
              <>
                <li
                  className="rounded-md bg-gray-400 p-2"
                  onClick={handleCourseSelect}
                  key={course.id}
                >
                  <input
                    type="radio"
                    name="course-selection"
                    value={course.id}
                  />
                  <label htmlFor="course-selection">{course.course_name}</label>
                  <p>TODO Add Price column</p>
                  <p>{course.course_timelimit}</p>
                </li>
              </>
            );
          })}
      </ul>
      <button onClick={handleCreateChannel}>Start Buffet Program</button>
    </div>
  );
};
