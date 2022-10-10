const lote = document.querySelector("#lote");
const brand = document.querySelector("#brand");
const model = document.querySelector("#model");
const quality = document.querySelector("#quality");
const quality2 = document.querySelector("#quality2");
const quantity = document.querySelector("#quantity");
const formLabels = document.querySelector("#formLabels");
const tableBody = document.querySelector("#tableBody");
const btnPrint = document.querySelector("#print");

const lotePrev = document.querySelector("#lotePrev");
const brandPrev = document.querySelector("#brandPrev");
const modelPrev = document.querySelector("#modelPrev");
const qualityPrev = document.querySelector("#qualityPrev");
const qualityPrev2 = document.querySelector("#qualityPrev2");
let labels = [];

lote.addEventListener("input", (e) => {
    lotePrev.innerHTML = lote.value;
});

brand.addEventListener("input", (e) => {
    brandPrev.innerHTML = brand.value;
});

model.addEventListener("input", (e) => {
    modelPrev.innerHTML = model.value;
});

quality.addEventListener("change", (e) => {
    qualityPrev.innerHTML = `
        <span style="color: ${
            quality.value === "WHITE" ? "GRAY" : quality.value
        }">
            ${quality.value} 
        </span>
    `;
});

quality2.addEventListener("change", (e) => {
    let color;
    switch (quality2.value) {
        case "OLED":
            color = "RED";
            break;
        case "IN-CELL":
            color = "GREEN";
            break;
        case "ORIGINAL":
            color = "BLACK";
            break;
        case "COG":
            color = "PURPLE";
            break;
        case "COF":
            color = "BLUE";
            break;
        default:
            break;
    }
    qualityPrev2.innerHTML = `<span style="color: ${color}">${quality2.value}</span>`;
});

const resetPreview = () => {
    lotePrev.innerHTML = "";
    brandPrev.innerHTML = "";
    modelPrev.innerHTML = "";
    qualityPrev.innerHTML = "";
    qualityPrev2.innerHTML = "";
};

formLabels.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = Date.now();
    labels.push({
        quantity: quantity.value,
        labelData: {
            id,
            lote: lote.value,
            brand: brand.value,
            model: model.value,
            quality1: quality.value,
            quality2: quality2.value,
            quantity: quantity.value,
        },
    });

    tableBody.innerHTML += `
        <tr>
            <td>${lote.value}</td>
            <td>${brand.value}</td>
            <td>${model.value}</td>
            <td>${quality.value} - ${quality2.value}</td>
            <td>${quantity.value}</td>
            <td>
                <button class="btn btn-danger d-block mx-auto" data-id="${id}">
                    X
                </button>
            </td>
        </tr>
    `;

    const btnDeletes = document.querySelectorAll(".btn-danger");

    btnDeletes.forEach((btn) => {
        btn.addEventListener("click", deleteLabel);
    });

    formLabels.reset();
    resetPreview();
});

const deleteLabel = (e) => {
    labels = labels.filter(
        (label) => label.labelData.id != e.target.getAttribute("data-id")
    );
    const childDelete = document.querySelector(
        `[data-id="${e.target.getAttribute("data-id")}"]`
    ).parentElement.parentElement;
    tableBody.removeChild(childDelete);
};

btnPrint.addEventListener("click", async () => {
    if (labels.length > 0) {
        try {
            btnPrint.disabled = true;
            const res = await fetch("/pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(labels),
            });
            const data = await res.json();
            if(data) {
                console.log(data);
                window.open(data.path, "__blank");   
            }
            labels = [];
            tableBody.innerHTML = "";
            btnPrint.disabled = false;
        } catch (error) {
            console.log(error);
        }
    }
});
