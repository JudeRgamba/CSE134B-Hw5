# CSE 134B - Web Component Homework

The start to actually making a usable website.

## Astro Project:

- Pages to preview: ssg-exercise\src\pages\about.astro and ssg-exercise\src\pages\index.astro
- Project path: /ssg-exercise

## User Action Trace:

1. The user wants to navigate the webpage and then generate a random fun fact from the web component on the home page.
2. They click on the "Load random fact" button and an api call fires. 
3. A request is sent to https://uselessfacts.jsph.pl/api/v2/facts/random.
4. While waiting, the visitor sees a status update on the bottom of the web component saying "Loading a random fact". 
5. If successful, the visitor sees the random fact displayed and a status message at the bottom of the panel saying "Random fact loaded successfully."
6. If not successful, the visitor will see a status message saying "Could not load a random fact. Check your connection and try again."