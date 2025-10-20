import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoader } from "../contexts/LoaderContext.tsx";
import { get } from "../services/http.ts";
import PostCard from "../components/Post/PostCard.tsx";
import { useToast } from "../contexts/ToastContext.tsx";

type TodoType = {
  deadline: string;
  max_score: number;
  id: number;
  title: string;
  text: string;
  user: {
    name: string;
  };
  course: {
    name: string;
  };
  type: "post" | "assignment";
  commentCount: number;
};

const Todo = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [todo, setTodo] = useState<TodoType[]>();
  const { setLoading } = useLoader();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"upcoming" | "missed">("upcoming");

  const fetchTodo = useCallback(async () => {
    const endpoint = activeTab === "upcoming" ? "todo" : "missed";
    setLoading(true);
    try {
      const res = await get(`${API_URL}/assignment/${endpoint}`);

      if (!res.isError) {
        setTodo(res.data);
      } else if (res.code !== 401) {
        showToast(res.message, "error");
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, setTodo, setLoading, showToast, activeTab]);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo, activeTab]);

  const groupedTodo = useMemo(() => {
    if (!todo) return {};
    return todo.reduce(
      (acc, item) => {
        const courseName = item.course.name;
        if (!acc[courseName]) acc[courseName] = [];
        acc[courseName].push(item);
        return acc;
      },
      {} as Record<string, TodoType[]>,
    );
  }, [todo]);

  return (
    <>
      <div className="flex flex-col items-center mt-5">
        <div className="tabs tabs-border mb-2">
          <input
            type="radio"
            value={1}
            name="tabs"
            className="tab text-success"
            aria-label="Upcoming"
            defaultChecked
            onChange={() => setActiveTab("upcoming")}
          />
          <input
            type="radio"
            value={2}
            name="tabs"
            className="tab text-error"
            aria-label="Missed"
            onChange={() => setActiveTab("missed")}
          />
        </div>
      </div>

      <div className={"flex flex-col items-center w-full"}>
        <h1 className={"font-bold text-3xl my-6"}>
          {activeTab === "upcoming" ? "Upcoming work" : "Missed work"}
        </h1>
        {groupedTodo &&
          Object.entries(groupedTodo).map(([courseName, assignments]) => (
            <div
              key={courseName}
              className={"flex flex-col items-center mt-5 w-full"}
            >
              <h2 className={"w-[90%] text-left  font-bold text-2xl underline"}>
                {courseName}
              </h2>
              {assignments.map((item: TodoType) => (
                <PostCard
                  key={item.id}
                  post={item}
                  fetchAll={fetchTodo}
                  canSubmit={() => activeTab === "upcoming"}
                />
              ))}
              <div className="divider w-[95%] mx-auto" />
            </div>
          ))}
      </div>
    </>
  );
};

export default Todo;
