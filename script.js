let offset = 0;
let pkmList = [];
let limit = 20;
const loadingScreen = document.getElementById("loading_screen");

async function fetchData() {
    try {
        loadingScreen.style.display = "flex";
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`);
        const pkmNames = (await response.json()).results;
        for (const pkm of pkmNames) {
            const pkmData = await fetchPokemonData(pkm.name);
            if (pkmData) {
                pkmList.push(pkmData);
            }
        }
        loadingScreen.style.display = "none";
    } catch (error) {
        showError ();
    }
}

async function fetchPokemonData(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

async function renderCards() {
    let cardContainer = document.getElementById("card_container");
    for (let index = offset; index < pkmList.length; index++) {
        const element = pkmList[index];
        const imgUrl = element.sprites.front_default;
        const name = element.name;
        cardContainer.innerHTML += /*html*/`
        <div id="pkm${index}" class="card" onclick="showDetails(${index})">
        <img id="img${index}" src="${imgUrl}">
        <h3>${capitalizeFirstLetter(name)}</h3>
        ${await showTypes(name)}
       <span>#${element.id}</span>
        </div>`
            ;
    }
    zoom();
}

async function show() {
    await getAllPkm();
    await fetchData();
    renderCards();
}

async function showDetails(index) {
    element = pkmList[index];
    document.getElementsByTagName("body")[0].classList.add('no-scroll');
    closeDetailCard();
    document.getElementById("detail_container").style.display = "flex";
    let content = document.getElementById("detail_container");
    content.innerHTML = /*html*/`
    <span class="arrow" id="arrowLeft" onclick="showDetails(${index - 1})">◀</span>
    <div id="detail_card" >
        <h3 class="center">#${element.id} ${capitalizeFirstLetter(element.name)}</h3>
        <img src="${element.sprites.front_default}">
        ${await showTypes(element.name)}
               ${showStats(index)}
    </div>
    <span class="arrow" id="arrowRight" onclick="showDetails(${index + 1})">▶</span>`;
    checkArrows(index + 1);
}

function checkArrows(index) {
    if (index == pkmList.length) {
        document.getElementById("arrowRight").style.visibility = "hidden";
    }
    if (index == 1) {
        document.getElementById("arrowLeft").style.visibility = "hidden";
    }
}

function showStats(index) {
    let pokemon = pkmList[index];
    let content = "";
    for (let index = 0; index < pokemon.stats.length; index++) {
        const element = pokemon.stats[index];
        content += `<div class="bar-and-label">
        <div class="bar" style="width:${element.base_stat * 1.5}px; height:15px"><span class="label">${capitalizeFirstLetter(element.stat.name)} ${(element.base_stat)}</span></div></div>
        `;
    }
    content = `<div class="barcontainer"> <h4>Stats</h4>${content}</div>`
    return content;
}

async function showMore() {
    offset = offset + 20;
    show();
}

async function showTypes(name) {
    let typeList = '';
    let pokemon = await fetchPokemonData(name);
    for (let index = 0; index < pokemon.types.length; index++) {
        const element = pokemon.types[index].type.name;
        typeList += `<span class="type ${element}">${capitalizeFirstLetter(element)}</span>`;
    }
    typeList = `<div class="type-container">${typeList}</div>`
    return typeList;
}

function closeDetailCard() {
    const detailContainer = document.getElementById("detail_container");
    detailContainer.addEventListener('click', (event) => {
        // Check if the clicked element is the container itself
        if (event.target === detailContainer) {
            detailContainer.style.display = "none";
            document.getElementsByTagName("body")[0].classList.remove('no-scroll');
        }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function zoom() {
    for (let index = 0; index < pkmList.length; index++) {
        if (document.getElementById(`pkm${index}`)) {
            document.getElementById(`pkm${index}`).addEventListener("mouseover", () => {
                document.getElementById(`img${index}`).style.transform = "scale(1.3)";
            });
            document.getElementById(`pkm${index}`).addEventListener("mouseout", () => {
                document.getElementById(`img${index}`).style.transform = "";
            });
        }
    }
}





