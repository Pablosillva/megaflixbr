const API_KEY = 'api_key=a51b56a4039e79780a419fd16830b444&language=pt-BR';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const API_URL_FILMES = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const API_URL_SERIES = `${BASE_URL}/discover/tv?sort_by=popularity.desc&${API_KEY}`;

const emAltaContainer = document.getElementById('emAlta');
const seriesContainer = document.getElementById('seriesContent');

searchButton.addEventListener('click', (event) => {
    event.preventDefault();  // Impede o comportamento padrão do link
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
        window.location.href = `buscar.html?query=${encodeURIComponent(searchQuery)}`;
    }
});

function getGenres(genre_ids) {
    const genres = {
        28: 'Ação',
        12: 'Aventura',
        16: 'Animação',
        35: 'Comédia',
        80: 'Crime',
        99: 'Documentário',
        18: 'Drama',
        10751: 'Família',
        14: 'Fantasia',
        36: 'História',
        27: 'Terror',
        10402: 'Música',
        9648: 'Mistério',
        10749: 'Romance',
        878: 'Ficção Científica',
        10770: 'Cinema TV',
        53: 'Thriller',
        10752: 'Guerra',
        37: 'Faroeste'
    };

    return genre_ids.map(genre_id => genres[genre_id]).join(', ');
}


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const filmesResponse = await fetch(API_URL_FILMES);
        const filmesData = await filmesResponse.json();
        showMovies(filmesData.results.slice(0, 20), emAltaContainer);
        //initializeSwiper();

        const seriesResponse = await fetch(API_URL_SERIES);
        const seriesData = await seriesResponse.json();
        showMovies(seriesData.results.slice(0, 20), seriesContainer);
        //initializeSwiper();
        
    } catch (error) {
        console.error('Erro ao obter filmes e séries:', error);
    }
});

async function getMovies(url, type) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        showMovies(data.results.slice(0, 20), type);
    } catch (error) {
        console.error('Erro ao obter filmes:', error);
    }
}

function showMovies(data, container) {
    if (!container) {
        console.error('Elemento de contêiner não encontrado.');
        return;
    }

    container.innerHTML = '';

    data.forEach(item => {
        const { id, title, poster_path, genre_ids } = item;
        const movieEl = document.createElement('div');
        movieEl.classList.add('swiper-slide', 'filmeBox');
        movieEl.innerHTML = `
            <img src="${IMG_URL + poster_path}" alt="${title}" class="filme-box-img">
            <div class="box-text">
                <h2 class="filme-title">${title}</h2>
                <span class="filme-class">${getGenres(genre_ids)}</span>
                <a href="playpage.html?filmeID=${id}" class="watch-btn">
                    <i class="bx bx-right-arrow"></i>
                    <span>Assistir</span>
                </a>
            </div>
        `;
        container.appendChild(movieEl);
    });
}

getMovies(API_URL_FILMES)
    .then(() => {
        initializeSwiper();
    });

function showSeries(data, type) {
    const container = type === 'filme' ? document.getElementById('emAlta') : document.getElementById('seriesContent');

    container.innerHTML = '';

    data.forEach(filmeBox => {
        const { id, title, poster_path, genres } = filmeBox;
        const genreNames = genres.map(genre => genre.name).join(', ');
        const movieEl = document.createElement('div');
        movieEl.classList.add('swiper-slide', 'filmeBox');
        movieEl.innerHTML = `
        <img src="${IMG_URL + poster_path}" alt="${title}" class="filme-box-img">
        <div class="box-text">
            <h2 class="filme-title">${title}</h2>
            <span class="filme-class">${genreNames}</span>
            <a href="playpage.html?filmeID=${id}" class="watch-btn">
                <i class="bx bx-right-arrow"></i>
                <span>Assistir</span>
            </a>
        </div>
            `;

        container.appendChild(movieEl);

    });

    // Aqui você precisa substituir a URL da API pelo endpoint que retorna as séries em alta
    const seriesURL = `${BASE_URL}/discover/tv?sort_by=popularity.desc&${API_KEY}`;

    // Obtenha as séries em alta e exiba-as
    getMovies(seriesURL, seriesContainer);

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
        if (type === "filme") {
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

        const superFlixLink = `https://superflixapi.top/serie/${tmdbId}`;
        openSeries(superFlixLink);
    }

    function openSeries(superFlixLink) {
        window.open(superFlixLink, '_blank');
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
    const filmesSwiper = new Swiper('.popular-content-filmes', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        navigation: {
            prevEl: '.swiper-button-prev-filmes',
            nextEl: '.swiper-button-next-filmes',
        },
    });
    
    const seriesSwiper = new Swiper('.popular-content-series', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        navigation: {
            prevEl: '.swiper-button-prev-series',
            nextEl: '.swiper-button-next-series',
        },
    });

    const buscarSwiper = new Swiper('.popular-content-buscar', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        navigation: {
            prevEl: '.swiper-button-prev-buscar',
            nextEl: '.swiper-button-next-buscar',
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

getMovies(API_URL_FILMES, 'filme');
getMovies(API_URL_SERIES, 'serie');
