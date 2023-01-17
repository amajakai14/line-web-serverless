import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { isValidEmail } from "../../utils/input-validation";

import type { CreateUserInput } from "../../schema/user.schema";
import { api } from "../../utils/api";

const StaffRegisterForm = ({
  refetchStaff,
  setRefetchStaff,
}: {
  refetchStaff: boolean;
  setRefetchStaff: Dispatch<SetStateAction<boolean>>;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const mutation = api.user.registerStaff.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: (res) => {
      setSuccessMessage(
        res.message +
          "email: " +
          res.result.email +
          "password: " +
          res.result.password
      );
      setRefetchStaff(!refetchStaff);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>();

  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    if (!isValidEmail(data.email)) {
      setErrorMessage("invalid email");
      return;
    }

    await mutation.mutateAsync(data);
  };

  return (
    <div className="radius flex items-center gap-2 border p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        {successMessage && (
          <p className="text-center text-green-600">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-center text-red-600">{errorMessage}</p>
        )}
        <label>Email</label>
        <input
          className="rounded border py-1 px-4"
          type="text"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="text-center text-red-600">This field is required</p>
        )}

        <input type="submit" className="rounded border py-1 px-4" />
      </form>
    </div>
  );
};

export default StaffRegisterForm;
