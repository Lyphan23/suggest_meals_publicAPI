import { useState } from "react";

function AddMeal({ reloadMeals }) {
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [ingredientMain, setIngredientMain] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");

  const addMeal = async (e) => {
    e.preventDefault();

    const newMeal = {
      name,
      region,
      ingredientMain,
      description,
      ingredients: ingredients.split(",").map((item) => item.trim()),
      instructions,
      image,
    };

    await fetch("https://suggest-meals-publicapi-2.onrender.com/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMeal),
    });

    reloadMeals();
    setShowForm(false);

    setImage("");
    setName("");
  };

  return (
    <div className="mt-4">
      <button className="btn-add-meal" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Đóng Form" : "Thêm món ăn mới"}
      </button>

      {showForm && (
        <form
          onSubmit={addMeal}
          className="border p-4 mt-3 shadow-sm bg-white rounded"
        >
          <h5 className="mb-3 text-primary">Thông tin món ăn mới</h5>

          <input
            className="form-control mb-2"
            placeholder="Tên món ăn (Ví dụ: Gỏi cuốn)"
            required
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Quốc gia (Ví dụ: Việt Nam)"
            required
            onChange={(e) => setRegion(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Nguyên liệu chính (Ví dụ: Tôm, thịt heo)"
            onChange={(e) => setIngredientMain(e.target.value)}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Mô tả ngắn gọn về món ăn"
            onChange={(e) => setDescription(e.target.value)}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Các nguyên liệu (phân tách bằng dấu phẩy: Rau, bánh tráng, tôm...)"
            onChange={(e) => setIngredients(e.target.value)}
          />

          <textarea
            className="form-control mb-2"
            rows="3"
            placeholder="Hướng dẫn cách nấu từng bước"
            onChange={(e) => setInstructions(e.target.value)}
          />

          {/* Ô nhập link ảnh */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Link địa chỉ hình ảnh (URL):
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Dán link ảnh từ Internet vào đây..."
              value={image}
              required
              onChange={(e) => setImage(e.target.value)}
            />
            {image && (
              <div className="mt-2 text-center">
                <p className="small text-muted">Xem trước ảnh:</p>
                <img
                  src={image}
                  alt="Preview"
                  style={{ maxHeight: "150px", borderRadius: "8px" }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150?text=Link+anh+loi";
                  }}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn-save-meal w-100">
            Lưu món ăn vào hệ thống
          </button>
        </form>
      )}
    </div>
  );
}

export default AddMeal;
