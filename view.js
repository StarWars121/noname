export class View {
    constructor() {
        this.app = document.getElementById('app');
        this.title = this.createElement('h1', 'title');
        this.title.textContent = 'Github Search Repositories';

        this.searchLine = this.createElement('div', 'search-line');
        this.searchInput = this.createElement('input', 'search-input');
        this.searchInput.placeholder = 'Введите название репозитория...';
        this.searchInput.type = 'text';
        this.searchCounter = this.createElement('span', 'counter');
        this.searchLine.append(this.searchInput, this.searchCounter);

        this.dropdown = this.createElement('div', 'dropdown');
        this.dropdown.style.display = 'none';

        this.main = this.createElement('main', 'main');
        this.repoWrapper = this.createElement('div', 'repo-wrapper');
        this.repoList = this.createElement('ul', 'repositories');
        this.repoWrapper.append(this.repoList);
        this.main.append(this.repoWrapper);

        this.app.append(
            this.title,
            this.searchLine,
            this.dropdown,
            this.main
        );
    }

    createElement(tag, cls) {
        const el = document.createElement(tag);
        if (cls) el.classList.add(cls);
        return el;
    }

    showSuggestions(items) {
        this.dropdown.innerHTML = '';
        this.dropdown.style.display = items.length ? 'block' : 'none';

        items.forEach(item => {
            const option = this.createElement('div', 'dropdown-item');
            option.textContent = `${item.owner.login}/${item.name}`;
            option.dataset.id = item.id;
            this.dropdown.append(option);
        });
    }

    createRepo(repoData) {
        const repoElement = this.createElement('li', 'repository');

        const infoDiv = this.createElement('div', 'repo-info');
        const nameSpan = this.createElement('span', 'repo-name');
        nameSpan.textContent = repoData.name;
        const ownerSpan = this.createElement('span', 'repo-owner');
        ownerSpan.textContent = `Owner: ${repoData.owner.login}`;
        const starsSpan = this.createElement('span', 'repo-stars');
        starsSpan.textContent = `Stars: ${repoData.stargazers_count}`;

        infoDiv.append(nameSpan, ownerSpan, starsSpan);

        const deleteBtn = this.createElement('button', 'delete-btn');
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => {
            repoElement.remove();
        });

        repoElement.append(infoDiv, deleteBtn);

        return repoElement;
    }

    addRepository(repoData) {
        const repoElement = this.createRepo(repoData);
        this.repoList.append(repoElement);
    }

    clearInput() {
        this.searchInput.value = '';
        this.dropdown.style.display = 'none';
        this.searchInput.focus();
    }
}