const state = {
   recipes: [],
   favorites: [],
   search: ""

}

//doms
const bodyEl = document.querySelector("#body-container");
const formEl = document.getElementById("search-form")
const inputSearch = document.getElementById("search-input")
const characterEl = document.getElementById("characters")
const favoriteEl = document.getElementById("favorites")
const messageEl = document.getElementById("message")
const favouriteCountEl = document.getElementById("favorite-count")
const drawerEL = document.getElementById("drawer")
const overlayEl = document.getElementById("overlay")
const toggleButton = document.getElementById("toggle-button")
const closeButton = document.querySelector(".close-button")

async function loadRecipies() {
   messageEl.textContent = "Loading"

   try {
      const response = await fetch("https://dummyjson.com/recipes");
      const data = await response.json();
      state.recipes = data.recipes;
      state.search = "";
      messageEl.textContent = "";
      render();

   } catch (error) {
      console.log(error);
      messageEl.textContent = "something went wrong"

   }

}

function render() {
   const term = state.search.toLowerCase().trim()
   const recipes = state.recipes.filter(c => c.name.toLowerCase().includes(term))

   if (recipes.length === 0) {
      messageEl.textContent = "Not found"
   } else {
      characterEl.innerHTML = recipes.map(character => createCard(character)).join("")
   }
   favoriteEl.innerHTML = state.favorites.map(character => createFavCard(character)).join("")
   favouriteCountEl.textContent = state.favorites.length;


}

function createCard(character) {
   const saved = state.favorites.some(fav => fav.id === character.id);
   return `

   <div class="card" id="card-${character.id}">
        <img src="${character.image}" alt="${character.name}">

        <h2>${character.name}</h2>
      
        <p>
          ${character.cuisine}
        </p>
        <div class="card-info" style="display: flex;  justify-content: space-between;">
      
         <p>
          ${character.difficulty}
         </p>
         <p>${character.rating}</p>
         </div>
       

         <button onclick="addOrRemove(${character.id})" >
            ${saved ? "Remove" : " favorites"}
        </button>
       
      </div>
   `;


}

function createFavCard(character) {
   const saved = state.favorites.some(fav => fav.id === character.id);
   return `

   <div class="card-fav" id="card-fav-${character.id}">
        <img src="${character.image}" alt="${character.name}">

        <h2>${character.name}</h2>
      
      
         
         <p>${character.rating}</p>
         
       

         <button onclick="addOrRemove(${character.id})" >
            ${saved ? "Remove" : " favorites"}
        </button>
       
      </div>
   `;


}

//functions

function addOrRemove(id) {
   const exist = state.favorites.find(f => f.id === id);
   if (exist) {
      state.favorites = state.favorites.filter(f => f.id !== id);

   } else {
      const char = state.recipes.find(c => c.id === id);
      state.favorites.push(char);


   }
   render();
   saveFavorites();
}


//handlers
formEl.addEventListener("submit", e => {
   e.preventDefault();
   state.search = inputSearch.value.trim();
   render();

});
function saveFavorites() {

   localStorage.setItem("recipeapp", JSON.stringify(state.favorites));
}

function loadFavorites() {
   state.favorites = JSON.parse(localStorage.getItem("recipeapp") || "[]");
}

function openFav() {
   drawerEL.classList.add("open")
   overlayEl.classList.add("open")
   document.body.classList.add("no-scroll")
}
function closeFav() {
   drawerEL.classList.remove("open")
   overlayEl.classList.remove("open")
   document.body.classList.remove("no-scroll")

}
toggleButton.addEventListener("click", openFav)
overlayEl.addEventListener("click", closeFav)
closeButton.addEventListener("click", closeFav)

function init() {
   loadFavorites();
   loadRecipies();
}
init();




