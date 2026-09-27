import './styles/main.scss';
import { initApp } from './app.js';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('#app introuvable dans le DOM');

root.style.display = 'flex';
initApp(root);
