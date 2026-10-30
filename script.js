
const form = document.getElementById("bmi-form");
const unitOptions = document.querySelectorAll('input[name="unit"]');

const metricFields = document.getElementById("metric-fields");
const imperialFields = document.getElementById("imperial-fields");

const resultWelcome = document.getElementById("result-welcome");
const resultContent = document.getElementById("result-content");
const formError = document.getElementById("form-error");

const bmiValue = document.getElementById("bmi-value");
const bmiCategory = document.getElementById("bmi-category");
const bmiMessage = document.getElementById("bmi-message");
const healthyRange = document.getElementById("healthy-range");

let currentUnit = "metric";

unitOptions.forEach((option) => {
  option.addEventListener("change", () => {
    currentUnit = option.value;

    metricFields.hidden = currentUnit !== "metric";
    imperialFields.hidden = currentUnit !== "imperial";

    formError.textContent = "";
    resultWelcome.hidden = false;
    resultContent.hidden = true;
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  formError.textContent = "";

  let height;
  let weight;

  if (currentUnit === "metric") {
    height = Number(document.getElementById("height-cm").value) / 100;
    weight = Number(document.getElementById("weight-kg").value);

    if (
      !Number.isFinite(height) ||
      !Number.isFinite(weight) ||
      height <= 0 ||
      weight <= 0
    ) {
      showError("Please enter a valid height and weight.");
      return;
    }
  } else {
    const feet = document.getElementById("height-ft").value;
    const inches = document.getElementById("height-in").value;
    const stones = document.getElementById("weight-st").value;
    const pounds = document.getElementById("weight-lb").value;

    if (
      feet === "" ||
      inches === "" ||
      stones === "" ||
      pounds === ""
    ) {
      showError("Please complete all four imperial fields.");
      return;
    }

    const totalInches = Number(feet) * 12 + Number(inches);
    const totalPounds = Number(stones) * 14 + Number(pounds);

    if (
      !Number.isFinite(totalInches) ||
      !Number.isFinite(totalPounds) ||
      totalInches <= 0 ||
      Number(inches) < 0 ||
      Number(inches) >= 12 ||
      Number(feet) < 0 ||
      Number(stones) < 0 ||
      Number(pounds) < 0 ||
      Number(pounds) >= 14 ||
      totalPounds <= 0
    ) {
      showError("Please enter valid height and weight values.");
      return;
    }

    height = totalInches * 0.0254;
    weight = totalPounds * 0.45359237;
  }

  const bmi = weight / (height * height);

  if (!Number.isFinite(bmi) || bmi <= 0) {
    showError("Please check your measurements and try again.");
    return;
  }

  displayResult(bmi, height);
});

function showError(message) {
  formError.textContent = message;
}

function displayResult(bmi, height) {
  resultWelcome.hidden = true;
  resultContent.hidden = false;

  bmiValue.textContent = bmi.toFixed(1);

  // Adult categories are shown only as general reference.
  // They are not appropriate for interpreting a teenager's BMI.
  let category;
  let message;

  if (bmi < 18.5) {
    category = "Below the adult reference range";
    message = "BMI alone cannot determine your nutritional needs.";
  } else if (bmi < 25) {
    category = "Within the adult reference range";
    message = "BMI is only one part of understanding health.";
  } else if (bmi < 30) {
    category = "Above the adult reference range";
    message = "Consider discussing your result with a healthcare professional.";
  } else {
    category = "Well above the adult reference range";
    message = "A healthcare professional can help interpret this result.";
  }

  bmiCategory.textContent = category;
  bmiMessage.textContent = message;

  // Adult reference range only, not a target for teenagers.
  const lowerWeight = 18.5 * height * height;
  const upperWeight = 24.9 * height * height;

  if (currentUnit === "metric") {
    healthyRange.textContent =
      `For adults, the usual reference range at this height is approximately ` +
      `${lowerWeight.toFixed(1)}–${upperWeight.toFixed(1)} kg.`;
  } else {
    const lowerPounds = lowerWeight / 0.45359237;
    const upperPounds = upperWeight / 0.45359237;

    healthyRange.textContent =
      `For adults, the usual reference range at this height is approximately ` +
      `${lowerPounds.toFixed(1)}–${upperPounds.toFixed(1)} lb.`;
  }
}