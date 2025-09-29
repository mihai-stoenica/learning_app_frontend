import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { get } from "../../services/http.ts";
import { post as httpPost } from "../../services/http.ts";

type PostType = {
  id: number;
  title: string;
  text: string;
  name: string;
  commentCount: number;
  deadline?: string;
  max_score?: number;
  type: "post" | "assignment";
};

type CommentType = {
  id: number;
  text: string;
  user: { name: string };
};

const PostCard = (post: PostType) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [comments, setComments] = useState<CommentType[] | null>(null);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    const res = await get(`${API_URL}/comment/post/${post.id}`);
    if (!res.isError) setComments(res.data);
    else if (res.code !== 401) {
      alert(res.message);
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
      fetchComments();
    }
    setNewComment("");
  };

  return (
    <div className="card card-border bg-base-100 w-[90%] mt-3 mb-3">
      <div className="card-body items-left">
        <div className={"flex flex-row justify-between"}>
          <h1 className="font-bold text-[1.1rem]">{post.title} </h1>
          {post.type === "assignment" && (
            <>
              <h1> Due: {post.deadline}</h1>
              <h1>Max score: {post.max_score}</h1>
            </>
          )}

          <h1>
            {post.name} {}
          </h1>
        </div>
        <hr />
        <p>{post.text}</p>
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
