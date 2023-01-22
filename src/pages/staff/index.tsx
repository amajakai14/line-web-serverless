import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Staff</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
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
    router.push("/login");
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
  const fetchData = api.table.getTables.useQuery();
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
                className="rounded-2xl border-2 border-emerald-100 bg-emerald-200 py-5 text-center hover:bg-emerald-300 active:bg-emerald-400"
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
  const fetchData = api.table.getTable.useQuery({ table_id });
  const fetchCourseData = api.course.get.useQuery();
  if (fetchData.status === "loading" || fetchCourseData.status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }
  let tableDetail;
  if (fetchData.status === "error") {
    tableDetail = undefined;
  }
  let coursesDetail;
  if (fetchCourseData.status === "error") {
    coursesDetail = undefined;
  }
  coursesDetail = fetchCourseData.data?.result;
  tableDetail = fetchData.data?.result;
  if (!tableDetail || tableDetail?.length === 0)
    return (
      <div>
        <SetZero setTableId={setTableId} />
        <CreateChannel table_id={table_id} courses={coursesDetail} />
      </div>
    );
  const testDate = new Date().toLocaleTimeString();
  const inUseChannel = tableDetail.filter(
    (table) => table.status === "ONLINE"
  )[0];
  return (
    <div>
      <SetZero setTableId={setTableId} />
      <div className="flex flex-row justify-center">
        <div>
          <div className="flex flex-row justify-center gap-2">
            <div className="rounded-md border-2 bg-slate-400 p-4">{`Start: ${testDate}  End: ${testDate}`}</div>
            <div className="rounded-md border-2 bg-red-300 p-4">Status</div>
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
  return;
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
}: {
  table_id: number;
  courses:
    | { id: number; course_name: string; course_timelimit: number }[]
    | undefined;
}) => {
  const [courseId, setCourseId] = useState<number | undefined>(undefined);
  const mutation = api.channel.register.useMutation({
    onError: (error) => console.error(error),
    onSuccess: (data) => console.log(data),
  });
  const handleCreateChannel = () => {
    if (courseId) {
      mutation.mutateAsync({ table_id, course_id: courseId });
    }
    console.log("course Id is undefined");
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
