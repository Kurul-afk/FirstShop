const API = "http://localhost:3000/products";
const cardContainer = document.querySelector("#cardContainer");
const modal = document.querySelector("#myModal");
const productTitle = document.querySelector("#productTitle");
const productDesc = document.querySelector("#productDesc");
const productImg = document.querySelector("#productImg");
const productPrice = document.querySelector("#productPrice");
const btnEditProduct = document.querySelector("#btnEditProduct");
const closeModal = document.querySelector(".close");
console.log(cardContainer);

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

async function detailPage(id) {
  const res = await fetch(`${API}/${id}`);
  const { title, desc, price, img, id: productId } = await res.json();
  cardContainer.innerHTML = `
  <div class="card_item">
  <img
    src="${img}"
    alt=""
    class="card_item-img"
  />
  <div class="card_item-bottom">
    <div class="card_item-text">
      <h3 class="card_item-title">${title}</h3>
      <p class="card_item-desc">${desc}</p>
      <p class="card_item-price">price: ${price}$</p>
    </div>
    <div class="card_item-buttons">
      <button class="card_btn-edit" id=${productId}>edit</button>
    </div>
  </div>
</div>`;
}

const getItem = localStorage.getItem("anotherPage-id");
detailPage(getItem);

async function render() {
  const res = await fetch(API);
  const data = await res.json();
  data.forEach(({ title, desc, img, price, id }) => {
    cardContainer.innerHTML = `
    <div class="card_item">
    <img
      src="${img}"
      alt=""
      class="card_item-img"
    />
    <div class="card_item-bottom">
      <div class="card_item-text">
        <h3 class="card_item-title">${title}</h3>
        <p class="card_item-desc">${desc}</p>
        <p class="card_item-price">price: ${price}$</p>
      </div>
      <div class="card_item-buttons">
        <button class="card_btn-edit" id=${id}>edit</button>
      </div>
    </div>
  </div>`;
  });
}
document.addEventListener("click", async ({ target: { classList, id } }) => {
  if (classList.contains("card_btn-edit")) {
    const res = await fetch(`${API}/${id}`);
    const { title, desc, img, price, id: productId } = await res.json();
    modal.style.display = "block";
    productTitle.value = title;
    productDesc.value = desc;
    productImg.value = img;
    productPrice.value = price;
    btnEditProduct.setAttribute("id", productId);
  }
  render();
});
btnEditProduct.addEventListener("click", async ({ target: { id } }) => {
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
    modal.style.display = "none";
    render();
  } catch (error) {
    console.log(error);
  }
}
render();
