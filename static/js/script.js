// Adds a new row of sample fields
function addSample() {
  const sampleContainer = document.getElementById("samples");

  const index = sampleContainer.children.length;
  const row = document.createElement("div");
  row.className = "sample-row";

  row.innerHTML = `
    <input name="sample_id[]" placeholder="Sample ID" required>
    <input name="chemical_matrix[]" placeholder="Chemical Matrix" required>
    <select name="analysis[${index}][]" class="analysis-select" multiple>
      <optgroup label="Anion Panels">
        <option value="5_anions" title="F-, Cl-, NO3-, SO4--, PO4---">5 Anions</option>
        <option value="organic_anions" title="Gluconate, Propionate, Butanate">Organic Anions</option>
      </optgroup>
      <optgroup label="Metals">
        <option value="36_elements" title="Al, As, Ba, Cd...">36 Elements</option>
        <option value="heavy_metals" title="Pb, Hg, Cr...">Heavy Metals</option>
      </optgroup>
    </select>
    <input name="procesing_time[]" placeholder="Processing Time" required>
  `;

  sampleContainer.appendChild(row);

  // Apply Select2 to the new analysis field
  $(row).find('.analysis-select').select2({
    placeholder: "Select analyses",
    width: '100%',
    allowClear: true
  });
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

