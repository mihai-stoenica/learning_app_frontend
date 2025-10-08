import { useParams } from "react-router-dom";
import { get, post } from "../services/http.ts";
import { useCallback, useEffect, useState } from "react";
import PostCard from "../components/Post/PostCard.tsx";
import { Plus } from "lucide-react";
import PostForm from "../components/Post/PostForm.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useLoader } from "../contexts/LoaderContext.tsx";
import WorkCard from "../components/Post/WorkCard.tsx";

type UserType = {
  id: number;
  email: string;
  name: string;
};

type CourseType = {
  id: number;
  name: string;
  description: string;
  students: UserType[];
  teachers: UserType[];
  access_code: string;
};

type PostType = {
  id: number;
  title: string;
  text: string;
  user: UserType;
  commentCount: number;
  type: "post" | "assignment";
  deadline?: string;
  max_score?: number;
  isSubmitted?: boolean;
};

type SubmissionType = {
  id: number;
  user: {
    name: string;
  };
  assignment: {
    id: number;
    max_score: number;
    title: string;
    text: string;
  };
  answer: string;
  score?: number;
};

const Course = () => {
  const { id } = useParams();

  const { user } = useAuth();
  const { setLoading } = useLoader();

  const [activeTab, setActiveTab] = useState<"classwork" | "people" | "work">(
    "classwork",
  );
  const [course, setCourse] = useState<CourseType>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [work, setWork] = useState<SubmissionType[]>([]);
  const [newPost, setNewPost] = useState(false);
  const [newAssignment, setNewAssignment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const isTeacher = useCallback((): boolean => {
    return (
      course?.teachers.some((teacher) => teacher.email === user?.email) || false
    );
  }, [course, user]);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`${API_URL}/course/${id}`);
      if (!response.isError) {
        setCourse(response.data);
      } else {
        setError(response.message);
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, id, setLoading]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`${API_URL}/post/course/${id}`);
      if (!response.isError) {
        setPosts(response.data);
      } else {
        setError(response.message);
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, id, setLoading]);

  const fetchWork = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`${API_URL}/course/work/${id}`);
      if (!response.isError) {
        setWork(response.data);
      } /*if(response.code !==  403)*/ else {
        setError(response.message);
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, id, setLoading]);

  const makeTeacher = async (userId: number) => {
    setLoading(true);
    try {
      const res = await post(`${API_URL}/course/make_teacher/${course?.id}`, {
        user_id: userId,
      });

      if (!res.isError) {
        await fetchCourse();
      } else {
        alert(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchPosts();
    if (activeTab === "work") {
      fetchWork();
    }
  }, [fetchCourse, fetchPosts, fetchWork, activeTab]);

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
            {isTeacher() && (
              <input
                type="radio"
                value={3}
                name="tabs"
                className="tab"
                aria-label="Work"
                onChange={() => setActiveTab("work")}
              />
            )}
          </div>
          {activeTab === "classwork" && (
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
                {isTeacher() && (
                  <button
                    className="btn btn-outline"
                    onClick={() => setNewAssignment(!newAssignment)}
                  >
                    <Plus />
                    Add assignment
                  </button>
                )}
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
                  post={post}
                  fetchAll={fetchPosts}
                  canSubmit={() => !isTeacher()}
                />
              ))}
            </>
          )}

          {activeTab === "people" && (
            <div className="card card-border bg-base-100 w-[80%] max-h-[70vh]">
              <div className="card-body items-left">
                <h1 className="font-bold">Teachers</h1>
                <hr />
                <ul className="indent-4">
                  {course?.teachers.map((teacher: UserType) => (
                    <li className="flex w-full mb-1 truncate items-center">
                      <span className="w-20">{teacher.name}</span>
                      <div className="divider divider-horizontal"></div>
                      <span>{teacher.email}</span>
                    </li>
                  ))}
                </ul>
                <h1 className="font-bold">Students</h1>
                <hr />
                <ul className="indent-4">
                  {course?.students.map(
                    (student: { id: number; email: string; name: string }) => (
                      <li className="flex w-full mb-1 truncate items-center">
                        <span className="w-20">{student.name}</span>
                        <div className="divider divider-horizontal"></div>
                        <span>{student.email}</span>
                        {isTeacher() && (
                          <button
                            className={"btn btn-sm ml-4 rounded-full"}
                            onClick={() => makeTeacher(student.id)}
                          >
                            Make teacher
                          </button>
                        )}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          )}
          {activeTab === "work" &&
            isTeacher() &&
            work.map((item) => (
              <WorkCard key={item.id} submission={item} onSubmit={fetchWork} />
            ))}
        </div>
      )}
      {error && <p>{error}</p>}
    </>
  );
};

export default Course;
