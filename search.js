let allPkmNames = [];
let filteredList = [];

async function getAllPkm() {
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=1301&offset=0`);
        allPkmNames = (await response.json()).results;
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
}

let searchField = document.getElementById("search");
async function search() {
    if (searchField.value.length >= 3) {
        pkmList = [];
        await fetchSearchData();
    }
    else if ((searchField.value.length == 0)) {
        document.getElementById("card_container").innerHTML = "";
        pkmList = []
        await show();
        document.getElementById("show_more_button").style.display = "";
    }
}

async function updatePkmList() {
    for (let index = 0; index < filteredList.length; index++) {
        const element = filteredList[index].name;
        pkmList.push(await fetchPokemonData(element))
    }
    if (pkmList.length > 10) {
        pkmList.length = 10;
    }
}

async function fetchSearchData() {
    try {
        loadingScreen.style.display = "flex";
        document.getElementById("card_container").innerHTML = "";
        filteredList = allPkmNames;
        filteredList = filteredList.filter(element => element.name.includes(searchField.value.toLowerCase()));
        pkmList = [];
        document.getElementById("show_more_button").style.display = "none";
        await updatePkmList();
        renderCards();
        loadingScreen.style.display = "none";
    }
    catch (error) {
        showError(error);
    }
}

function showError(error) {
    console.error("Error fetching data:", error);
    loadingScreen.style.display = "none";
}

function activateSearch() {
    searchField.addEventListener("input", search);
}

activateSearch();
