import { PresignedPost } from "@aws-sdk/s3-presigned-post/dist-types/createPresignedPost";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Pagination from "react-paginate";
import type { CreateMenuInput, MenuList } from "../../schema/menu.schema";
import { menuType } from "../../schema/menu.schema";
import { api } from "../../utils/api";
import { isValidPrice } from "../../utils/input-validation";
import LoadingButton from "../LoadingButton";

const AddMenu: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<any>(undefined);

  const mutation = api.menu.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: (data) => console.log(data),
  });

  const fetchMenu = api.menu.get.useQuery();
  const menus = fetchMenu.data?.result;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateMenuInput>();

  const onSubmit: SubmitHandler<CreateMenuInput> = async (data) => {
    setErrorMessage(undefined);
    return;
    if (!isValidPrice(data.price)) {
      setErrorMessage("price should be a positive number");
      return;
    }
    const { status } = await mutation.mutateAsync(data);
    if (status !== 201) {
      setErrorMessage("unable to create menu");
      return;
    }
    fetchMenu.refetch();
  };

  const onFileChange = (e: React.FormEvent<HTMLFormElement>) => {
    const file: File | undefined = e.currentTarget.files?.[0];
    if (!file) {
      setFile(undefined);
      setValue("upload_file", false);
      setPreview(undefined);
      return;
    }
    if (!validateFile(file)) {
      setErrorMessage("upload file cannot be over then 5 MB.");
      setFile(undefined);
      setValue("upload_file", false);
      setPreview(undefined);
      return;
    }
    setFile(file);
    setValue("upload_file", true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target) {
        setPreview(undefined);
        console.log("reader target not found");
      } else setPreview(e.target.result);
    };
  };

  function validateFile(file: File) {
    if (file.size > 5e5) return false;
    return true;
  }

  const uploadImage = async (
    e: React.FormEvent<HTMLFormElement>,
    presignedUri: PresignedPost
  ) => {
    e.preventDefault();
    if (!file) {
      console.log("file not found ...");
      return;
    }
    const { url, fields } = presignedUri;
    const data = {
      ...(fields as any),
      "Content-type": file.type,
      file,
    };
    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }
    const result = await fetch(url, {
      method: "POST",
      body: formData,
    });
    console.log(result);
  };

  return (
    <div className="w-full py-3">
      <div className="flex flex-col items-center border py-3">
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
          <input
            accept="image/*"
            onChange={(e) => onFileChange(e)}
            type="file"
          />
          {mutation.isLoading ? (
            <LoadingButton />
          ) : (
            <input type="submit" className="rounded border py-1 px-4" />
          )}
          {preview && <img src={preview} alt="preview image" />}
        </form>
      </div>
      {menus && <MenuTable page={page} menus={menus} setPage={setPage} />}
    </div>
  );
};

export default AddMenu;

const MenuTable = ({
  page,
  menus,
  setPage,
}: {
  page: number;
  menus: MenuList[];
  setPage: Dispatch<SetStateAction<number>>;
}) => {
  function handlePageChange(page: { selected: number }) {
    setPage(page.selected + 1);
  }
  const firstMenu = menus[0];
  if (firstMenu == null) return <div></div>;
  const start = (page - 1) * 10;
  const end = start + 10;
  const menuInPage = menus.slice(start, end);
  return (
    <div className="container py-2 text-sm sm:text-lg">
      <table>
        <thead>
          <tr className="text-left">
            <th className="px-1">Menu Name</th>
            <th className="px-1">Type</th>
            <th className="px-1">Price</th>
            <th className="px-1">Availability</th>
          </tr>
        </thead>
        <tbody>
          {menuInPage.map((menu) => {
            return (
              <tr key={menu.id} className="px-1">
                <td
                  className="px-1 text-left"
                  key={`${menu.id}${menu.menu_name}`}
                >
                  {menu.menu_name}
                </td>
                <td
                  className="px-1 text-left"
                  key={`${menu.id}${menu.menu_type}`}
                >
                  {menu.menu_type}
                </td>
                <td
                  className="px-1 text-center"
                  key={`${menu.id}${menu.price}`}
                >
                  {menu.price}
                </td>
                <td
                  className="px-1 text-center"
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
        pageCount={Math.ceil(menus.length / 10)}
        pageRangeDisplayed={10}
        marginPagesDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName="flex text-sm flex-row justify-center gap-3"
        activeClassName="active"
        breakLabel="..."
      />
    </div>
  );
};
