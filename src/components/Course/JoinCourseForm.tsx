import { useState } from "react";
import { post } from "../../services/http.ts";

type CourseForm = {
  access_code: string;
};

type CourseProps = {
  onJoinCourse(): Promise<void>;
};

const CourseForm = ({ onJoinCourse }: CourseProps) => {
  const [formData, setFormData] = useState<CourseForm>({
    access_code: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const joinCourse = async () => {
    const res = await post(`${API_URL}/course/join`, formData);

    if (!res.isError) {
      await onJoinCourse();
    } else {
      alert(res.message);
    }
    setFormData({
      access_code: "",
    });
  };

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">New Course</legend>

            <label className="label">Name</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Access code"
              required={true}
              value={formData?.access_code}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  access_code: e.target.value,
                });
              }}
            />

            <button className="btn btn-neutral mt-4" onClick={joinCourse}>
              Join
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                (
                  document.getElementById("my_modal_2") as HTMLDialogElement
                ).close();
              }}
            >
              Cancel
            </button>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
};

export default CourseForm;
