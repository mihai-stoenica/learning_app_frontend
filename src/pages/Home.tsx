import { get } from "../services/http.ts";
import { useCallback, useEffect, useState } from "react";
import CourseCard from "../components/Course/CourseCard.tsx";
import CourseForm from "../components/Course/CourseForm.tsx";
import { useSearchParams } from "react-router-dom";
import JoinCourseForm from "../components/Course/JoinCourseForm.tsx";

type CourseType = {
  id: number;
  name: string;
  description: string;
  teachers: [
    {
      name: string;
    },
  ];
};

const Home = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState<CourseType[]>();

  const mine = searchParams.get("mine") === "true";
  const fetchCourses = useCallback(async () => {
    const endpoint = mine ? `${API_URL}/course?mine=true` : `${API_URL}/course`;
    const res = await get(endpoint);

    if (!res.isError) {
      setCourses(res.data);
    } else if (res.code !== 401) {
      alert(res.message);
    }
  }, [mine, API_URL]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, API_URL]);

  return (
    <>
      <div className="mt-6 mb-10 flex flex-row items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Courses</h1>
        <button
          className={"btn btn-outline btn-sm"}
          onClick={() => {
            const modal = document.getElementById(
              "my_modal_2",
            ) as HTMLDialogElement | null;
            modal?.showModal();
          }}
        >
          Join course
        </button>
        <JoinCourseForm onJoinCourse={fetchCourses} />
        <button
          className="btn btn-circle btn-sm btn-outline"
          onClick={() => {
            const modal = document.getElementById(
              "my_modal_1",
            ) as HTMLDialogElement | null;
            modal?.showModal();
          }}
        >
          +
        </button>
      </div>
      <div
        className="grid gap-6 px-4
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center max-h-[70vh] overflow-y-auto"
      >
        {courses?.map((course: CourseType) => (
          <CourseCard
            key={course.id}
            name={course.name}
            id={course.id}
            description={course.description}
            teacher={course.teachers[0]?.name}
          />
        ))}
      </div>
      <CourseForm onSaveCourse={fetchCourses} />
    </>
  );
};

export default Home;
