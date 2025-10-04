import { useState } from "react";
import * as React from "react";
import { post } from "../../services/http.ts";
import { useLoader } from "../../contexts/LoaderContext.tsx";

type FormDataType = {
  title: string;
  text: string;
  deadline?: string;
  max_score?: number;
};

type PostFormProps = {
  courseId: number;
  fetchPosts(): Promise<void>;
  onClose: () => void;
  type: "post" | "assignment";
};

const PostForm: React.FC<PostFormProps> = ({
  fetchPosts,
  onClose,
  courseId,
  type,
}) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const { setLoading } = useLoader();

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    text: "",
  });

  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint =
      type === "post"
        ? `${API_URL}/post/new/course/${courseId}`
        : `${API_URL}/assignment/new/course/${courseId}`;

    setLoading(true);
    try {
      const res = await post(endpoint, formData);

      if (!res.isError) {
        await fetchPosts();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-border bg-base-100 w-[90%] mt-3 mb-3">
      <div className="card-body items-left">
        <form onSubmit={savePost}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Add post</legend>
            <label className="label">Name</label>
            <input
              type="text"
              placeholder="Title"
              className="input"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
              required={true}
            />
            <label className="label">Text</label>
            <textarea
              placeholder="Text"
              className={"input w-full"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  text: e.target.value,
                })
              }
              required={true}
            ></textarea>
            <div className={"flex flex-row justify-between items-center"}>
              {type === "assignment" && (
                <div className={"flex flex-row gap-1"}>
                  <div>
                    <label className="label">Deadline</label>
                    <input
                      type="datetime-local"
                      className="input"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deadline: new Date(e.target.value).toISOString(),
                        })
                      }
                      required={true}
                    />
                  </div>
                  <div>
                    <label className="label">Max score</label>
                    <input
                      type="number"
                      className="input"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_score: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              )}
              <button className={"btn btn-primary "}>Save</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
