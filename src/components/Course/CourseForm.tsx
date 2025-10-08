import { useState } from "react";
import { post } from "../../services/http.ts";
import { useToast } from "../../contexts/ToastContext.tsx";

type CourseForm = {
  name: string;
  description: string;
};

type CourseProps = {
  onSaveCourse(): Promise<void>;
};

const CourseForm = ({ onSaveCourse }: CourseProps) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<CourseForm>({
    name: "",
    description: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const saveCourse = async () => {
    const res = await post(`${API_URL}/course/new`, formData);

    if (!res.isError) {
      showToast("Course created", "success");
      await onSaveCourse();
      setFormData({
        name: "",
        description: "",
      });
    } else {
      showToast(res.message, "error");
    }
  };

  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">New Course</legend>

            <label className="label">Name</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Name"
              required={true}
              value={formData?.name}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  name: e.target.value,
                });
              }}
            />

            <label className="label">Description</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Descritption"
              required={true}
              value={formData?.description}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  description: e.target.value,
                });
              }}
            />
            <button className="btn btn-neutral mt-4" onClick={saveCourse}>
              Save
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                (
                  document.getElementById("my_modal_1") as HTMLDialogElement
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
