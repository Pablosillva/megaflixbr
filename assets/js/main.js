const API_KEY = 'api_key=a51b56a4039e79780a419fd16830b444&language=pt-BR';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const emAlta = document.getElementById('emAlta');
const form = document.getElementById('form');
const search = document.getElementById('search');

getMovies(API_URL)
    .then(() => {
        initializeSwiper();
    });

async function getMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        showMovies(data.results.slice(0, 20));
    } catch (error) {
        console.error('Erro ao obter filmes:', error);
    }
}


function showMovies(data) {
    emAlta.innerHTML = '';

    data.forEach(filmeBox => {
        const { id, title, poster_path } = filmeBox;
        const movieEl = document.createElement('div');
        movieEl.classList.add('swiper-slide', 'filmeBox');
        movieEl.innerHTML = `
        <img src="${IMG_URL + poster_path}" alt="${title}" class="filme-box-img">
        <div class="box-text">
            <h2 class="filme-title">${title}</h2>
            <span class="filme-class">Ação</span>
            <a href="playpage.html?filmeID=${id}" class="watch-btn">
                <i class="bx bx-right-arrow"></i>
                <span>Assistir</span>
            </a>
        </div>
            `;

        emAlta.appendChild(movieEl);

    });

    var type = "filme"; // Tipo de conteúdo: "filme" ou "serie"
    var tmdb = getParameterByName('filmeID'); // ID do IMDB do filme
    var season = ""; // Número da temporada (para séries)
    var episode = ""; // Número do episódio (para séries)

    // Função para obter parâmetro da URL
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Função para mapear o ID do filme da API TMDB para o ID correspondente na API do SuperFlix
    function getSuperFlixIdFromTMDB(tmdbId) {
        // Implemente aqui a lógica para mapear o ID do filme da API TMDB para o ID correspondente na API do SuperFlix
        // Você pode usar um objeto de mapeamento manual ou consultar uma fonte externa para obter essa correspondência
        // Se os IDs forem iguais, você pode simplesmente retornar o ID do TMDB como está
        return tmdbId;
    }

    // Função para adicionar o embed do filme ou série ao site
    function SuperFlixAPIPluginJS(type, tmdb, season, episode) {
        if (type == "filme") {
            season = "";
            episode = "";
        } else {
            if (season !== "") {
                season = "/" + season;
            }
            if (episode !== "") {
                episode = "/" + episode;
            }
        }

        var frame = document.getElementById('SuperFlixAPIContainerVideo');
        frame.innerHTML += '<iframe src="https://superflixapi.top/' + type + '/' + tmdb + season + episode + '" width="100%" height="600px" scrolling="no" frameborder="0" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""></iframe>';
    }

    // Chamar a função para adicionar o embed do filme ou série ao site
    var superFlixId = getSuperFlixIdFromTMDB(tmdb);
    SuperFlixAPIPluginJS(type, superFlixId, season, episode);

    function loadSuperFlixFilm(tmdbId) {

        // Aqui você precisa mapear o ID do filme da TMDB para o correspondente na API do SuperFlix
        // Pode ser necessário criar um mapeamento manual ou consultar uma API de terceiros para isso

        // Suponha que você já tenha o mapeamento e o ID correspondente do filme no SuperFlix
        const superFlixId = getSuperFlixIdFromTMDB(tmdbId);

        // Chama a função SuperFlixAPIPluginJS com o tipo de filme "filme" e o ID do filme do SuperFlix
        SuperFlixAPIPluginJS("filme", superFlixId, "", "");
    }

    // Adiciona evento de clique aos botões de assistir
    const watchButtons = document.querySelectorAll('.watch-btn');
    watchButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const tmdbId = button.getAttribute('data-tmdb-id');
            // Chama a função para carregar o filme do SuperFlix com o ID do filme da TMDB
            loadSuperFlixFilm(tmdbId);
        });
    });

}



// Função para mapear o ID do filme da TMDB para o correspondente no SuperFlix
function getSuperFlixIdFromTMDB(tmdbId) {
    // Suponha que você tenha um objeto de mapeamento entre os IDs do TMDB e do SuperFlixAPI
    // Aqui está um exemplo fictício desse objeto:
    const tmdbToSuperFlixMapping = {
        "12345": "67890", // Exemplo: ID do TMDB mapeado para o ID do SuperFlixAPI
        // Adicione mais mapeamentos conforme necessário
    };

    // Verifica se o ID do TMDB existe no objeto de mapeamento
    if (tmdbId in tmdbToSuperFlixMapping) {
        // Retorna o ID correspondente do SuperFlixAPI
        return tmdbToSuperFlixMapping[tmdbId];
    } else {
        // Se não houver um mapeamento para o ID do TMDB, você pode retornar o próprio ID do TMDB como padrão
        return tmdbId;
    }
}

function initializeSwiper() {
    new initializeSwiper('.popular-content', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        navigation: {
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
        },
    });
}

function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm)
    } else {
        getMovies(API_URL);
    }
});



