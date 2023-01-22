import { useState } from "react";
import CustomPagination from "../CustomPagination";

const TableList = ({
  tableList,
}: {
  tableList:
    | { id: number; table_name: string; is_occupied: boolean }[]
    | undefined;
}) => {
  const perPage = 10;
  const [page, setPage] = useState(1);

  if (!tableList || tableList?.length === 0) return <div></div>;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const staffInPage = tableList.slice(start, end);
  return (
    <div>
      <table className="border-2 border-black">
        <thead className="border-2 border-black ">
          <tr>
            <th className="border-2 border-black px-2">table name</th>
          </tr>
        </thead>
        <tbody className="border-2 border-black px-2">
          {tableList &&
            staffInPage.map((staff) => (
              <tr key={staff.id} className="border-2 border-black">
                <td className="border-2 border-black px-2">
                  {staff.table_name}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <CustomPagination
        perPage={perPage}
        dataCount={tableList.length}
        setPage={setPage}
      />
    </div>
  );
};
export default TableList;
