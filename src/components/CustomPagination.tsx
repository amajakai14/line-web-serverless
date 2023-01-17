import Pagination from "react-paginate";
export type TPagination = {
  dataCount: number;
  perPage: number;
  handlePageChange: (cur: { selected: number }) => void;
};
const CustomPagination = (props: TPagination) => {
  return (
    <Pagination
      pageCount={Math.ceil(props.dataCount / props.perPage)}
      onPageChange={props.handlePageChange}
      containerClassName="flex flex-row justify-between gap-1"
      activeClassName="active text-2xl"
      breakLabel="..."
    />
  );
};

export default CustomPagination;
