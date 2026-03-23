import { useState } from "react";

function AddReview({ mealId, currentUser, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) return alert("Vui lòng đăng nhập để đánh giá!");

    setIsSubmitting(true); // Vô hiệu hóa nút bấm trong lúc chờ server

    const newReview = {
      mealId: mealId,
      userEmail: currentUser.email,
      rating: Number(rating),
      comment: comment,
      date: new Date().toISOString().split("T")[0], // Lấy ngày YYYY-MM-DD
    };

    try {
      const res = await fetch(
        "https://suggest-meals-publicapi-2.onrender.com/reviews",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview),
        },
      );

      if (res.ok) {
        const savedReview = await res.json();
        onReviewAdded(savedReview); // Gửi review mới tạo lên component cha (MealDetail)
        setComment(""); // Reset lại form
        setRating(5);
      }
    } catch (error) {
      console.error("Lỗi khi thêm review:", error);
      alert("Không thể gửi đánh giá lúc này, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false); // Bật lại nút bấm
    }
  };

  return (
    <div className="bg-light p-3 rounded border mt-3">
      <h6 className="fw-bold mb-3">Viết đánh giá của bạn</h6>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label small fw-bold">Chất lượng món ăn:</label>
          <select
            className="form-select w-auto"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="5">5 Sao - Tuyệt vời</option>
            <option value="4">4 Sao - Rất ngon</option>
            <option value="3">3 Sao - Bình thường</option>
            <option value="2">2 Sao - Tạm được</option>
            <option value="1">1 Sao - Tệ</option>
          </select>
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="2"
            placeholder="Chia sẻ cảm nhận của bạn về món ăn này..."
            value={comment}
            required
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-review px-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>
    </div>
  );
}

export default AddReview;
