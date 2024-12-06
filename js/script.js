// Global variables
const recommendationsContainer = document.querySelector('.recommendations'); // Container for recommendations
const searchInput = document.getElementById('search-bar'); // Search input field
const searchButton = document.querySelector('button[onclick="searchDestinations()"]'); // Search button
const clearButton = document.querySelector('button[onclick="clearSearch()"]'); // Clear button

let allRecommendations = {
  countries: [],
  temples: [],
  beaches: []
};

// Fetch recommendations data from the JSON file
function fetchRecommendations() {
  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      allRecommendations = data; // Store the entire JSON data
      displayRecommendations(allRecommendations); // Display all recommendations initially
    })
    .catch(error => console.error('Error fetching recommendations:', error));
}

// Display recommendations in the UI
function displayRecommendations(recommendations) {
  recommendationsContainer.innerHTML = ''; // Clear the container before appending new content

  // Create a function to display recommendations based on category
  function displayCategory(category) {
    recommendations[category].forEach(rec => {
      const recommendationDiv = document.createElement('div');
      recommendationDiv.classList.add('destination');

      let description = rec.description;
      let imageUrl = rec.imageUrl;

      // For cities in countries
      if (category === 'countries') {
        rec.cities.forEach(city => {
          const cityDiv = document.createElement('div');
          cityDiv.innerHTML = `
            <h3>${city.name}</h3>
            <img src="${city.imageUrl}" alt="${city.name}">
            <p>${city.description}</p>
          `;
          recommendationsContainer.appendChild(cityDiv);
        });
      } else {
        recommendationDiv.innerHTML = `
          <h3>${rec.name}</h3>
          <img src="${imageUrl}" alt="${rec.name}">
          <p>${description}</p>
        `;
        recommendationsContainer.appendChild(recommendationDiv);
      }
    });
  }

  // Display all categories (beaches, temples, countries)
  displayCategory('beaches');
  displayCategory('temples');
  displayCategory('countries');
}

// Search for recommendations based on the user input
function searchDestinations() {
  const searchKeyword = searchInput.value.toLowerCase().trim(); // Convert to lowercase and remove extra spaces

  // Filter recommendations by matching category names or description to the search input
  const filteredRecommendations = {
    beaches: filterCategory('beaches', searchKeyword),
    temples: filterCategory('temples', searchKeyword),
    countries: filterCategory('countries', searchKeyword),
  };

  // Display filtered results
  displayRecommendations(filteredRecommendations);
}

// Function to filter recommendations by category (beaches, temples, countries)
function filterCategory(category, searchKeyword) {
  if (category === 'countries') {
    return allRecommendations[category].map(country => {
      return {
        ...country,
        cities: country.cities.filter(city => city.name.toLowerCase().includes(searchKeyword) || city.description.toLowerCase().includes(searchKeyword))
      };
    }).filter(country => country.cities.length > 0);
  } else {
    return allRecommendations[category].filter(item => {
      return item.name.toLowerCase().includes(searchKeyword) || item.description.toLowerCase().includes(searchKeyword);
    });
  }
}

// Clear the search and show all recommendations again
function clearSearch() {
  searchInput.value = ''; // Clear the input field
  displayRecommendations(allRecommendations); // Show all recommendations again
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchRecommendations);

// Event listeners for search and clear buttons
searchButton.addEventListener('click', searchDestinations);
clearButton.addEventListener('click', clearSearch);
