// Adds a new row of sample fields
async function addSample() {
  const sampleContainer = document.getElementById("samples");
  const index = sampleContainer.children.length;

  const row = document.createElement("div");
  row.className = "sample-row";

  // Build other inputs
  const sampleId = document.createElement("input");
  sampleId.name = "sample_id[]";
  sampleId.placeholder = "Sample ID";
  sampleId.required = true;

  const matrix = document.createElement("input");
  matrix.name = "chemical_matrix[]";
  matrix.placeholder = "Chemical Matrix";
  matrix.required = true;

  const processingTime = document.createElement("input");
  processingTime.name = "procesing_time[]";
  processingTime.placeholder = "Processing Time";
  processingTime.required = true;

  // Build analysis dropdown from JSON
  const analysisSelect = await createAnalysisDropdown(index);

  // Append inputs to row
  row.appendChild(sampleId);
  row.appendChild(matrix);
  row.appendChild(analysisSelect);
  row.appendChild(processingTime);

  // Add to form
  sampleContainer.appendChild(row);

  // Activate Select2 for this dropdown
  $(analysisSelect).select2({
    placeholder: "Select analyses",
    width: "100%",
    allowClear: true
  });
}

async function createAnalysisDropdown(index) {
  const select = document.createElement("select");
  select.name = `analysis[${index}][]`;
  select.className = "analysis-select";
  select.multiple = true;

  const res = await fetch("/static/data/analyses.json");
  const data = await res.json();

  data.forEach(group => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = group.group;

    group.options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt.id;
      option.textContent = opt.label;
      option.title = opt.description;
      optgroup.appendChild(option);
    });

    select.appendChild(optgroup);
  });

  return select;
}

// Handles form submission using Fetch API
document.getElementById("sampleForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = {};
  for (let [key, value] of form.entries()) {
    if (data[key]) {
      if (!Array.isArray(data[key])) data[key] = [data[key]];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }
  // Send data to Flask route
  const response = await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  alert(result.message || "Submitted successfully.");
});

document.addEventListener("DOMContentLoaded", function () {
  $('.analysis-select').select2({
    placeholder: "Select analyses",
    width: '100%',
    allowClear: true
  });
});

// Creates first sample row when the page is first loaded
document.addEventListener("DOMContentLoaded", function () {
  addSample();  // create the first sample row
});

// Listener for Tagify functionality
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.email-tag-input').forEach(input => {
    new Tagify(input, {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  // Basic email regex
      duplicates: false,
      dropdown: {
        enabled: 0 // disable suggestions
      }
    });
  });
});

const poInfo = document.getElementById("po-info");
const ccInfo = document.getElementById("cc-info");

document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
  radio.addEventListener("change", function () {
    if (this.value === "po") {
      poInfo.style.display = "block";
      ccInfo.style.display = "none";
      document.getElementById("po-number").required = true;
      document.getElementById("cc-number").required = false;
    } else {
      poInfo.style.display = "none";
      ccInfo.style.display = "block";
      document.getElementById("po-number").required = false;
      document.getElementById("cc-number").required = true;
    }
  });
});
