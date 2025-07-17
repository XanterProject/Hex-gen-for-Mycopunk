const hexGrid = document.getElementById("hexGrid");
const itemList = document.getElementById("itemList");
const logDiv = document.getElementById("log");

const COLS = 7;
const ROWS = 6;
let knownShapes = [];

// Создание DOM-гексагональной сетки
function createHexGrid() {
  const HEX_WIDTH = hexGrid.clientWidth / COLS;
  const HEX_HEIGHT = HEX_WIDTH; // квадратные пока
  const VERT_SPACING = HEX_HEIGHT * 0.75;

  for (let q = 0; q < COLS; q++) {
    for (let r = 0; r < ROWS; r++) {
      const cell = document.createElement("div");
      cell.className = "hex";
      cell.dataset.q = q;
      cell.dataset.r = r;

      const left = q * HEX_WIDTH;
      const top = r * VERT_SPACING + (q % 2 ? VERT_SPACING / 2 : 0);

      cell.style.position = "absolute";
      cell.style.width = `${HEX_WIDTH}px`;
      cell.style.height = `${HEX_HEIGHT}px`;
      cell.style.left = `${left}px`;
      cell.style.top = `${top}px`;

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
