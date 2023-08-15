const API = "http://localhost:3000/products";
const usersAPI = "http://localhost:3000/users";
const createProduct = document.querySelector("#createProduct");
// Получаем элементы
const modal = document.querySelector("#myModal");
const closeModal = document.querySelector(".close");
const btnAddNewProduct = document.querySelector("#btnAddNewProduct");
const productTitle = document.querySelector("#productTitle");
const productDesc = document.querySelector("#productDesc");
const productImg = document.querySelector("#productImg");
const productPrice = document.querySelector("#productPrice");
const cardContainer = document.querySelector("#cardContainer");
const btnEditProduct = document.querySelector("#btnEditProduct");

const signInBtn = document.querySelector("#signInBtn");

const limit = 5;
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

// Переменные для пагинации
let currentPage = 1;
let countPage = 1;

createProduct.addEventListener("click", () => {
  modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  productTitle.value = "";
  productDesc.value = "";
  productImg.value = "";
  productPrice.value = "";
  btnEditProduct.style.display = "none";
  btnAddNewProduct.style.display = "block";
  modal.style.display = "none";
});

btnAddNewProduct.addEventListener("click", () => {
  if (
    !productTitle.value.trim() ||
    !productDesc.value.trim() ||
    !productImg.value.trim() ||
    !productPrice.value.trim()
  ) {
    return alert("Заполните пустые поля");
  }
  const newProduct = {
    title: productTitle.value,
    desc: productDesc.value,
    img: productImg.value,
    price: productPrice.value,
  };
  addNewProduct(newProduct);
  render();
});

async function addNewProduct(product) {
  await fetch(API, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(product),
  });
  productTitle.value = "";
  productDesc.value = "";
  productImg.value = "";
  productPrice.value = "";
  modal.style.display = "none";
  render();
}

async function render() {
  const res = await fetch(`${API}?_page=${currentPage}&_limit=${limit}`);
  countPage = Math.ceil(res.headers.get("x-total-count") / limit);
  const data = await res.json();
  cardContainer.innerHTML = "";
  const maxTitleValue = 14;
  const maxDescValue = 24;
  data.forEach(({ title, desc, img, price, id }) => {
    console.log(desc.length);
    const truncatedTitle = // Обрезаю заголовок если его длину строки больше заданного
      title.length > maxTitleValue
        ? title.slice(0, maxTitleValue) + "..."
        : title;
    // const truncatedDesc =
    //   desc.length > maxDescValue ? desc.slice(0, maxDescValue) + "..." : desc;
    cardContainer.innerHTML += `
          <div class="card_item">
            <img
              src="${img}"
              alt=""
              class="card_item-img"
            />
            <div class="card_item-bottom">
              <div class="card_item-text">
                <h3 class="card_item-title">${truncatedTitle}</h3>
                <p class="card_item-desc">${desc}</p>
                <p class="card_item-price">price: ${price}$</p>
              </div>
              <div class="card_item-buttons">
                <button class="card_btn-delete" id=${id}>delete</button>
                <button class="card_btn-edit" id=${id}>edit</button>
              </div>
            </div>
          </div>
    `;
  });
  // pageFunc();
}

document.addEventListener("click", async ({ target: { classList, id } }) => {
  console.log(classList);
  const delBtn = [...classList];
  if (delBtn.includes("card_btn-delete")) {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      render();
    } catch (error) {
      console.log(error);
    }
  }
  render();
});

document.addEventListener("click", async ({ target: { classList, id } }) => {
  console.log(classList);
  const delBtn = [...classList];
  if (delBtn.includes("card_btn-edit")) {
    const res = await fetch(`${API}/${id}`);
    const { title, desc, img, price, id: productId } = await res.json();
    productTitle.value = title;
    productDesc.value = desc;
    productImg.value = img;
    productPrice.value = price;
    btnEditProduct.style.display = "block";
    modal.style.display = "block";
    btnEditProduct.textContent = "Save";
    btnEditProduct.setAttribute("id", productId);
    btnAddNewProduct.style.display = "none";
  }
  render();
});

btnEditProduct.addEventListener("click", ({ target: id }) => {
  if (
    !productTitle.value.trim() ||
    !productDesc.value.trim() ||
    !productImg.value.trim() ||
    !productPrice.value.trim()
  ) {
    return alert("Заполните пустые поля");
  }
  const editedProduct = {
    title: productTitle.value,
    desc: productDesc.value,
    img: productImg.value,
    price: productPrice.value,
  };
  editProduct(editedProduct, btnEditProduct.id);
});

async function editProduct(product, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json; charset = utf-8" },
      body: JSON.stringify(product),
    });
    productTitle.value = "";
    productDesc.value = "";
    productImg.value = "";
    productPrice.value = "";
    btnEditProduct.style.display = "none";
    modal.style.display = "none";
    btnAddNewProduct.style.display = "block";
    render();
  } catch (error) {
    console.log(error);
  }
}

// async function pageFunc() {
//   const res = fetch(API);
//   const data = res.json();
//   countPage = Math.ceil(data.length / limit);
// }
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage -= 1;
  render();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage += 1;
  render();
});

render();
