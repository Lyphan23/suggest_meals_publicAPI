import { useState, useEffect } from "react";
import AddReview from "./AddReview";

function MealDetail({ meal, close, currentUser, onReviewAdded }) {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(
      `https://suggest-meals-publicapi-2.onrender.com/reviews?mealId=${meal.id}`,
    )
      .then((res) => res.json())
      .then((data) => setReviews(data));

    fetch(`https://suggest-meals-publicapi-2.onrender.com/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [meal.id]);

  const getUserInfo = (email) => {
    const user = users.find((u) => u.email === email);
    return (
      user || {
        name: user?.name || email.split("@")[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      }
    );
  };

  const handleReviewAdded = (newReview) => {
    setReviews([...reviews, newReview]);
    if (onReviewAdded) onReviewAdded();
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark">{meal.name}</h5>
            <button className="btn-close" onClick={close}></button>
          </div>

          <div className="modal-body">
            <img
              src={meal.image}
              className="img-fluid rounded mb-3 w-100"
              alt={meal.name}
              style={{ maxHeight: "350px", objectFit: "cover" }}
            />

            <div className="row mb-3">
              <div className="col-md-6">
                <h6 className="text-secondary fw-bold">📍 Quốc gia</h6>
                <p>{meal.region}</p>
              </div>
              <div className="col-md-6">
                <h6 className="text-secondary fw-bold">🥩 Nguyên liệu chính</h6>
                <p>{meal.ingredientMain}</p>
              </div>
            </div>

            {meal.description && (
              <>
                <h6 className="text-secondary fw-bold">📖 Mô tả</h6>
                <p className="bg-light p-2 rounded">{meal.description}</p>
              </>
            )}

            {meal.ingredients && (
              <>
                <h6 className="text-secondary fw-bold">🛒 Các nguyên liệu</h6>
                <ul>
                  {meal.ingredients.map((i, index) => (
                    <li key={index}>{i}</li>
                  ))}
                </ul>
              </>
            )}

            {meal.instructions && (
              <>
                <h6 className="text-secondary fw-bold">
                  🍳 Hướng dẫn cách làm
                </h6>
                <p style={{ whiteSpace: "pre-wrap" }}>{meal.instructions}</p>
              </>
            )}

            <hr className="my-4" />

            <h5 className="fw-bold mb-3">
              💬 Đánh giá từ cộng đồng ({reviews.length})
            </h5>

            <div
              className="review-list mb-4"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              {reviews.length === 0 ? (
                <p className="text-muted fst-italic">
                  Chưa có đánh giá nào cho món ăn này. Hãy là người đầu tiên!
                </p>
              ) : (
                reviews.map((rev) => {
                  const reviewer = getUserInfo(rev.userEmail);
                  return (
                    <div
                      key={rev.id}
                      className="d-flex mb-3 pb-3 border-bottom"
                    >
                      <img
                        src={
                          reviewer.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.userEmail}`
                        }
                        alt="avatar"
                        className="rounded-circle me-3 border"
                        style={{ width: "45px", height: "45px" }}
                      />
                      <div>
                        <div className="d-flex align-items-center mb-1">
                          <strong className="me-2">{reviewer.name}</strong>
                          <span className="text-warning">
                            {"★".repeat(Number(rev.rating) || 0)}
                            {"☆".repeat(5 - (Number(rev.rating) || 0))}
                          </span>
                          <small className="text-muted ms-3">{rev.date}</small>
                        </div>
                        <p className="mb-0" style={{ fontSize: "15px" }}>
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <AddReview
              mealId={meal.id}
              currentUser={currentUser}
              onReviewAdded={handleReviewAdded}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealDetail;
