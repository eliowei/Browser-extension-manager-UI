// card 陣列是用來存放從 JSON 檔案讀取的擴充功能資料
const card = [];
// listFilterType 是用來控制列表過濾的變數，0 代表全部，1 代表啟用，2 代表停用
let listFilterType = 0;
// 列表過濾容器
const cardSection = document.querySelector(".extension__list");
// 風格按鈕
const themeButton = document.querySelector(".theme__button");
// 風格按鈕的圖片
const themeButtonImg = document.querySelector(".theme__button img");
// 風格模式切換
let darkMode = false;

// 列表過濾按鈕
const listFilterButton = document.querySelectorAll(".button__content button");
// 透過fetch 讀取到json檔，並放進指定的陣列
async function fetchExtensions() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    card.push(...data);
    renderExtensions();
  } catch (error) {
    console.log(error);
  }
}
// 渲染擴充功能列表
function renderExtensions() {
  // 清空列表
  cardSection.innerHTML = "";
  // 根據 listFilterType 過濾卡片
  const filterCard = card.filter((e) =>
    listFilterType == 1 ? e.isActive : listFilterType == 2 ? !e.isActive : e
  );
  // 根據過濾後的卡片數量來決定顯示的內容
  filterCard.forEach((e, index) => {
    const originalIndex = card.findIndex((item) => item === e);

    const cardHTML = `
      <div class="border-2 rounded-2xl flex flex-col p-4 card justify-between h-[200px] ${
        darkMode ? "dark-mode" : ""
      }" data-index="${originalIndex}"">
        <div class="flex">
          <img class="mr-4" src="${e.logo}" alt="${e.name}">
          <div class="flex flex-col">
            <p class="text-lg mb-2 font-bold card__title ${
              darkMode ? "dark-mode" : ""
            }">${e.name}</p>
            <p class="text-sm card__text font-bold ${
              darkMode ? "dark-mode" : ""
            }">${e.description}</p>
          </div>
        </div>
        <div class="flex justify-between card__action items-center">
          <button class="border rounded-full p-2 card__action--remove text-sm font-bold ${
            darkMode ? "dark-mode" : ""
          }">Remove</button>
          <label class="switch">
            <input type="checkbox" ${e.isActive ? "checked" : ""}>
            <span class="slider ${
              darkMode ? "dark-mode__button" : ""
            }" tabindex="0"></span>
          </label>
        </div>
      </div>
      `;
    // 將卡片 HTML 插入到列表中
    cardSection.insertAdjacentHTML("beforeend", cardHTML);
  });
}
// 讀取 JSON 檔案
// 並將資料渲染到列表中
fetchExtensions();

// 處理卡片的點擊事件
cardSection.addEventListener("click", (event) => {
  // 找到被點擊的元素在卡片陣列中的索引
  const cards = event.target.closest(".card");
  if (!cards) return;

  // 從 cards 元素取得 data-index 屬性
  const originalIndex = Number(cards.dataset.index);

  // 處理移除按鈕的點擊
  if (event.target.matches(".card__action--remove")) {
    card[originalIndex].isActive = false;
    // 只更新當前卡片的開關狀態
    cards.querySelector(".switch input").checked = false;

    // 只在過濾模式下重新渲染
    if (listFilterType !== 0) {
      renderExtensions();
    }
  }
  // 處理開關點擊
  if (event.target.matches(".switch input")) {
    card[originalIndex].isActive = !card[originalIndex].isActive;
    event.target.checked = card[originalIndex].isActive;
    // 只在過濾模式下重新渲染
    if (listFilterType !== 0) {
      renderExtensions();
    }
  }
});

// 處理列表過濾按鈕的點擊事件
listFilterButton.forEach((e, index) => {
  e.addEventListener("click", () => {
    listFilterButton[listFilterType].classList.remove("active");
    listFilterType = index;
    changelistFilter();
    renderExtensions();
  });
});
// 列表過濾按鈕切換後的狀態
function changelistFilter() {
  listFilterButton[listFilterType].classList.add("active");
}
changelistFilter();

// 處理風格切換按鈕的點擊事件
themeButton.addEventListener("click", () => {
  darkMode = !darkMode;

  if (darkMode) {
    themeButtonImg.src = "./assets/images/icon-sun.svg";
    document.body.style.background =
      "linear-gradient(180deg, #040918 0%, #091540 100%)";
    document
      .querySelectorAll(
        ".card, .card__title, .card__text, .card__action--remove, .button__content button"
      )
      .forEach((e) => e.classList.add("dark-mode"));
    document
      .querySelectorAll(".slider")
      .forEach((e) => e.classList.add("dark-mode__button"));
    document
      .querySelector(".action__content__text")
      .classList.add("dark-mode__text");
    document
      .querySelector(".header__content")
      .classList.add("dark-mode__header");
    themeButton.classList.add("dark-mode__theme__button");
  } else {
    themeButtonImg.src = "./assets/images/icon-moon.svg";
    document.body.style.background =
      "linear-gradient(180deg, #EBF2FC 0%, #EEF8F9 100%)";
    document
      .querySelectorAll(
        ".card, .card__title, .card__text, .card__action--remove, .button__content button"
      )
      .forEach((e) => e.classList.remove("dark-mode"));
    document
      .querySelectorAll(".slider")
      .forEach((e) => e.classList.remove("dark-mode__button"));
    document
      .querySelector(".action__content__text")
      .classList.remove("dark-mode__text");
    document
      .querySelector(".header__content")
      .classList.remove("dark-mode__header");
    themeButton.classList.remove("dark-mode__theme__button");
  }
});
