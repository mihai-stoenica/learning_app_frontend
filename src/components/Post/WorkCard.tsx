import { useState } from "react";
import * as React from "react";
import { useLoader } from "../../contexts/LoaderContext.tsx";
import { post } from "../../services/http.ts";
import { useToast } from "../../contexts/ToastContext.tsx";

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

type WorkCardPropType = {
  submission: SubmissionType;
  onSubmit: () => void;
};

const WorkCard = ({ submission, onSubmit }: WorkCardPropType) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const { setLoading } = useLoader();
  const { showToast } = useToast();

  const [score, setScore] = useState<number | null>(submission.score ?? null);

  const submitScore = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await post(
        `${API_URL}/submission/score/submission/${submission.id}`,
        {
          score: score,
        },
      );

      if (!res.isError) {
        onSubmit();
      } else {
        showToast(res.message);
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
            {submission.assignment.title}
          </h1>
          <>
            <h1 className={"w-40 truncate"}>
              {submission.score ?? 0} / {submission.assignment.max_score}
            </h1>
          </>

          <h1 className={"w-20 truncate text-right"}>{submission.user.name}</h1>
        </div>
        <hr />
        <div className={"flex flex-row justify-between"}>
          <p>{submission.assignment.text}</p>
          <form className={"flex flex-row gap-1"} onSubmit={submitScore}>
            <input
              type="number"
              className="input validator"
              required
              placeholder="Score"
              min="0"
              max={submission.assignment.max_score}
              onChange={(e) => setScore(parseFloat(e.target.value))}
              value={score ?? ""}
            />
            <button className={"btn btn-ghost "}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;
