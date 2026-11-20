"use strict";

// Shared by product pages using the same data attributes and form IDs.
(() => {
  const product = document.querySelector(".product-section");
  const form = document.getElementById("order-form");
  if (!product || !form) return;
  const button = form.querySelector("#order-btn");
  const quantity = form.querySelector("#quantity");
  const feedback = form.querySelector("#order-feedback");
  const fallback = form.querySelector("#order-fallback");
  const draft = form.querySelector("#order-draft");
  const subjectOutput = form.querySelector("#order-subject");
  const recipient = "orders@examplewebsite142.com";
  const name = product.dataset.productName;
  const price = Number(product.dataset.productPrice);
  if (!button || !quantity || !feedback || !fallback || !draft || !subjectOutput) return;
  if (!name || !Number.isFinite(price) || price <= 0) {
    feedback.textContent = "Product information is unavailable. Please contact the store.";
    return;
  }
  const money = value => new Intl.NumberFormat("en-PH", {
    style: "currency", currency: "PHP"
  }).format(value);
  button.disabled = false;
  quantity.addEventListener("input", () => quantity.setCustomValidity(""));
  form.addEventListener("input", () => {
    feedback.textContent = "";
    fallback.hidden = true;
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const size = form.querySelector('input[name="size"]:checked');
    const count = quantity.valueAsNumber;
    quantity.setCustomValidity(Number.isInteger(count) && count >= 1 && count <= 99
      ? "" : "Enter a whole-number quantity from 1 to 99.");
    if (!form.reportValidity()) return;
    if (!size || !["S", "M", "L", "XL"].includes(size.value)) {
      feedback.textContent = "Please select an available size.";
      form.querySelector('input[name="size"]').focus();
      return;
    }
    const subject = `Order request: ${name}`;
    const body = [
      "Hello GUNI,", "", "I would like to inquire about the following order:",
      `Product: ${name}`, `Size: ${size.value}`, `Quantity: ${count}`,
      `Unit price: ${money(price)}`, `Merchandise subtotal: ${money(price * count)}`,
      "", "Please confirm availability, shipping charges, and order arrangements.",
      "This is an order request, not a confirmed purchase."
    ].join("\r\n");
    subjectOutput.textContent = subject;
    draft.value = body;
    fallback.hidden = false;
    feedback.textContent = "An email draft has been requested. Review and send it in your email app. If nothing opens, use the manual sending instructions below. No order has been sent by this page.";
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
