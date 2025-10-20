import courseImg from "../../assets/course.jpg";
import { useNavigate } from "react-router-dom";

type CardProps = {
  id: number;
  name: string;
  description: string;
  teacher: string;
};

const CourseCard = (course: CardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="card bg-base-100 w-72 h-fit shadow-sm"
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <figure>
        <img src={courseImg} alt="Course" className="h-auto" />
      </figure>
      <div className="card-body">
        <div className="flex flex-row justify-between items-center">
          <h2 className="card-title">{course.name}</h2>
          <h2 className="text-xs">-{course.teacher}</h2>
        </div>
        <p className="truncate">{course.description}</p>
      </div>
    </div>
  );
};

export default CourseCard;
