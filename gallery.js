// gallery.js
document.addEventListener("DOMContentLoaded", function () {
    fetch("/crafts")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            const galleryContainer = document.getElementById("gallery");
            galleryContainer.innerHTML = ""; // Clear existing content

            if (data.length === 0) {
                galleryContainer.innerHTML = "<p>No crafts available.</p>";
                return;
            }

            data.forEach((craft) => {
                const craftElement = document.createElement("div");
                craftElement.classList.add("craft-item");
                craftElement.innerHTML = `
                    <h3>${craft.title}</h3>
                    <img src="${craft.image}" alt="${craft.title}" />
                    <p>${craft.description}</p>
                `;
                galleryContainer.appendChild(craftElement);
            });
        })
        .catch((error) => {
            console.error("Error fetching crafts:", error);
            const galleryContainer = document.getElementById("gallery");
            galleryContainer.innerHTML = "<p>Error fetching crafts. Please try again later.</p>";
        });
});
