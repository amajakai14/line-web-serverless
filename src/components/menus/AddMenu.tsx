import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Pagination from "react-paginate";
import { uploadImage } from "../../s3Client/upload.image";
import type {
  CreateMenuInput,
  MenuList,
  UploadImageInput,
} from "../../schema/menu.schema";
import { menuType } from "../../schema/menu.schema";
import { api } from "../../utils/api";
import { isValidPrice } from "../../utils/input-validation";
import LoadingButton from "../LoadingButton";

const AddMenu: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const mutation = api.menu.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: () => {
      setErrorMessage(undefined);
      reset();
    },
  });

  const fetchMenu = api.menu.get.useQuery();
  const menus = fetchMenu.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateMenuInput>();

  const onSubmit: SubmitHandler<CreateMenuInput> = async (data) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    if (!isValidPrice(data.price)) {
      setErrorMessage("price should be a positive number");
      return;
    }
    if (!file) data.upload_file = false;
    const presigned = await mutation.mutateAsync(data);
    if (!file || !presigned) {
      setIsLoading(false);
      fetchMenu.refetch();
      return;
    }
    const result = await uploadImage(file, presigned);
    if (!result) setErrorMessage("unable to upload image");
    setIsLoading(false);
    fetchMenu.refetch();
  };

  const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const file: File | undefined = e.currentTarget.files?.[0];
    if (!file) {
      reset();
      return;
    }
    if (!validateFile(file)) {
      reset();
      setErrorMessage("upload file cannot be over then 5 MB.");
      return;
    }
    const fileExtension = file.name.split(".").pop();
    if (!fileExtension) {
      reset();
      setErrorMessage("file extension not found");
      return;
    }
    setErrorMessage(undefined);

    setFile(file);
    setValue("upload_file", true);
    setPreview(URL.createObjectURL(file));
    return () => URL.revokeObjectURL(file.name);
  };

  function validateFile(file: File) {
    if (file.size > 5e10) return false;
    return true;
  }

  function reset() {
    setErrorMessage(undefined);
    setFile(undefined);
    setValue("upload_file", false);
    setPreview(undefined);
  }

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
          <div>
            {mutation.isLoading || isLoading ? (
              <div></div>
            ) : (
              <>
                <input
                  accept="image/*"
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    onFileChange(e)
                  }
                  //when cancel button is clicked, the file input will not trigger onChange event
                  //so we need to set the value to false
                  onClick={() => {
                    reset();
                  }}
                  type="file"
                />
              </>
            )}
            {preview && (
              <Image
                src={preview}
                alt="preview image"
                width={100}
                height={100}
                id="preview"
                className="h-32 w-40"
              />
            )}
          </div>
          {mutation.isLoading || isLoading ? (
            <LoadingButton />
          ) : (
            <input type="submit" className="rounded border py-1 px-4" />
          )}
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
                <td className="flex py-4 text-center">
                  {menu.url && (
                    <Image
                      src={menu.url}
                      alt="menu image"
                      height={300}
                      width={300}
                      className="h-32 w-40 p-4"
                    />
                  )}
                  <AddImage id={menu.id} />
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

const AddImage = ({ id }: { id: number }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit } = useForm<UploadImageInput>();
  function validateFile(file: File) {
    if (file.size > 5e10) return false;
    return true;
  }

  function reset() {
    setErrorMessage(undefined);
    setFile(undefined);
    setIsLoading(false);
  }

  const mutation = api.menu.uploadImage.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: () => {
      setErrorMessage(undefined);
      reset();
    },
  });

  const onSubmit: SubmitHandler<UploadImageInput> = async () => {
    setIsLoading(true);
    setErrorMessage(undefined);
    if (!file) {
      setErrorMessage("no file selected");
      setIsLoading(false);
      return;
    }
    const presigned = await mutation.mutateAsync({ id });
    const result = await uploadImage(file, presigned);
    if (!result) setErrorMessage("unable to upload image");
    setIsLoading(false);
  };
  const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const file: File | undefined = e.currentTarget.files?.[0];
    if (!file) {
      reset();
      return;
    }
    if (!validateFile(file)) {
      reset();
      setErrorMessage("upload file cannot be over then 5 MB.");
      return;
    }
    const fileExtension = file.name.split(".").pop();
    if (!fileExtension) {
      reset();
      setErrorMessage("file extension not found");
      return;
    }
    setErrorMessage(undefined);

    setFile(file);
  };
  return (
    <div className="flex flex-col justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <label htmlFor={`file-upload-id${id}`}>
            <input
              id={`file-upload-id${id}`}
              accept="image/jpeg, image/png"
              className="
              text-grey-500 text-sm
            file:mr-5 file:rounded-full file:border-0
            file:bg-blue-50 file:py-2
            file:px-6 file:text-sm
            file:font-medium file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
              "
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                onFileChange(e)
              }
              onClick={(e) => {
                e.currentTarget.value = "";
                reset();
              }}
              type="file"
            />
          </label>
          <div className="pt-2 text-start">
            {mutation.isLoading || isLoading ? (
              <LoadingButton />
            ) : (
              <input
                type="submit"
                className="mr-5 rounded-full border py-2 px-6 text-sm hover:cursor-pointer hover:bg-slate-100 active:bg-slate-200"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
