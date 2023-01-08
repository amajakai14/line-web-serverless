import { useState } from "react";

type Student = {
  id: number;
  name: string;
};

type Subject = {
  id: number;
  name: string;
};

type StudentSubject = {
  studentId: number;
  subjectId: number;
};

type Props = {
  students: Student[];
  subjects: Subject[];
  studentSubjects: StudentSubject[];
};
const students: Student[] = [
  { id: 1, name: "james" },
  { id: 2, name: "bronze" },
  { id: 3, name: "ron" },
  { id: 4, name: "hermione" },
  { id: 5, name: "dubble" },
  { id: 6, name: "dore" },
];

const subjects: Subject[] = [
  { id: 1, name: "math" },
  { id: 2, name: "science" },
  { id: 3, name: "eng" },
  { id: 4, name: "social" },
  { id: 5, name: "art" },
  { id: 6, name: "program" },
];

const studentSubjects: StudentSubject[] = [
  { studentId: 1, subjectId: 1 },
  { studentId: 1, subjectId: 2 },
  { studentId: 3, subjectId: 2 },
  { studentId: 4, subjectId: 2 },
  { studentId: 4, subjectId: 5 },
  { studentId: 1, subjectId: 5 },
  { studentId: 6, subjectId: 6 },
];

const StudentSubjectTable = () => {
  const [toggled, setToggled] = useState<{ [key: string]: boolean }>({});
  const [ss, setSs] = useState(studentSubjects);
  function onToggle(studentId: number, subjectId: number) {
    const result = ss.some((value) => {
      return value.studentId === studentId && value.subjectId === subjectId;
    });
    if (result) {
      console.log("have val");
      const idx = ss.findIndex(
        (val) => val.studentId === studentId && val.subjectId === subjectId
      );
      const newSs = ss.filter((val, index) => index !== idx);
      setSs(newSs);
    } else {
      console.log("no val");
      const x = ss.concat({
        studentId: studentId,
        subjectId: subjectId,
      });
      setSs(x);
    }
  }
  const handleToggle = (studentId: number, subjectId: number) => {
    setToggled((prevToggled) => ({
      ...prevToggled,
      [`${studentId}-${subjectId}`]: !prevToggled[`${studentId}-${subjectId}`],
    }));
    onToggle(studentId, subjectId);
  };
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {subjects.map((subject) => (
            <th key={subject.id}>{subject.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.name}</td>
            {subjects.map((subject) => {
              const registered = ss.some(
                (studentSubject) =>
                  studentSubject.studentId === student.id &&
                  studentSubject.subjectId === subject.id
              );
              return (
                <td key={subject.id}>
                  <button
                    className={
                      toggled[`${student.id}-${subject.id}`] ? "toggled" : ""
                    }
                    onClick={() => onToggle(student.id, subject.id)}
                  >
                    {registered ? "Checked" : "Unchecked"}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentSubjectTable;
