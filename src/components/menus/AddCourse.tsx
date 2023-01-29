import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { CourseList, CreateCourseInput } from "../../schema/course.schema";
import { api } from "../../utils/api";
import { isValidPrice } from "../../utils/input-validation";
import LoadingButton from "../LoadingButton";

const AddCourse = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [courses, setCourses] = useState<CourseList[] | undefined>();

  const mutation = api.course.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: (data) => console.log(data),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseInput>();

  const onSubmit: SubmitHandler<CreateCourseInput> = async (data) => {
    setErrorMessage(undefined);
    if (!isValidPrice(data.course_timelimit)) {
      setErrorMessage("price should be a positive number");
      return;
    }
    const { status, message, result } = await mutation.mutateAsync(data);
    if (status !== 201) {
      setErrorMessage(message);
      return;
    }
    setCourses(result);
  };

  return (
    <div className="container p-4">
      <div className="flex flex-col items-center border">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {errorMessage && (
            <p className="text-center text-red-600">{errorMessage}</p>
          )}
          <label>Course name</label>
          <input
            className="rounded border py-1 px-4"
            type="text"
            {...register("course_name", { required: true })}
          />
          {errors.course_name && (
            <p className="text-center text-red-600">This field is required</p>
          )}
          <label>Course price</label>
          <input
            className="rounded border py-1 px-4"
            type="text"
            {...register("course_price", {
              required: true,
              valueAsNumber: true,
            })}
          />
          {errors.course_price && (
            <p className="text-center text-red-600">This field is required</p>
          )}
          <label>Timelimit</label>
          <input
            className="rounded border py-1 px-4"
            type="text"
            defaultValue={90}
            {...register("course_timelimit", {
              required: true,
              valueAsNumber: true,
            })}
          />
          {mutation.isLoading ? (
            <LoadingButton />
          ) : (
            <input type="submit" className="rounded border py-1 px-4" />
          )}
        </form>
      </div>
      {courses && <CourseTable courses={courses} />}
    </div>
  );
};

export default AddCourse;

const CourseTable = ({ courses }: { courses: CourseList[] }) => {
  const firstMenu = courses[0];
  if (firstMenu == null) return <div></div>;
  return (
    <>
      <table className="border-collapse border-2 border-black">
        <thead>
          <tr className="text-left">
            <th className="border-2 border-black px-2">Course Name</th>
            <th className="border-2 border-black px-2">Time (Minute)</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            return (
              <tr key={course.id} className="px-2">
                <td className="border-2 border-black px-2 text-left">
                  {course.course_name}
                </td>
                <td className="border-2 border-black px-2 text-left">
                  {course.course_timelimit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
