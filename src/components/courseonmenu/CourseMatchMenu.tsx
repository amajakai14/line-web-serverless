import { useState } from "react";
import type { CourseOnMenuList } from "../../schema/menu.schema";
import type { TCourseOnMenu } from "../../server/api/routers/course-on-menu";
import { api } from "../../utils/api";

const CourseMatchMenuTable = ({ data }: { data: TCourseOnMenu }) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const courses = data.courses;
  const menus = data.menus;
  const [courseOnMenus, setCourseOnMenu] = useState<
    CourseOnMenuList[] | undefined
  >(data.course_on_menu);

  const mutation = api.courseOnMenu.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: () => setErrorMessage("saved"),
  });

  function handleMatcher() {
    mutation.mutateAsync(courseOnMenus);
  }

  function onToggle(menu_id: number, course_id: number) {
    setErrorMessage(undefined);
    if (courseOnMenus == null) {
      setCourseOnMenu([{ menu_id, course_id }]);
      return;
    }
    const result = courseOnMenus.some((value) => {
      return value.menu_id === menu_id && value.course_id === course_id;
    });
    if (result) {
      const idx = courseOnMenus.findIndex(
        (val) => val.menu_id === menu_id && val.course_id === course_id
      );
      const newSs = courseOnMenus.filter((val, index) => index !== idx);
      setCourseOnMenu(newSs);
    } else {
      const x = courseOnMenus.concat({
        menu_id,
        course_id,
      });
      setCourseOnMenu(x);
    }
  }
  if (menus.length === 0 || courses.length === 0) {
    return <p>Please Add some menus and courses before do the matching</p>;
  }
  return (
    <>
      {errorMessage && (
        <p className="text-center text-red-600">{errorMessage}</p>
      )}
      <table>
        <thead>
          <tr className="border-2 border-black">
            <th></th>
            {courses &&
              courses.map((course) => (
                <th key={course.id} className="border-2 border-black px-2">
                  {course.course_name}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="border-2 border-black">
          {menus &&
            menus.map((menu) => (
              <tr key={menu.id}>
                <td className="border-2 border-black px-2">{menu.menu_name}</td>
                {courses &&
                  courses.map((course) => {
                    const registered =
                      courseOnMenus &&
                      courseOnMenus.some(
                        (courseOnMenu) =>
                          courseOnMenu.menu_id === menu.id &&
                          courseOnMenu.course_id === course.id
                      );
                    return (
                      <td
                        key={course.id}
                        className="border-2 border-black px-2"
                      >
                        <button onClick={() => onToggle(menu.id, course.id)}>
                          {registered ? "✔" : "✖"}
                        </button>
                      </td>
                    );
                  })}
              </tr>
            ))}
        </tbody>
      </table>
      <button onClick={handleMatcher}>Save</button>
    </>
  );
};

export default CourseMatchMenuTable;
