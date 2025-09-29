import { useParams } from "react-router-dom";
import { get } from "../services/http.ts";
import { useCallback, useEffect, useState } from "react";
import PostCard from "../components/Post/PostCard.tsx";
import { Plus } from "lucide-react";
import PostForm from "../components/Post/PostForm.tsx";

type CourseType = {
  id: number;
  name: string;
  description: string;
  students: [
    {
      email: string;
      name: string;
    },
  ];
  teachers: [
    {
      email: string;
      name: string;
    },
  ];
  access_code: string;
};

type PostType = {
  id: number;
  title: string;
  text: string;
  user: {
    email: string;
    name: string;
  };
  commentCount: number;
  type: "post" | "assignment";
  deadline?: string;
  max_score?: number;
};

const Course = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"classwork" | "people">(
    "classwork",
  );
  const [course, setCourse] = useState<CourseType>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newPost, setNewPost] = useState(false);
  const [newAssignment, setNewAssignment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCourse = useCallback(async () => {
    const res = await get(`${API_URL}/course/${id}`);

    if (!res.isError) {
      setCourse(res.data);
    } else {
      setError(res.message);
    }
  }, [API_URL, id]);

  const fetchPosts = useCallback(async () => {
    const res = await get(`${API_URL}/post/course/${id}`);

    if (!res.isError) {
      setPosts(res.data);
    } else {
      if (!error) setError(res.message);
    }
  }, [API_URL, id, error]);

  const fetchAll = useCallback(async () => {
    await fetchCourse();
    await fetchPosts();
  }, [fetchPosts, fetchCourse]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <>
      {!error && (
        <div className="flex flex-col items-center mt-5">
          <div className="tabs tabs-border mb-2">
            <input
              type="radio"
              value={1}
              name="tabs"
              className="tab"
              aria-label="Classwork"
              defaultChecked
              onChange={() => setActiveTab("classwork")}
            />
            <input
              type="radio"
              value={2}
              name="tabs"
              className="tab"
              aria-label="People"
              onChange={() => setActiveTab("people")}
            />
          </div>
          {activeTab === "classwork" ? (
            <>
              <div className="card card-border bg-base-100 w-[90%] mb-3">
                <div className="card-body items-center">
                  <h2 className="card-title text-center text-[1.5rem]">
                    -{course?.name}-
                  </h2>
                  <p className={"text-sm"}>{course?.access_code}</p>
                  <p>{course?.description}</p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center gap-2">
                <button
                  className="btn btn-outline"
                  onClick={() => setNewPost(!newPost)}
                >
                  <Plus />
                  Add post
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => setNewAssignment(!newAssignment)}
                >
                  <Plus />
                  Add assignment
                </button>
              </div>
              {newPost && course?.id && (
                <PostForm
                  fetchPosts={fetchPosts}
                  courseId={course.id}
                  onClose={() => setNewPost(false)}
                  type={"post"}
                />
              )}
              {newAssignment && course?.id && (
                <PostForm
                  fetchPosts={fetchPosts}
                  courseId={course.id}
                  onClose={() => setNewAssignment(false)}
                  type={"assignment"}
                />
              )}
              {posts.map((post: PostType) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  text={post.text}
                  commentCount={post.commentCount}
                  name={post.user.name}
                  deadline={post.deadline}
                  max_score={post.max_score}
                  type={post.type}
                />
              ))}
            </>
          ) : (
            <div className="card card-border bg-base-100 w-[80%] max-h-[70vh]">
              <div className="card-body items-left">
                <h1 className="font-bold">Teachers</h1>
                <hr />
                <ul className="indent-4">
                  {course?.teachers.map(
                    (teacher: { email: string; name: string }) => (
                      <li className="flex w-full mb-1 truncate">
                        <span className="w-20">{teacher.name}</span>
                        <div className="divider divider-horizontal"></div>
                        <span>{teacher.email}</span>
                      </li>
                    ),
                  )}
                </ul>
                <h1 className="font-bold">Students</h1>
                <hr />
                <ul className="indent-4">
                  {course?.students.map(
                    (student: { email: string; name: string }) => (
                      <li className="flex w-full mb-1 truncate">
                        <span className="w-20">{student.name}</span>
                        <div className="divider divider-horizontal"></div>
                        <span>{student.email}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      {error && <p>{error}</p>}
    </>
  );
};

export default Course;
