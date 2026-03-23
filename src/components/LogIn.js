import { useState } from "react";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Gọi đến mảng users trong database của bạn
      const res = await fetch(
        "https://suggest-meals-publicapi-2.onrender.com/users",
      );
      const users = await res.json();

      if (isRegister) {
        // --- LOGIC ĐĂNG KÝ ---
        if (users.find((u) => u.email === email)) {
          return setError("Email này đã được đăng ký!");
        }

        const newUser = {
          name: email.split("@")[0], // Tạm lấy tên từ email
          email,
          password,
          role: "user", // Mặc định là member
        };

        const saveRes = await fetch(
          "https://suggest-meals-publicapi-2.onrender.com/users",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          },
        );

        if (saveRes.ok) {
          setIsRegister(false);
          setError("Đăng ký thành công! Mời bạn đăng nhập.");
        }
      } else {
        // --- LOGIC ĐĂNG NHẬP ---
        // 1. Kiểm tra xem email đã tồn tại chưa
        const existingUser = users.find((u) => u.email === email);

        if (!existingUser) {
          // Nếu không tìm thấy email trong database
          setError("Tài khoản chưa tồn tại, vui lòng đăng ký!");
        } else if (existingUser.password !== password) {
          // Nếu có email nhưng mật khẩu không khớp
          setError("Sai mật khẩu!");
        } else {
          // Nếu đúng cả email và mật khẩu
          onLoginSuccess(existingUser);
        }
      }
    } catch (err) {
      setError("Không thể kết nối với server!");
    }
  };

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
        style={{ width: "350px", borderRadius: "15px", zIndex: 2 }}
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
              setError(""); // Xóa lỗi khi người dùng gõ lại
            }}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="form-control mb-3"
            required
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Xóa lỗi khi người dùng gõ lại
            }}
          />
          {error && (
            <div
              className={`small mb-3 text-center fw-bold ${error.includes("thành công") ? "text-success" : "text-danger"}`}
            >
              {error}
            </div>
          )}
          <button className="btn btn-primary w-100 mb-2">
            {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
          </button>
        </form>
        <button
          className="btn btn-link btn-sm w-100 text-decoration-none"
          onClick={() => {
            setIsRegister(!isRegister);
            setError(""); // Xóa lỗi khi chuyển đổi giữa Đăng nhập/Đăng ký
          }}
        >
          {isRegister
            ? "Đã có tài khoản? Đăng nhập"
            : "Chưa có tài khoản? Đăng ký ngay"}
        </button>
      </div>
    </div>
  );
}

export default Login;
