const hexGrid = document.getElementById("hexGrid");
const itemList = document.getElementById("itemList");
const logDiv = document.getElementById("log");

const COLS = 7;
const ROWS = 6;
let knownShapes = [];

// Создание DOM-гексагональной сетки
function createHexGrid() {
  for (let r = 0; r < ROWS; r++) {
    for (let q = 0; q < COLS; q++) {
      const cell = document.createElement("div");
      cell.className = "hex";
      cell.dataset.q = q;
      cell.dataset.r = r;

      // смещение по чётности
      cell.style.transform = `translateY(${(q % 2 === 0 ? 0 : 30)}px)`;
      hexGrid.appendChild(cell);
    }
  }
}

// Загрузка фигур с сервера
async function loadShapes() {
  try {
    const res = await fetch("ShapeStore.json");
    knownShapes = await res.json();
    renderItemList(knownShapes);
    log("Загружено фигур: " + knownShapes.length);
  } catch (e) {
    log("Ошибка загрузки JSON: " + e.message);
    console.error(e);
  }
}

// Отображение списка фигур
function renderItemList(shapes) {
  itemList.innerHTML = "";
  shapes.forEach((shape, index) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `<strong>${shape.name}</strong><br><small>${shape.category}</small>`;
    
    const preview = document.createElement("div");
    preview.className = "preview";
    preview.innerHTML = `
      <strong>${shape.name}</strong><br>
      <em>${shape.category}</em><br>
      <ul>
        ${shape.effects.map(e => `<li>${e}</li>`).join("")}
      </ul>
      <ul>
        ${Object.entries(shape.stats || {}).map(([key, val]) => `<li>${key}: ${val}</li>`).join("")}
      </ul>
    `;
    item.appendChild(preview);

    item.addEventListener("mouseenter", () => preview.style.display = "block");
    item.addEventListener("mouseleave", () => preview.style.display = "none");

    itemList.appendChild(item);
  });
}

// Лог
function log(text) {
  logDiv.textContent += "<br>" + text;
}

// Инициализация
createHexGrid();
loadShapes();
