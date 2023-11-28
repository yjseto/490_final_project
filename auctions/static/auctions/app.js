const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const searchQuery = searchInput.value;
  const apiUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
    searchQuery
  )}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    displayResults(data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

function displayResults(animeResults) {
  resultsContainer.innerHTML = "";

  animeResults.forEach((anime) => {
    const animeCard = createAnimeCard(anime);
    resultsContainer.appendChild(animeCard);
  });
}

function createAnimeCard(anime) {
  const card = document.createElement("div");
  card.classList.add("anime-card");

  const link = document.createElement("a");
  link.href = anime.url;
  link.target = "_blank";

  const image = document.createElement("img");
  image.src = anime.images.jpg.image_url;
  image.alt = `${anime.title} Poster`;

  const title = document.createElement("h3");
  title.textContent = anime.title;

  link.appendChild(image);
  card.appendChild(link);
  card.appendChild(title);

  return card;
}
