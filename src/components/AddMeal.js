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

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage("/images/" + file.name);
    }
  };

  const addMeal = async (e) => {
    e.preventDefault();

    const newMeal = {
      name,
      region,
      ingredientMain,
      description,
      ingredients: ingredients.split(","),
      instructions,
      image,
    };

    await fetch("https://suggest-meals-website-5.onrender.com/meals", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newMeal),
    });

    reloadMeals();

    setShowForm(false);
  };

  return (
    <div className="mt-4">
      <button className="btn-add-meal" onClick={() => setShowForm(!showForm)}>
        Thêm món ăn
      </button>

      {showForm && (
        <form
          onSubmit={addMeal}
          className="border p-3 mt-3 shadow-sm bg-white rounded"
        >
          <h5>Thêm món ăn mới</h5>

          <input
            className="form-control mb-2"
            placeholder="Tên món ăn"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Quốc gia"
            onChange={(e) => setRegion(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Nguyên liệu chính"
            onChange={(e) => setIngredientMain(e.target.value)}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Mô tả"
            onChange={(e) => setDescription(e.target.value)}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Nguyên liệu (phân tách bằng dấu phẩy)"
            onChange={(e) => setIngredients(e.target.value)}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Hướng dẫn cách làm"
            onChange={(e) => setInstructions(e.target.value)}
          />

          <input
            type="file"
            className="form-control mb-3"
            onChange={handleImage}
          />

          <button className="btn-save-meal">Lưu món ăn</button>
        </form>
      )}
    </div>
  );
}

export default AddMeal;
