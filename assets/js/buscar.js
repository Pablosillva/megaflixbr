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
        return data.results || [];
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        return [];
    }
}

// Função para buscar séries na API TMDB
async function searchTVShows(query) {
    const searchUrl = `${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
        return [];
    }
}

// Função para exibir os resultados na página (filmes e séries)
function displaySearchResults(results) {
    searchContainer.innerHTML = ''; // Limpa os resultados anteriores
    if (results.length === 0) {
        searchContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }

    results.forEach(item => {
        const { id, title, name, poster_path, genre_ids, media_type } = item;
        const mediaTitle = title || name;  // Usa 'title' para filmes ou 'name' para séries
        const mediaTypeText = media_type === 'movie' ? 'Filme' : 'Série';

        const movieEl = document.createElement('div');
        movieEl.classList.add('swiper-slide', 'filmeBox');
        movieEl.innerHTML = `
            <img src="${IMG_URL + poster_path}" alt="${mediaTitle}" class="filme-box-img">
            <div class="box-text">
                <h2 class="filme-title">${mediaTitle}</h2>
                <span class="filme-class">${getGenres(genre_ids)} - ${mediaTypeText}</span>
                <a href="playpage.html?filmeID=${id}" class="watch-btn">
                    <i class="bx bx-right-arrow"></i>
                    <span>Assistir</span>
                </a>
            </div>
        `;
        searchContainer.appendChild(movieEl);
    });
}

// Função para obter os gêneros do filme ou série
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

// Função para realizar buscas combinadas de filmes e séries
async function executeSearch() {
    const query = searchInput.value.trim();  // Pega o valor do input de busca
    if (query) {
        // Executa as buscas para filmes e séries ao mesmo tempo
        const [movies, tvShows] = await Promise.all([
            searchMovies(query),
            searchTVShows(query)
        ]);

        // Combina os resultados e adiciona o tipo de mídia
        const combinedResults = [
            ...movies.map(movie => ({ ...movie, media_type: 'movie' })),
            ...tvShows.map(tv => ({ ...tv, media_type: 'tv' }))
        ];

        // Exibe os resultados combinados
        displaySearchResults(combinedResults);
    }
}

// Adiciona evento de clique no botão de busca
searchButton.addEventListener('click', (e) => {
    e.preventDefault();  // Evita o comportamento padrão de link
    executeSearch();
});

// Adiciona evento para capturar a tecla "Enter"
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {  // Verifica se a tecla pressionada foi "Enter"
        e.preventDefault();   // Evita o comportamento padrão de envio do formulário
        executeSearch();      // Dispara a função de busca
    }
});

// Captura o termo da URL e realiza a pesquisa automaticamente (se houver)
const searchQuery = getQueryParam('query');
if (searchQuery) {
    searchInput.value = searchQuery;  // Preenche o campo de busca
    executeSearch();  // Realiza a busca com o termo capturado
}
