const form = document.getElementById("stockForm");
const result = document.getElementById("result");
const confirmBox = document.getElementById("confirmBox");
let deleteTarget = null;

const stockData = {};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const item = document.getElementById("itemName").value.trim();
  const qty = parseInt(document.getElementById("quantity").value);
  const rate = parseFloat(document.getElementById("rate").value);
  const area = document.getElementById("area").value;
  const date = new Date().toISOString().split("T")[0];

  if (!stockData[area]) stockData[area] = {};
  if (!stockData[area][date]) stockData[area][date] = {};
  
  if (!stockData[area][date][item]) {
    stockData[area][date][item] = { qty: 0, rate };
  }

  stockData[area][date][item].qty += qty;
  stockData[area][date][item].rate = rate;

  form.reset();
  renderResults();
});

function renderResults() {
  const nameFilter = document.getElementById("filterName").value.toLowerCase();
  const dateFilter = document.getElementById("filterDate").value;
  result.innerHTML = "";

  Object.keys(stockData).forEach(area => {
    const areaDiv = document.createElement("div");
    areaDiv.className = "area-block";
    const areaHeader = document.createElement("h3");
    areaHeader.textContent = area;
    areaDiv.appendChild(areaHeader);

    Object.keys(stockData[area]).forEach(date => {
      if (dateFilter && date !== dateFilter) return;

      Object.keys(stockData[area][date]).forEach(item => {
        if (nameFilter && !item.toLowerCase().includes(nameFilter)) return;

        const { qty, rate } = stockData[area][date][item];
        const price = qty * rate;

        const entryDiv = document.createElement("div");
        entryDiv.className = "entry";
        entryDiv.innerHTML = `
          <div><strong>${item}</strong></div>
          <div>${qty} pcs × ${rate}</div>
          <div><strong>${price} Rs</strong></div>
          <div>${date}</div>
          <button class="delete-btn" data-area="${area}" data-date="${date}" data-item="${item}">Delete</button>
        `;
        areaDiv.appendChild(entryDiv);
      });
    });

    result.appendChild(areaDiv);
  });

  attachDeleteEvents();
}

function attachDeleteEvents() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = () => {
      deleteTarget = {
        area: btn.getAttribute("data-area"),
        date: btn.getAttribute("data-date"),
        item: btn.getAttribute("data-item")
      };
      confirmBox.style.display = "block";
    };
  });

  document.getElementById("yesDelete").onclick = () => {
    if (deleteTarget) {
      delete stockData[deleteTarget.area][deleteTarget.date][deleteTarget.item];
      if (Object.keys(stockData[deleteTarget.area][deleteTarget.date]).length === 0) {
        delete stockData[deleteTarget.area][deleteTarget.date];
      }
      confirmBox.style.display = "none";
      renderResults();
    }
  };

  document.getElementById("noDelete").onclick = () => {
    confirmBox.style.display = "none";
    deleteTarget = null;
  };
}

document.getElementById("filterName").addEventListener("input", renderResults);
document.getElementById("filterDate").addEventListener("input", renderResults);
