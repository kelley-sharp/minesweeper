# Minesweeper

`React.JS` `TypeScript` `CSS3`

## About

On my first Windows computer in the 90's, Minesweeper was the most difficult of the Entertainment Pack games for me to play. That's why I wanted to build it programmatically from scratch. I still lose often, but the real win is the satisfaction of knowing how it works.

To view the site and play the game go [here](https://kelleysharp-minesweeper.netlify.com/).

## Greatest Challenge

When the player's selected cell does not have a bomb, how does the game search just the neighboring cells and decide which ones to reveal? This involved writing an algorithm that would traverse and reveal neighboring cells whose hidden values are either null or a number. I used a stack data structure to look at the cells and a depth-first search to traverse their neighbors.

## How to run this app locally

1. Clone this repository into a new directory.

2. In the project directory, run:

- ### `npm install` or `yarn install`
  This will install all the dependencies you need.

3. Now run:

- ### `npm start`
  This will run the app in development mode.<br>
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Learn More

This app was bootstrapped with Create-React-App.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
