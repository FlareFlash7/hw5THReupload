/* Utility: get unique values for a field*/
function getUniqueValues(data, key) {
    return [...new Set(data.map((item) => item[key]))].sort(); 
}

/* Render checkbox options for makes and colors*/
function renderFilterOptions() {
    const makeContainer = document.getElementById("make-options");
    const colorContainer = document.getElementById("color-options");

    const makes = getUniqueValues(usedCars, "make");
    const colors = getUniqueValues(usedCars, "color");

    makes.forEach((make) => {
        const id = `make-${make.toLowerCase().replace(/\s+/g, "-")}`;
        const wrapper = document.createElement("div");
        wrapper.className = "checkbox-item";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = id;
        input.name = "make";
        input.value = make;

        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = make;

        wrapper.appendChild(input);
        wrapper.appendChild(label);
        makeContainer.appendChild(wrapper);
    });

    colors.forEach((color) => {
        const id = `color-${color.toLowerCase().replace(/\s+/g, "-")}`;
        const wrapper = document.createElement("div");
        wrapper.className = "checkbox-item";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = id;
        input.name = "color";
        input.value = color;

        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = color;

        wrapper.appendChild(input);
        wrapper.appendChild(label);
        colorContainer.appendChild(wrapper);
    });
}

/* Render car cards*/
function renderCars(cars) {
    const list = document.getElementById("car-list");
    const message = document.getElementById("results-message");
    list.innerHTML = "";

    if (cars.length === 0) {
        message.textContent =
            "No cars match your filter criteria. Please adjust your filters and try again.";
        return;
    }

    message.textContent = `Showing ${cars.length} car(s).`;

    cars.forEach((car) => {
        const card = document.createElement("article");
        card.className = "car-card";

        card.innerHTML = `
      <header class="car-card__header">
        <h3>${car.year} ${car.make} ${car.model}</h3>
        <p class="car-card__price">$${car.price.toLocaleString()}</p>
      </header>
      <div class="car-card__body">
        <p><strong>Mileage:</strong> ${car.mileage.toLocaleString()} miles</p>
        <p><strong>Color:</strong> ${car.color}</p>
        <p><strong>Fuel economy:</strong> ${car.gasMileage}</p>
      </div>
    `;

        list.appendChild(card);
    });
}

/* Apply filters based on form values*/
function applyFilters(event) {
    if (event) event.preventDefault();

    const minYear = parseInt(document.getElementById("min-year").value, 10);
    const maxYear = parseInt(document.getElementById("max-year").value, 10);
    const maxMileage = parseInt(
        document.getElementById("max-mileage").value,
        10
    );
    const minPrice = parseInt(document.getElementById("min-price").value, 10);
    const maxPrice = parseInt(document.getElementById("max-price").value, 10);

    const selectedMakes = Array.from(
        document.querySelectorAll('input[name="make"]:checked')
    ).map((el) => el.value);

    const selectedColors = Array.from(
        document.querySelectorAll('input[name="color"]:checked')
    ).map((el) => el.value);

    const filtered = usedCars.filter((car) => {
        if (!Number.isNaN(minYear) && car.year < minYear) return false;
        if (!Number.isNaN(maxYear) && car.year > maxYear) return false;
        if (!Number.isNaN(maxMileage) && car.mileage > maxMileage) return false;
        if (!Number.isNaN(minPrice) && car.price < minPrice) return false;
        if (!Number.isNaN(maxPrice) && car.price > maxPrice) return false;

        if (selectedMakes.length > 0 && !selectedMakes.includes(car.make)) {
            return false;
        }

        if (selectedColors.length > 0 && !selectedColors.includes(car.color)) {
            return false;
        }

        return true;
    });

    renderCars(filtered);
}

/* Clear filters and show all cars*/
function clearFilters() {
    document.getElementById("filter-form").reset();
    document
        .querySelectorAll('input[name="make"], input[name="color"]')
        .forEach((el) => (el.checked = false));
    renderCars(usedCars);
}

/* Init*/
document.addEventListener("DOMContentLoaded", () => {
    renderFilterOptions();
    renderCars(usedCars);

    document
        .getElementById("filter-form")
        .addEventListener("submit", applyFilters);

    document
        .getElementById("clear-filters")
        .addEventListener("click", clearFilters);
});
