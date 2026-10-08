let JSON_FILE = "restaurants.json";
let IMAGE_FOLDER = "images/";

let allRestaurants = [];

async function loadRestaurants() {
  let response = await fetch(JSON_FILE);
  allRestaurants = await response.json();
  showAll();
}

loadRestaurants();

function showAll() {
  closeMenus();
  document.getElementById("filter-title").textContent = "All Restaurants";
  showRestaurants(allRestaurants);
}

function filterBy(field, value, title) {
  closeMenus();
  document.getElementById("filter-title").textContent = title;

  let matches = [];

  for (let i = 0; i < allRestaurants.length; i++) {
    let restaurant = allRestaurants[i];
    let text = restaurant[field];

    if (field === "Events" && value === "any") {
      if (text !== "none") {
        matches.push(restaurant);
      }
    } else if (field === "Cuisine" || field === "Events") {
      if (text.includes(value)) {
        matches.push(restaurant);
      }
    } else {
      if (text === value) {
        matches.push(restaurant);
      }
    }
  }

  showRestaurants(matches);
}

function toggleMenu(menuId) {
  let menu = document.getElementById(menuId);
  let wasOpen = menu.classList.contains("open");

  closeMenus();

  if (wasOpen === false) {
    menu.classList.add("open");
  }
}

function closeMenus() {
  let menus = document.querySelectorAll(".menu");
  for (let i = 0; i < menus.length; i++) {
    menus[i].classList.remove("open");
  }
}

document.onclick = function (event) {
  if (event.target.classList.contains("nav-button") === false) {
    closeMenus();
  }
};

function showRestaurants(list) {
  document.getElementById("count").textContent =
    "Showing " + list.length + " of " + allRestaurants.length + " restaurants";

  let allCards = "";
  for (let i = 0; i < list.length; i++) {
    allCards = allCards + makeCard(list[i]);
  }

  document.getElementById("restaurant-list").innerHTML = allCards;
}

function makeCard(restaurant) {
  let name = restaurant["Restaurant"];
  let photo = IMAGE_FOLDER + getPhotoName(name);

  let card =
    '<div class="card">' +
      '<div class="photo">' +
        '<img src="' + photo + '" alt="' + name + '">' +
      '</div>' +
      '<div class="details">' +
        '<p>' + restaurant["Location"] + '</p>' +
        '<p>' + restaurant["Price"] + '</p>' +
        '<p>' + restaurant["Cuisine"] + '</p>' +
        '<p><strong>Reservations:</strong> ' + restaurant["Reservation Status"] + '</p>' +
        '<p><strong>Events:</strong> ' + restaurant["Events"] + '</p>' +
        '<a href="' + restaurant["Link"] + '" target="_blank">Book</a>' +
      '</div>' +
      '<div class="card-name"><h2>' + name + '</h2></div>' +
    '</div>';

  return card;
}

function getPhotoName(name) {
  let cleanName = name.replace(/[^a-zA-Z0-9]/g, "");
  return cleanName + "pic.png";
}