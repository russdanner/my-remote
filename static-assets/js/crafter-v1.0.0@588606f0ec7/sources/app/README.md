# Installation

- Created using:
  - [Create React App](https://github.com/facebookincubator/create-react-app).
  - `create-react-app app --scripts-version=react-scripts-ts`

1. Install [yarn](https://yarnpkg.com/en/)
2. Run `yarn`
3. Create the necessary .env files on the root `app/` directory to override any `.env` declared variables. [See docs](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

## Installing a Dependency

The generated project includes React and ReactDOM as dependencies. It also includes a set of scripts used by Create React App as a development dependency. You may install other dependencies (for example, React Router) with `npm` or `yarn`:

```sh
yarn add react-router
```

This works for any library, not just `react-router`.
