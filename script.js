document.addEventListener('DOMContentLoaded', () => {
    const characterContainer = document.getElementById('character-container');
    const searchBar = document.getElementById('search-bar');
    const houseNav = document.getElementById('house-nav');
    const pagination = document.getElementById('pagination');
    let characters = [];
    let filteredCharacters = [];
    let currentPage = 1;
    const charactersPerPage = 10;

    fetch('https://hp-api.herokuapp.com/api/characters')
        .then(response => response.json())
        .then(data => {
            characters = data;
            filteredCharacters = characters;
            displayCharacters();
            setupPagination();
        })
        .catch(error => console.error('Error fetching data:', error));

    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredCharacters = characters.filter(character =>
            character.name.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayCharacters();
        setupPagination();
    });

    houseNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const house = e.target.getAttribute('data-house');
            filteredCharacters = characters;
            if (house !== 'All') {
                filteredCharacters = characters.filter(character => character.house === house);
            }
            currentPage = 1;
            displayCharacters();
            setupPagination();
        }
    });

    function getCurrentPageCharacters() {
        const startIndex = (currentPage - 1) * charactersPerPage;
        return filteredCharacters.slice(startIndex, startIndex + charactersPerPage);
    }

    function displayCharacters() {
        characterContainer.innerHTML = '';
        const charactersToShow = getCurrentPageCharacters();
        charactersToShow.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.className = 'character-card';

            const characterImage = document.createElement('img');
            characterImage.src = character.image || 'https://i.pinimg.com/736x/34/ea/3d/34ea3dc782bf1b0accdea63f356a4ce7.jpg';
            characterImage.alt = `${character.name}`;

            const characterName = document.createElement('h2');
            characterName.textContent = character.name;

            const characterHouse = document.createElement('p');
            characterHouse.textContent = `House: ${character.house}`;

            const characterActor = document.createElement('p');
            characterActor.textContent = `Actor: ${character.actor}`;

            characterCard.appendChild(characterImage);
            characterCard.appendChild(characterName);
            characterCard.appendChild(characterHouse);
            characterCard.appendChild(characterActor);

            characterContainer.appendChild(characterCard);
        });
    }

    function setupPagination() {
        pagination.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Prev';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayCharacters();
                updatePaginationButtons();
            }
        });
        pagination.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === Math.ceil(filteredCharacters.length / charactersPerPage);
        nextButton.addEventListener('click', () => {
            if (currentPage < Math.ceil(filteredCharacters.length / charactersPerPage)) {
                currentPage++;
                displayCharacters();
                updatePaginationButtons();
            }
        });
        pagination.appendChild(nextButton);

        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        const prevButton = pagination.querySelector('button:first-of-type');
        const nextButton = pagination.querySelector('button:last-of-type');
        
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(filteredCharacters.length / charactersPerPage);
    }
});
