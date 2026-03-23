import { useState, useEffect } from "react";

function MealCard({ meal, deleteMeal, viewDetail, isAdmin, refreshReviews }) {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Lấy các review thuộc về món ăn này
    fetch(
      `https://suggest-meals-publicapi-2.onrender.com/reviews?mealId=${meal.id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setReviewCount(data.length);
        if (data.length > 0) {
          const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
          setAverageRating((sum / data.length).toFixed(1)); // Lấy 1 chữ số thập phân
        }
      })
      .catch((err) => console.log(err));
  }, [meal.id, refreshReviews]);

  // Hàm render số sao cho đẹp
  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.round(averageRating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= roundedRating ? "text-warning" : "text-secondary"}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card meal-card h-100 border-0 shadow">
        <div className="image-container">
          <img
            src={meal.image}
            className="card-img-top"
            alt={meal.name}
            style={{ height: "250px", objectFit: "cover" }}
          />
        </div>
        <div className="card-body text-center">
          <h5 className="card-title fw-bold mb-1">{meal.name}</h5>

          {/* PHẦN HIỂN THỊ ĐIỂM ĐÁNH GIÁ TRUNG BÌNH */}
          <div className="mb-2" style={{ fontSize: "14px" }}>
            {renderStars()}
            <span className="ms-2 text-muted fw-bold">
              {reviewCount > 0
                ? `${averageRating} (${reviewCount})`
                : "Chưa có đánh giá"}
            </span>
          </div>

          <span className="badge bg-warning text-dark mb-3">{meal.region}</span>

          <div className="d-flex justify-content-center gap-2 mt-2">
            <button className="btn btn-detail" onClick={() => viewDetail(meal)}>
              Chi tiết
            </button>

            {/* CHỈ ADMIN MỚI THẤY NÚT XÓA */}
            {isAdmin && (
              <button
                className="btn btn-delete"
                onClick={() => deleteMeal(meal.id)}
              >
                🗑 Xóa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealCard;
