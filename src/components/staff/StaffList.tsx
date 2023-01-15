import { useEffect } from "react";
import { api } from "../../utils/api";

const StaffList = ({ refetchStaff }: { refetchStaff: boolean }) => {
  const fetchData = api.user.getStaff.useQuery();
  useEffect(() => {
    const refetchData = fetchData.refetch();
    refetchData.then((data) => {
      if (data.status === "loading") {
        return <div>Loading</div>;
      }
      if (fetchData.status === "error") {
        return <div>{fetchData.error.message}</div>;
      }
      const staffList = fetchData.data?.result;
      return (
        <>
          {staffList &&
            staffList.map((staff) => (
              <div key={staff.id}>
                <div>{staff.name ? staff.name : "No name registered"}</div>
              </div>
            ))}
        </>
      );
    });
  }, [refetchStaff]);
  if (fetchData.status === "error") {
    return <div>{fetchData.error.message}</div>;
  }
  if (fetchData.status === "loading" || !fetchData.data) {
    return <div>Loading</div>;
  }
  const staffList = fetchData.data.result;
  return (
    <>
      {staffList &&
        staffList.map((staff) => (
          <div key={staff.id}>
            <div>{staff.name ? staff.name : "No name registered"}</div>
          </div>
        ))}
    </>
  );
};

export default StaffList;
