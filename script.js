// ---------- Settings you might change ----------
const JSON_FILE = "restaurants.json"; // name of your JSON file (must be in the same folder)
const IMAGE_FOLDER = "images/";       // folder where the photos go

// ---------- Variables ----------
let allRestaurants = [];

// ---------- Load the data ----------
fetch(JSON_FILE)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    allRestaurants = data;
    makeButtons();
    showRestaurants(allRestaurants);
  })
  .catch(function (error) {
    document.getElementById("count").textContent =
      "Could not load " + JSON_FILE + ". Check the file name and that it is in the same folder as index.html.";
    console.log(error);
  });

// ---------- Photo names ----------
// "Baddie's Burgers" becomes "BaddiesBurgerspic.png" (spaces and symbols are removed)
function getPhotoName(restaurant) {
  let name = restaurant["Restaurant"].replace(/[^a-zA-Z0-9]/g, "");
  return name + "pic.png";
}

// ---------- The filter buttons ----------
// Each button has a group, a label, and a test.
// The test says whether a restaurant should be shown when that button is clicked.
const filters = [
  { group: "Location", label: "Five Points",               test: function (r) { return r["Location"] === "5 points"; } },
  { group: "Location", label: "Downtown",                  test: function (r) { return r["Location"] === "downtown"; } },
  { group: "Location", label: "Under 10 mins from campus", test: function (r) { return r["Location"] === "<10 mins from campus"; } },
  { group: "Location", label: "Over 10 mins from campus",  test: function (r) { return r["Location"] === ">10 mins from campus"; } },

  { group: "Price", label: "$",   test: function (r) { return r["Price"] === "$"; } },
  { group: "Price", label: "$$",  test: function (r) { return r["Price"] === "$$"; } },
  { group: "Price", label: "$$$", test: function (r) { return r["Price"] === "$$$"; } },

  { group: "Reservations", label: "Takes reservations",      test: function (r) { return r["Reservation Status"] === "yes"; } },
  { group: "Reservations", label: "No reservations",         test: function (r) { return r["Reservation Status"] === "no"; } },
  { group: "Reservations", label: "Reservations not needed", test: function (r) { return r["Reservation Status"] === "not necessary"; } },

  { group: "Events", label: "Any event",       test: function (r) { return r["Events"] !== "none"; } },
  { group: "Events", label: "Live music",      test: function (r) { return r["Events"].includes("live music"); } },
  { group: "Events", label: "Trivia",          test: function (r) { return r["Events"].includes("trivia"); } },
  { group: "Events", label: "Karaoke",         test: function (r) { return r["Events"].includes("karaoke"); } },
  { group: "Events", label: "Bingo",           test: function (r) { return r["Events"].includes("bingo"); } },
  { group: "Events", label: "All you can eat", test: function (r) { return r["Events"].includes("all you can eat"); } }
];

function makeButtons() {
  const nav = document.getElementById("filters");

  // "Show all" button at the left of the nav bar
  const allButton = document.createElement("button");
  allButton.textContent = "Show all";
  allButton.className = "nav-button active";
  allButton.addEventListener("click", function () {
    clearActive();
    allButton.classList.add("active");
    closeMenus();
    showRestaurants(allRestaurants);
  });
  nav.appendChild(allButton);

  // One dropdown for each group (Location, Price, ...)
  let currentGroup = "";
  let currentMenu = null;
  let currentToggle = null;

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];

    // start a new dropdown when the group changes
    if (filter.group !== currentGroup) {
      currentGroup = filter.group;

      const dropdown = document.createElement("div");
      dropdown.className = "dropdown";

      const toggle = document.createElement("button");
      toggle.textContent = filter.group + " \u25BE";
      toggle.className = "nav-button";

      const menu = document.createElement("div");
      menu.className = "menu";

      // clicking the group name opens or closes its menu
      toggle.addEventListener("click", function (event) {
        const wasOpen = menu.classList.contains("open");
        closeMenus();
        if (!wasOpen) {
          menu.classList.add("open");
        }
        event.stopPropagation();
      });

      dropdown.appendChild(toggle);
      dropdown.appendChild(menu);
      nav.appendChild(dropdown);

      currentMenu = menu;
      currentToggle = toggle;
    }

    // the option buttons inside the menu
    const myToggle = currentToggle;
    const option = document.createElement("button");
    option.textContent = filter.label;
    option.className = "menu-option";
    option.addEventListener("click", function () {
      clearActive();
      option.classList.add("active");
      myToggle.classList.add("active");
      closeMenus();
      const matches = allRestaurants.filter(filter.test);
      showRestaurants(matches);
    });
    currentMenu.appendChild(option);
  }

  // clicking anywhere else on the page closes any open menu
  document.addEventListener("click", closeMenus);
}

// Removes the highlight from every button
function clearActive() {
  const buttons = document.querySelectorAll(".nav-button, .menu-option");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
}

// Closes all the dropdown menus
function closeMenus() {
  const menus = document.querySelectorAll(".menu");
  for (let i = 0; i < menus.length; i++) {
    menus[i].classList.remove("open");
  }
}

// ---------- Showing the restaurant cards ----------
function showRestaurants(list) {
  const listArea = document.getElementById("restaurant-list");
  listArea.innerHTML = ""; // clear out the old cards

  document.getElementById("count").textContent =
    "Showing " + list.length + " of " + allRestaurants.length + " restaurants";

  for (let i = 0; i < list.length; i++) {
    listArea.appendChild(makeCard(list[i]));
  }
}

function makeCard(restaurant) {
  const card = document.createElement("div");
  card.className = "card";

  // Photo area
  const photoBox = document.createElement("div");
  photoBox.className = "photo";

  const photoName = getPhotoName(restaurant);
  const img = document.createElement("img");
  img.src = IMAGE_FOLDER + photoName;
  img.alt = restaurant["Restaurant"];

  // If the photo file doesn't exist yet, show a gray placeholder instead
  img.onerror = function () {
    photoBox.innerHTML =
      '<div class="placeholder">Photo coming soon<small>' + IMAGE_FOLDER + photoName + "</small></div>";
  };
  photoBox.appendChild(img);

  // Text info (shown exactly as it is written in the JSON)
  const info = document.createElement("div");
  info.className = "card-info";
  info.innerHTML =
    "<h2>" + restaurant["Restaurant"] + "</h2>" +
    "<p><strong>Location:</strong> " + restaurant["Location"] + "</p>" +
    "<p><strong>Price:</strong> " + restaurant["Price"] + "</p>" +
    "<p><strong>Reservations:</strong> " + restaurant["Reservation Status"] + "</p>" +
    "<p><strong>Events:</strong> " + restaurant["Events"] + "</p>" +
    '<a href="' + restaurant["Link"] + '" target="_blank">Visit website</a>';

  card.appendChild(photoBox);
  card.appendChild(info);
  return card;
}