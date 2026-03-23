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

  // ---LOGIN STATES ---
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const [error, setError] = useState("");

  const adminEmail = "lyphan232@gmail.com";
  const adminPassword = "Lyphan232";
  // ----------------------------------

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 9;

  const regions = ["", ...new Set(meals.map((meal) => meal.region))];

  const loadMeals = async () => {
    const res = await fetch(
      "https://suggest-meals-publicapi-1.onrender.com/meals",
    );
    const data = await res.json();
    setMeals(data);
  };

  useEffect(() => {
    // --- CHECK SESSION ---
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    // ------------------------------------
    loadMeals();
  }, []);

  // --- AUTH LOGIC ---
  const handleAuth = (e) => {
    e.preventDefault();
    setError("");

    // Lấy danh sách user từ máy
    const storageUsers = JSON.parse(localStorage.getItem("accounts") || "[]");

    if (isRegister) {
      // Không cho phép đăng ký email trùng với Admin cố định
      if (email === adminEmail || storageUsers.find((u) => u.email === email)) {
        return setError("Email này đã tồn tại hoặc được bảo vệ!");
      }
      storageUsers.push({ email, password });
      localStorage.setItem("accounts", JSON.stringify(storageUsers));

      // Chuyển sang đăng nhập và hiện thông báo thành công màu xanh (tùy chọn) hoặc đỏ nhẹ
      setIsRegister(false);
      setError("Đăng ký thành công! Hãy đăng nhập.");
    } else {
      // KIỂM TRA ĐĂNG NHẬP
      if (email === adminEmail && password === adminPassword) {
        const adminUser = {
          email: adminEmail,
          password: adminPassword,
        };
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
      } else {
        // Nếu không phải admin thì mới tìm trong danh sách đăng ký tự do
        const foundUser = storageUsers.find(
          (u) => u.email === email && u.password === password,
        );
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem("user", JSON.stringify(foundUser));
        } else {
          // THAY ALERT BẰNG CẢNH BÁO CHỮ ĐỎ
          setError(
            "Tài khoản không tồn tại hoặc sai mật khẩu. Hãy tạo tài khoản mới!",
          );
        }
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  // --------------------------------

  const deleteMeal = async (id) => {
    await fetch(`https://suggest-meals-publicapi-1.onrender.com/meals/${id}`, {
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
    setError("");
  }, [search, region, isRegister]);

  // --- LOGIC HIỂN THỊ MÀN HÌNH ĐĂNG NHẬP ---
  if (!user) {
    return (
      <div
        className="login-page-container"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + "/images/login-bg.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div
          className="card p-4 shadow"
          style={{ width: "350px", borderRadius: "15px" }}
        >
          <h3 className="text-center mb-4">
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </h3>
          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email"
              className="form-control mb-2"
              required
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="form-control mb-3"
              required
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            {error && (
              <div className="text-danger small mb-3 text-center fw-bold">
                {error}
              </div>
            )}

            <button className="btn btn-primary w-100 mb-2">
              {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
            </button>
          </form>
          <button
            className="btn btn-link btn-sm w-100 text-decoration-none"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Quay lại Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* NAVBAR */}
      <nav
        className="navbar navbar-dark shadow sticky-top"
        style={{
          background: "linear-gradient(90deg, #FF512F 0%, #F09819 100%)",
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          {/* LOGO */}

          <span className="navbar-brand neon-chef">✨ ChefLee</span>
          {/* USER & LOGOUT */}
          <div className="d-flex align-items-center gap-3">
            {/* KHỐI USER */}
            <div className="d-none d-md-flex align-items-center border-end pe-3 border-secondary">
              <div
                className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold text-white me-2"
                style={{ width: "35px", height: "35px", fontSize: "14px" }}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="text-start">
                <div
                  className="small fw-bold text-black"
                  style={{ fontSize: "16px" }}
                >
                  {user.email}
                </div>
                <span
                  className={`badge ${user.email === adminEmail ? "bg-danger" : "bg-info text-dark"} shadow-sm`}
                  style={{ fontSize: "10px" }}
                >
                  {user.email === adminEmail ? "ADMIN" : "MEMBER"}
                </span>
              </div>
            </div>

            {/* NÚT ĐĂNG XUẤT  */}
            <button
              className="btn btn-outline btn-sm fw-bold px-3 text-white"
              onClick={logout}
              style={{
                borderRadius: "8px",
                transition: "0.3s",
                background: "linear-gradient(45deg, #36d1dc, #5b86e5)",
              }}
            >
              Đăng xuất
            </button>
          </div>
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

        {/* THÊM MÓN */}
        <AddMeal reloadMeals={loadMeals} />

        <div className="row mt-4">
          {currentMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              deleteMeal={deleteMeal}
              viewDetail={setSelectedMeal}
              isAdmin={user.email === adminEmail}
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
      <footer
        className="py-5 mt-5"
        style={{ background: "#fff5f0", borderTop: "5px solid #FF512F" }}
      >
        <div className="container py-4">
          <div className="row ">
            {/* about */}
            <div className="col-md-6">
              <h5>👨‍🍳 ChefLee</h5>
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
