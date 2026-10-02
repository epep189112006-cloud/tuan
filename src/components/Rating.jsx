import { FaStar } from "react-icons/fa";

export default function Rating({ rating = 0, onChange, readOnly = false }) {
  return (
    <div className="d-inline-flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={star <= rating ? "text-warning" : "text-muted"}
          style={{ cursor: readOnly ? "default" : "pointer" }}
          onClick={() => {
            if (!readOnly && onChange) onChange(star);
          }}
        />
      ))}
    </div>
  );
}