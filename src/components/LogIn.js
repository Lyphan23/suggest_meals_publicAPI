import { useState } from "react";

function Login({ onLoginSuccess }) {
  const [name, setName] = useState(""); // Thêm state để lưu tên
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
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
          name: name.trim() !== "" ? name : email.split("@")[0], // Dùng tên vừa nhập
          email,
          password,
          role: "user",
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
          setName(""); // Xóa trắng ô tên sau khi đăng ký xong
        }
      } else {
        // --- LOGIC ĐĂNG NHẬP ---
        const existingUser = users.find((u) => u.email === email);

        if (!existingUser) {
          setError("Tài khoản chưa tồn tại, vui lòng đăng ký!");
        } else if (existingUser.password !== password) {
          setError("Sai mật khẩu!");
        } else {
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
          {/* CHỈ HIỆN Ô TÊN KHI Ở CHẾ ĐỘ ĐĂNG KÝ */}
          {isRegister && (
            <input
              type="text"
              placeholder="Tên hiển thị (VD: Ly Phan)"
              className="form-control mb-2"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="form-control mb-2"
            required
            value={email}
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
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
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
            setError("");
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
