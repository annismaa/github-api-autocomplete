const input = document.querySelector('.input-api');
const autocompleteList = document.querySelector('.autocomplete-list');
const reposList = document.querySelector('.repos');
let repos = [];

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

async function searchRepos(query) {
    if (!query) {
        autocompleteList.textContent = '';
        return;
    }

    try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
    const data = await response.json();
    displayAutocompleteList(data.items);
    } catch (error) {
        console.error(error);
        errorMessage.textContent = error.message; 
        autocompleteList.textContent = ''; 
    }
}

function displayAutocompleteList(items) {
    autocompleteList.textContent = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('autocomplete-item');
        li.textContent = item.name;
        li.onclick = () => addRepos(item);
        autocompleteList.appendChild(li);
    });
}

function addRepos(repo) {
    repos.push(repo);
    displayRepoList();
    input.value = '';
    autocompleteList.textContent = '';
}

function displayRepoList() {
    reposList.textContent = '';

    // repos.forEach((repo, i) => {
    //     const item = document.createElement('div');
    //     item.classList.add('repo-item');
    //     item.innerHTML = `
    //     <span>
    //     Name: ${repo.name} <br>
    //     Owner: ${repo.owner.login} <br>
    //     Stars: ${repo.stargazers_count}
    //     </span>
    //     <button class="remove-button" onclick="deleteRepo(${i})"></button>
    // `;
    // reposList.appendChild(item);
    // });

    repos.forEach((repo, i) => {
        const item = document.createElement('div');
        item.classList.add('repo-item');

        const span = document.createElement('span');
        span.classList.add('item-info');
        span.textContent = `
        Name: ${repo.name}
        Owner: ${repo.owner.login}
        Stars: ${repo.stargazers_count}
        `;

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.onclick = () => {
            deleteRepo(i);
        };

        item.appendChild(span);
        item.appendChild(removeButton);
    ;
    reposList.appendChild(item);
    });
}

function deleteRepo (i) {
    repos.splice(i, 1);
    displayRepoList();
}

input.addEventListener('input', debounce((e) => {
    searchRepos(e.target.value);
}, 600));
