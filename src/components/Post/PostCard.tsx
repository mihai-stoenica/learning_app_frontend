import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { get } from "../../services/http.ts";
import { post as httpPost } from "../../services/http.ts";
import * as React from "react";
import { useLoader } from "../../contexts/LoaderContext.tsx";
import { useToast } from "../../contexts/ToastContext.tsx";

type PostType = {
  id: number;
  title: string;
  text: string;
  user: { name: string };
  commentCount: number;
  deadline?: string;
  max_score?: number;
  type: "post" | "assignment";
  isSubmitted?: boolean;
};

type CommentType = {
  id: number;
  text: string;
  user: { name: string };
};

type PostCardProps = {
  post: PostType;
  fetchAll: () => void;
  canSubmit: () => boolean;
};

const PostCard = ({ post, fetchAll, canSubmit }: PostCardProps) => {
  const { showToast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL;
  const CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [comments, setComments] = useState<CommentType[] | null>(null);
  const [newComment, setNewComment] = useState("");
  const [file, setFile] = useState<File | null>();

  const { setLoading } = useLoader();

  const fetchComments = async () => {
    const res = await get(`${API_URL}/comment/post/${post.id}`);
    if (!res.isError) setComments(res.data);
    else if (res.code !== 401) {
      showToast(res.message, "error");
    }
  };
  const toggleExpand = async (checked: boolean) => {
    if (!isCollapsed && comments === null) {
      await fetchComments();
    }
    setIsCollapsed(checked);
  };

  const submitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      post_id: post.id,
      text: newComment,
    };

    const res = await httpPost(`${API_URL}/comment/new`, body);
    if (!res.isError) {
      await fetchComments();
    }
    setNewComment("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "assignment_files");
    /*formData.append("public_id", `${file.name}`);*/
    setLoading(true);
    try {
      const fileRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await fileRes.json();

      const res = await httpPost(
        `${API_URL}/submission/new/assignment/${post.id}`,
        {
          answer: data.url,
        },
      );

      if (res.isError) {
        showToast(res.message, "error");
      } else {
        fetchAll();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-border bg-base-100 w-[90%] mt-3 mb-3">
      <div className="card-body items-left">
        <div className={"flex flex-row justify-between"}>
          <h1 className="font-bold text-[1.1rem] w-32 truncate">
            {post.title}{" "}
          </h1>
          {post.type === "assignment" && (
            <>
              <h1 className={"w-40 truncate"}> Due: {post.deadline}</h1>
              <h1 className={"w-40 truncate"}>Max score: {post.max_score}</h1>
            </>
          )}

          <h1 className={"w-20 truncate text-right"}>
            {post.user.name} {}
          </h1>
        </div>
        <hr />
        <div className={"flex flex-row justify-between"}>
          <p>{post.text}</p>
          {(post.type === "assignment" && !post.isSubmitted && canSubmit() && (
            <>
              <form onSubmit={handleUpload}>
                <input
                  type="file"
                  className="file-inputh h-8 max-w-52"
                  onChange={handleFileChange}
                />
                <button className={"btn btn-outline btn-sm"} type={"submit"}>
                  Submit
                </button>
              </form>
            </>
          )) ||
            (post.isSubmitted && (
              <p className={"text-right"}>You already submitted your work</p>
            ))}
        </div>

        <div className="collapse bg-base-100 ">
          <input
            type="checkbox"
            checked={isCollapsed}
            onChange={(e) => toggleExpand(e.target.checked)}
          />
          <div className="collapse-title font-semibold flex flex-row items-center  gap-3">
            <h1 className="h-full">
              Comments <span>({post.commentCount})</span>
            </h1>
            <ChevronsUpDown className="h-[50%]" />
          </div>
          <div className="collapse-content">
            {comments &&
              comments?.length > 0 &&
              comments.map((c: CommentType) => (
                <div key={c.id} className="mb-4">
                  <div className="text-sm">
                    <span className="font-medium">{c.user.name}: </span>
                    <p>{c.text}</p>
                  </div>
                  <hr className="mt-1" />
                </div>
              ))}

            {comments?.length === 0 && <p className="mb-4">No comments yet.</p>}

            <form onSubmit={submitComment}>
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                type="text"
                placeholder="Add comment"
                className="input input-ghost border-b"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
