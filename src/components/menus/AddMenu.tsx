import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Pagination from "react-paginate";
import type { CreateMenuInput, MenuList } from "../../schema/menu.schema";
import { menuType } from "../../schema/menu.schema";
import { api } from "../../utils/api";
import { isValidPrice } from "../../utils/input-validation";

const AddMenu = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [menus, setMenus] = useState<MenuList[] | undefined>();
  const [page, setPage] = useState(1);

  function handlePageChange(page: { selected: number }) {
    setPage(page.selected + 1);
  }

  const mutation = api.menu.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: (data) => console.log(data),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMenuInput>();

  const onSubmit: SubmitHandler<CreateMenuInput> = async (data) => {
    setErrorMessage(undefined);
    if (!isValidPrice(data.price)) {
      setErrorMessage("price should be a positive number");
      return;
    }
    const { status, message, result } = await mutation.mutateAsync(data);
    if (status !== 201) {
      setErrorMessage(message);
      return;
    }
    setMenus(result);
    console.log("api sending result", result);
  };

  return (
    <>
      <div className="radius flex flex-col items-center gap-2 border p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {errorMessage && (
            <p className="text-center text-red-600">{errorMessage}</p>
          )}
          <label>Menu name</label>
          <input
            className="rounded border py-1 px-4"
            type="text"
            {...register("menu_name", { required: true })}
          />
          {errors.menu_name && (
            <p className="text-center text-red-600">This field is required</p>
          )}
          <label>Type of Menu</label>
          <select {...register("menu_type", { required: true })}>
            {menuType.map((type) => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              );
            })}
          </select>
          <label>Price</label>
          <input
            className="rounded border py-1 px-4"
            type="text"
            defaultValue={0}
            {...register("price", { required: false, valueAsNumber: true })}
          />

          <input type="submit" className="rounded border py-1 px-4" />
        </form>
      </div>
      {menus && (
        <MenuTable
          page={page}
          menus={menus}
          handlePageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default AddMenu;

const MenuTable = ({
  page,
  menus,
  handlePageChange,
}: {
  page: number;
  menus: MenuList[];
  handlePageChange: (page: { selected: number }) => void;
}) => {
  const firstMenu = menus[0];
  if (firstMenu == null) return <div></div>;
  const start = (page - 1) * 3;
  const end = start + 3;
  const menuInPage = menus.slice(start, end);
  return (
    <>
      <table className="border-collapse border-2 border-black">
        <thead>
          <tr className="text-left">
            <th className="border-2 border-black px-2">Menu Name</th>
            <th className="border-2 border-black px-2">Type</th>
            <th className="border-2 border-black px-2">Price</th>
            <th className="border-2 border-black px-2">Availability</th>
          </tr>
        </thead>
        <tbody>
          {menuInPage.map((menu) => {
            return (
              <tr key={menu.id} className="px-2">
                <td
                  className="border-2 border-black px-2 text-left"
                  key={`${menu.id}${menu.menu_name}`}
                >
                  {menu.menu_name}
                </td>
                <td
                  className="border-2 border-black px-2 text-left"
                  key={`${menu.id}${menu.menu_type}`}
                >
                  {menu.menu_type}
                </td>
                <td
                  className="border-2 border-black px-2 text-left"
                  key={`${menu.id}${menu.price}`}
                >
                  {menu.price}
                </td>
                <td
                  className="border-2 border-black px-2 text-left"
                  key={`${menu.id}${menu.available}`}
                >
                  {menu.available ? "✔" : "✖"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        pageCount={Math.ceil(menus.length / 3)}
        pageRangeDisplayed={10}
        marginPagesDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName="flex flex-row justify-between gap-1"
        activeClassName="active"
        breakLabel="..."
      />
    </>
  );
};
