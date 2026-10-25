# Recipe Finder

## Project Description

Recipe Finder is a simple web application that helps users discover recipes by searching for ingredients or meal names. Users can view recipe images and cuisine information, save their favorite recipes, and remove recipes from their favorites list.
The website is designed to be easy to use on desktop computers, tablets, and mobile devices.

## API

This project uses [TheMealDB API](https://www.themealdb.com/api.php) to retrieve recipe information in JSON format.

The application uses the recipe search endpoint to find meals based on the user's search term.

## Technologies

- HTML
- CSS
- JavaScript
- TheMealDB REST API
- Browser localStorage

## ES6 Features

- **const and let:** Used to declare variables throughout script.js.
- **Arrow functions:** Used to define functions and handle events.
- **Template literals:** Used to create recipe cards dynamically with meal information from the API.
- **Async/await:** Used to request recipe data from TheMealDB API.
- **Object destructuring:** Used to extract the meals property from the API response and selected properties from recipe objects.

## Local Storage

The application uses localStorage to save favorite recipes in the browser. Saved recipes remain available when the user refreshes the page.

## Responsive Design

CSS Grid, flexible layouts, and a media query help the website adapt to different screen sizes.