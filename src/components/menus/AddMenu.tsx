import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  CreateMenuInput,
  MenuList,
  menuListSchema,
  menuType,
} from "../../schema/menu.schema";
import { api } from "../../utils/api";
import { isValidPrice } from "../../utils/input-validation";

const AddMenu = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [menus, setMenus] = useState<MenuList[] | undefined>();

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
    setMenus(result);
    console.log("api sending result", result);
  };

  return (
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
      {menus && <MenuTable menus={menus} />}
    </div>
  );
};

export default AddMenu;

const MenuTable = ({ menus }: { menus: MenuList[] }) => {
  const firstMenu = menus[0];
  if (firstMenu == null) return <div></div>;
  const keys = Object.keys(menuListSchema.keyof);
  return (
    <>
      <thead>
        <tr>
          <th>Menu Name</th>
          <th>Menu Type</th>
          <th>Menu Price</th>
          <th>Menu Availability</th>
        </tr>
      </thead>
      <tbody>
        {menus.map((menu) => {
          return (
            <tr key={menu.id}>
              <td key={`${menu.id}${menu.menu_name}`}>{menu.menu_name}</td>
              <td key={`${menu.id}${menu.menu_type}`}>{menu.menu_type}</td>
              <td key={`${menu.id}${menu.price}`}>{menu.price}</td>
              <td key={`${menu.id}${menu.available}`}>
                {menu.available ? "✔" : "✖"}
              </td>
            </tr>
          );
        })}
      </tbody>
      <table></table>
    </>
  );
};
