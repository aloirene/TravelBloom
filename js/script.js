// Fetch data from the JSON file
const recommendationsContainer = document.querySelector('.recommendations'); // Your container for recommendations
const searchInput = document.getElementById('search-bar'); // Search input field
const searchButton = document.querySelector('button[onclick="searchDestinations()"]'); // Search button
const clearButton = document.querySelector('button[onclick="clearSearch()"]'); // Clear button

let allRecommendations = [];

// Fetch the data from the JSON file
function fetchRecommendations() {
  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      allRecommendations = data; // Store the fetched data globally
      displayRecommendations(allRecommendations); // Display all recommendations initially
    })
    .catch(error => console.error('Error fetching recommendations:', error));
}

// Display recommendations in the UI
function displayRecommendations(recommendations) {
  recommendationsContainer.innerHTML = ''; // Clear the container before appending new data
  recommendations.forEach(rec => {
    const recommendationDiv = document.createElement('div');
    recommendationDiv.classList.add('destination');

    recommendationDiv.innerHTML = `
      <h3>${rec.name}</h3>
      <img src="${rec.imageUrl}" alt="${rec.name}">
      <p>${rec.description}</p>
    `;

    recommendationsContainer.appendChild(recommendationDiv);
  });
}

// Function to handle search
function searchDestinations() {
  const searchKeyword = searchInput.value.toLowerCase().trim(); // Convert input to lowercase

  // Filter recommendations based on the search input
  const filteredRecommendations = allRecommendations.filter(rec => {
    return rec.category.toLowerCase().includes(searchKeyword);
  });

  displayRecommendations(filteredRecommendations); // Display filtered recommendations
}

// Function to clear search and show all recommendations
function clearSearch() {
  searchInput.value = ''; // Clear the search input field
  displayRecommendations(allRecommendations); // Show all recommendations again
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchRecommendations);

// Event listeners for search and clear buttons
searchButton.addEventListener('click', searchDestinations);
clearButton.addEventListener('click', clearSearch);
