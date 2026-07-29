// Libraries
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap';

// Custom Styles
import './css/common.css';
import './css/home.css'

// Components
import Nav, { updateActiveLink } from './componenets/Nav/nav.js';
import { GeneresContainer } from './componenets/GeneresContainer/generes-container.js';

const navContainer = document.querySelector(".nav-container");
if (navContainer) {
    navContainer.innerHTML = Nav();
}

const homeGeneresContainer = document.querySelector(".home-generes-container");
if (homeGeneresContainer) {
    homeGeneresContainer.innerHTML = GeneresContainer(["fantasy", "romance", "thriller", "mystery", "science fiction", "fantasy", "romance", "thriller", "mystery", "science fiction"]);
}


// Initialize the active state immediately after injecting the Nav HTML
updateActiveLink();

