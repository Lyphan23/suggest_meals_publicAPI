function MealDetail({ meal, close }) {
  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{meal.name}</h5>

            <button className="btn-close" onClick={close}></button>
          </div>

          <div className="modal-body">
            <img
              src={process.env.PUBLIC_URL + meal.image}
              className="img-fluid mb-3"
              alt={meal.name}
            />

            <h5>Quốc gia</h5>
            <p>{meal.region}</p>

            <h5>Nguyên liệu chính</h5>
            <p>{meal.ingredientMain}</p>

            {meal.description && (
              <>
                <h5>Mô tả</h5>
                <p>{meal.description}</p>
              </>
            )}

            {meal.ingredients && (
              <>
                <h5>Các nguyên liệu</h5>
                <ul>
                  {meal.ingredients.map((i, index) => (
                    <li key={index}>{i}</li>
                  ))}
                </ul>
              </>
            )}

            {meal.instructions && (
              <>
                <h5>Hướng dẫn cách làm</h5>
                <p>{meal.instructions}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealDetail;
