(() => {
  const form = document.querySelector("[data-order-form]");
  if (!form) return;

  const makeSelect = form.querySelector("#car-make");
  const modelSelect = form.querySelector("#car-model");
  const requiredPartSelect = form.querySelector("#required-part");
  const submitBtn = form.querySelector('button[type="submit"]');
  const popup = document.querySelector("[data-success-popup]");
  const closePopupBtn = document.querySelector("[data-popup-close]");
  const partFromQuery = new URLSearchParams(window.location.search).get("part");

  const modelsByMake = {
    Toyota: ["Corolla", "Camry", "Hilux", "Fortuner", "RAV4"],
    Honda: ["Civic", "Accord", "CR-V", "City", "Jazz"],
    BMW: ["3 Series", "5 Series", "X1", "X3", "X5"],
    Mercedes: ["C-Class", "E-Class", "GLA", "GLE", "S-Class"],
    Nissan: ["Sunny", "Altima", "Patrol", "X-Trail", "Navara"],
    Hyundai: ["i20", "Elantra", "Tucson", "Creta", "Sonata"],
    Ford: ["Figo", "Focus", "Ranger", "Mustang", "Explorer"],
    Audi: ["A3", "A4", "A6", "Q5", "Q7"]
  };

  if (partFromQuery && requiredPartSelect) {
    const match = Array.from(requiredPartSelect.options).find((option) =>
      option.textContent.toLowerCase().includes(partFromQuery.toLowerCase())
    );
    if (match) {
      requiredPartSelect.value = match.value;
    }
  }

  if (makeSelect && modelSelect) {
    makeSelect.addEventListener("change", () => {
      const selectedMake = makeSelect.value;
      const models = modelsByMake[selectedMake] || [];
      modelSelect.innerHTML = '<option value="">Select Model</option>';
      models.forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const errors = validate(data);

    if (Object.keys(errors).length) {
      showErrors(form, errors);
      return;
    }

    submitBtn.classList.add("btn-loading");
    submitBtn.disabled = true;

    setTimeout(() => {
      const email = "sales@premiumautoparts.com";
      const subject = encodeURIComponent(`Auto Part Inquiry - ${data["required-part"]}`);
      const body = encodeURIComponent(
        [
          "New order request details:",
          "",
          `Full Name: ${data["full-name"]}`,
          `Mobile: ${data.mobile}`,
          `Email: ${data.email}`,
          `Car Make: ${data["car-make"]}`,
          `Car Model: ${data["car-model"]}`,
          `Engine Size: ${data["engine-size"]}`,
          `Year: ${data.year}`,
          `Required Part: ${data["required-part"]}`,
          "",
          "Message:",
          `${data.message || "N/A"}`
        ].join("\n")
      );

      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      form.reset();
      modelSelect.innerHTML = '<option value="">Select Model</option>';
      popup?.classList.add("open");
      submitBtn.classList.remove("btn-loading");
      submitBtn.disabled = false;
    }, 1400);
  });

  closePopupBtn?.addEventListener("click", () => {
    popup?.classList.remove("open");
  });

  popup?.addEventListener("click", (event) => {
    if (event.target === popup) popup.classList.remove("open");
  });

  function validate(data) {
    const errors = {};

    if (!data["full-name"] || data["full-name"].trim().length < 3) {
      errors["full-name"] = "Please enter a valid full name.";
    }

    if (!/^\+?[0-9\s-]{8,15}$/.test(data.mobile || "")) {
      errors.mobile = "Please enter a valid mobile number.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) {
      errors.email = "Please enter a valid email address.";
    }

    if (!data["car-make"]) errors["car-make"] = "Please select a car make.";
    if (!data["car-model"]) errors["car-model"] = "Please select a car model.";
    if (!data["engine-size"]) errors["engine-size"] = "Please enter engine size.";
    if (!data.year) errors.year = "Please select manufacturing year.";
    if (!data["required-part"]) errors["required-part"] = "Please select a required part.";

    return errors;
  }

  function showErrors(formNode, errors) {
    Object.entries(errors).forEach(([name, message]) => {
      const field = formNode.querySelector(`[name="${name}"]`);
      if (!field) return;
      const errorNode = field.closest(".form-group")?.querySelector(".error-text");
      if (errorNode) errorNode.textContent = message;
      field.style.borderColor = "rgba(255, 123, 95, 0.95)";
    });
  }

  function clearErrors(formNode) {
    formNode.querySelectorAll(".error-text").forEach((node) => {
      node.textContent = "";
    });
    formNode.querySelectorAll("input, select, textarea").forEach((field) => {
      field.style.borderColor = "";
    });
  }
})();
