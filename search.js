export class Search {
    constructor(view) {
        this.view = view;
        this.debounceTimer = null;
        this.bindEvents();
    }

    bindEvents() {
        this.view.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length < 2) {
                this.view.dropdown.style.display = 'none';
                return;
            }

            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.fetchSuggestions(query);
            }, 300);
        });

        this.view.dropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.dropdown-item');
            if (!item) return;

            const repoId = Number(item.dataset.id);
            fetch(`https://api.github.com/repositories/${repoId}`)
                .then(res => res.ok ? res.json() : Promise.reject('Not found'))
                .then(repo => {
                    this.view.addRepository(repo);
                    this.view.clearInput();
                });
        });
    }

    async fetchSuggestions(query) {
        try {
            const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            const data = await response.json();
            this.view.showSuggestions(data.items);

            this.view.dropdown.querySelectorAll('.dropdown-item').forEach(option => {
                option.onclick = () => {
                    const repoId = Number(option.dataset.id);
                    fetch(`https://api.github.com/repositories/${repoId}`)
                        .then(res => res.ok ? res.json() : Promise.reject('Not found'))
                        .then(repo => {
                            this.view.addRepository(repo);
                            this.view.clearInput();
                        });
                };
            });
        } catch (err) {
            this.view.dropdown.innerHTML = `<div class="dropdown-item error">❌ Ошибка: ${err.message}</div>`;
            this.view.dropdown.style.display = 'block';
        }
    }
}