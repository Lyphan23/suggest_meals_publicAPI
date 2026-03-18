function MealCard({ meal, deleteMeal, viewDetail }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card meal-card h-100 border-0 shadow-lg">
        <div className="image-container">
          <img
            src={process.env.PUBLIC_URL + meal.image}
            className="card-img-top"
            alt={meal.name}
          />
        </div>

        <div className="card-body text-center">
          <h5 className="card-title fw-bold">{meal.name}</h5>

          <span className="badge bg-warning text-dark mb-3">
            🌍 {meal.region}
          </span>

          <div className="d-flex justify-content-center gap-2 mt-2">
            <button className="btn btn-detail" onClick={() => viewDetail(meal)}>
              👀 Chi tiết
            </button>

            <button
              className="btn btn-delete"
              onClick={() => deleteMeal(meal.id)}
            >
              🗑 Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealCard;
