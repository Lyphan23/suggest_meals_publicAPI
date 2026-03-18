import { useEffect, useState } from "react";
import MealCard from "./components/MealCard";
import AddMeal from "./components/AddMeal";
import SearchFilter from "./components/SearchFilter";
import MealDetail from "./components/MealDetail";

function App() {
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 9;

  const regions = ["", ...new Set(meals.map((meal) => meal.region))];
  const API_URL = "https://suggest-meals-website-5.onrender.com";
  const loadMeals = async () => {
    const res = await fetch(`${API_URL}/meals`);
    const data = await res.json();
    setMeals(data);
  };

  const deleteMeal = async (id) => {
    await fetch(`${API_URL}/meals/${id}`, {
      method: "DELETE",
    });
    loadMeals();
  };

  // filter
  const filteredMeals = meals.filter((meal) => {
    const matchIngredient = meal.ingredients.some((ingredient) =>
      ingredient.toLowerCase().includes(search.toLowerCase()),
    );

    return matchIngredient && (region === "" || meal.region === region);
  });

  // pagination logic
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;

  const currentMeals = filteredMeals.slice(indexOfFirstMeal, indexOfLastMeal);

  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);

  // reset page when search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, region]);

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 shadow sticky-top">
        <div className="container">
          <span className="navbar-brand fs-2 fw-bold">🍜 Hôm nay ăn gì?</span>
        </div>
      </nav>

      {/* BANNER */}
      <div
        className="hero-section text-white text-center "
        style={{
          backgroundImage: ` url(${
            process.env.PUBLIC_URL + "/images/food-banner.jpg"
          })`,
          height: "930px",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">
            Khám phá những công thức nấu ăn ngon
          </h1>
          <p className="lead">Tìm kiếm món ăn theo nguyên liệu và quốc gia</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="container mt-4 bg-white py-4 rounded shadow-sm">
        <SearchFilter
          setSearch={setSearch}
          setRegion={setRegion}
          regions={regions}
        />

        <AddMeal reloadMeals={loadMeals} />

        <div className="row mt-4">
          {currentMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              deleteMeal={deleteMeal}
              viewDetail={setSelectedMeal}
            />
          ))}
        </div>

        {/* PAGINATION */}
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {selectedMeal && (
        <MealDetail meal={selectedMeal} close={() => setSelectedMeal(null)} />
      )}

      {/* FOOTER */}
      <footer className="footer mt-5 text-white">
        <div className="container py-4">
          <div className="row ">
            {/* about */}
            <div className="col-md-6">
              <h5>🍜 Hôm nay ăn gì?</h5>
              <p>
                Website gợi ý các món ăn ngon từ nhiều quốc gia. Tìm kiếm món ăn
                theo nguyên liệu và khám phá công thức nấu ăn thú vị.
              </p>
            </div>

            {/* contact */}
            <div className="col-md-6">
              <h5>Liên hệ</h5>
              <p>Email: foodapp@gmail.com</p>
              <p>Phone: 0123 456 789</p>
            </div>
          </div>

          <hr className="bg-light" />

          <div className="text-center">© 2026 Hôm nay ăn gì?</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
