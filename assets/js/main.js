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
        const { title, poster_path } = filmeBox;
        const movieEl = document.createElement('div');
        movieEl.classList.add('swiper-slide', 'filmeBox');
        movieEl.innerHTML = `
        <img src="${IMG_URL + poster_path}" alt="${title}" class="filme-box-img">
        <div class="box-text">
            <h2 class="filme-title">${title}</h2>
            <span class="filme-class">Ação</span>
            <a href="play-page.html" class="watch-btn play-btn">
                <i class="bx bx-right-arrow"></i>
            </a>
        </div>
            `;

        emAlta.appendChild(movieEl);

    });
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

