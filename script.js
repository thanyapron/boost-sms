const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const button = item.querySelector(".faq-q");
  button?.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    faqItems.forEach((node) => node.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});
