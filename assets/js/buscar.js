const API_KEY = 'a51b56a4039e79780a419fd16830b444';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchContainer = document.querySelector('.filmeBox');

const searchInput = document.getElementById('search');
const searchButton = document.querySelector('.search a');

// Função para capturar o parâmetro 'query' da URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Função para buscar filmes na API TMDB
async function searchMovies(query) {
    const searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        if (data.results.length > 0) {
            displaySearchResults(data.results);
        } else {
            searchContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        searchContainer.innerHTML = '<p>Erro ao buscar filmes.</p>';
    }
}

// Função para exibir os resultados na página
function displaySearchResults(results) {
    searchContainer.innerHTML = ''; // Limpa os resultados anteriores
    results.forEach(movie => {
        const { id, title, poster_path, genre_ids } = movie;
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
        searchContainer.appendChild(movieEl);
    });
}

// Função para obter os gêneros do filme
function getGenres(genre_ids) {
    const genres = {
        28: 'Ação',
        12: 'Aventura',
        16: 'Animação',
        35: 'Comédia',
        80: 'Crime',
        18: 'Drama',
        10751: 'Família',
        14: 'Fantasia',
        27: 'Terror',
        10402: 'Música',
        9648: 'Mistério',
        10749: 'Romance',
        878: 'Ficção Científica'
    };
    return genre_ids.map(id => genres[id] || 'Outro').join(', ');
}

// Captura o termo da busca e realiza a pesquisa
const searchQuery = getQueryParam('query');
if (searchQuery) {
    searchMovies(searchQuery);  // Realiza a busca com o termo capturado
}
