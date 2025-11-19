import { View } from './view.js';
import { Search } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
    const view = new View();
    new Search(view);
});