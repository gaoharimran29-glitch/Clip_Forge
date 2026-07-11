const button = document.getElementById("test-btn");
const status = document.getElementById("status");

button.addEventListener("click", () => {
    status.textContent = "✅ Extension is working!";
});