# App Tracker — React Application for ServiceNow

A React-based web application designed to build and deploy to ServiceNow as a scoped application. Uses Webpack for bundling, Ant Design for UI components, and React Router for client-side routing.

---

## Local Development Setup

### Prerequisites

| Requirement | Version |
|---|---|
| **Node.js** | v18.x or v20.x or v22.x (LTS recommended) |
| **npm** | v9+ (ships with Node.js) |
| **Git** | Any recent version |

> **Note:** There is no `.nvmrc` file. The project uses Webpack 5, Babel 7, and React 18, which require Node.js 18+.

### Clone the Repository

```bash
git clone <repository-url>
cd app-tracker
```

### Install Dependencies

```bash
npm install
```

If you encounter peer dependency conflicts, use:

```bash
npm install --legacy-peer-deps
```

### Environment Configuration

This application proxies API requests to a ServiceNow instance during local development. Configuration is managed in `./webpack/servicenow.config.js`.

Open the file and set the following values:

| Setting | Description |
|---|---|
| `SERVICENOW_INSTANCE` | URL of the target ServiceNow instance (e.g. `https://ezapps-dev.nih.gov/`) |
| `REACT_APP_USER` | ServiceNow username for API requests (development only) |
| `REACT_APP_PASSWORD` | ServiceNow password for API requests (development only) |

> **Important:** Do not commit credentials. Use a test account, not your personal credentials.

The remaining settings (`JS_API_PATH`, `IMG_API_PATH`, `ASSETS_API_PATH`, `ASSET_SIZE_LIMIT`) control build output paths for ServiceNow deployment and generally do not need changes for local development.

### Running the Application Locally

```bash
npm start
```

This starts a Webpack Dev Server with hot module replacement. The application will be available at:

**http://localhost:9000**

API requests matching `/api` are proxied to the ServiceNow instance specified in `servicenow.config.js`.

### Running Tests

Run the full test suite:

```bash
npm test
```

Run tests with coverage report:

```bash
npm run coverage
```

Run a specific test file:

```bash
npx jest path/to/file.test.js
```

Tests use **Jest** and **React Testing Library**. Test configuration is in `jest.config.js`.

### Linting

```bash
npx eslint src/
```

ESLint configuration is in `.eslintrc`. The project uses `@babel/eslint-parser` with the `eslint-plugin-react` and `eslint-plugin-import` plugins.

### Building the Application

Create a production build:

```bash
npm run build
```

The production bundle is output to the `dist/` directory. A `postbuild` script automatically runs to prepare files for ServiceNow deployment.

### Troubleshooting

**Dependencies fail to install**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Node.js version mismatch**

Ensure you are on Node.js 18 or later:

```bash
node -v
```

If using nvm:

```bash
nvm install 20
nvm use 20
```

**Port 9000 already in use**

Kill the existing process or change the port in `webpack/webpack.dev.config.js` under `devServer.port`.

**API proxy errors (CORS / 401)**

Verify `SERVICENOW_INSTANCE`, `REACT_APP_USER`, and `REACT_APP_PASSWORD` are set correctly in `webpack/servicenow.config.js`.

**Styles not loading or antd issues**

The project uses Less for antd theme customization. If styles break, ensure the `less` and `less-loader` packages are installed:

```bash
npm ls less less-loader
```

---

## Architecture Overview

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Component Library | Ant Design 4 |
| Routing | React Router 6 |
| HTTP Client | Axios |
| Bundler | Webpack 5 |
| Transpiler | Babel 7 |
| Testing | Jest 29 + React Testing Library 16 |
| Linting | ESLint 8 |
| CSS | Less (antd theming) + PostCSS |

---

## ServiceNow Integration

This is a React boilerplate specifically designed to build ServiceNow-ready web applications.

The boilerplate includes a minimalistic example of a ServiceNow scoped app, which serves as a container for a web application. Update set `react-container-servicenow.xml` can be found in the root folder.

This boilerplate supports all modern web development features and capabilities:

- Standard React loaders/processors
- Proxy requests
- Chunks and lazy loading optimizations
- CSS-in-JS
- Hot reloading

The key feature is the ability to build the web application ServiceNow-ready, so it can be deployed simply by uploading bundle files to ServiceNow.

It's assumed that you already have an app container (Scripted REST API) ready on the ServiceNow side — that is where files need to be uploaded. If you don't have one yet, you can use the `react-container-servicenow.xml` app as an example and build your own containers.

### Configuration Reference

To run a local development server you need to update ServiceNow configuration in `./webpack/servicenow.config.js`. Proper configuration is required to proxy REST calls to the ServiceNow instance and to build the application package.

#### Configuration Settings

**`REST_API_PATH`** — `'/api'`

Default prefix for all ServiceNow APIs. Should not be changed.

---

**`SERVICENOW_INSTANCE`** — `'https://<instance-name>.service-now.com'`

ServiceNow instance URL for REST calls. Used in development mode only.

---

**`REACT_APP_USER`** — `'<username>'`

ServiceNow username for API requests. Development mode only. Use a test user, not your own credentials.

---

**`REACT_APP_PASSWORD`** — `'<password>'`

ServiceNow user password. Development mode only.

---

**`JS_API_PATH`** — `'api/<scoped_app_name>/container/js/'`

ServiceNow path to the GET resource which serves JavaScript files. CSS is embedded into JavaScript files.

---

**`IMG_API_PATH`** — `'api/<scoped_app_name>/container/img/'`

ServiceNow path to the GET resource which serves image files (png, jpg, gif). SVG files are embedded into JavaScript files.

---

**`ASSETS_API_PATH`** — `'api/<scoped_app_name>/container/other_assets/'`

ServiceNow path to the GET resource which serves other files like fonts.

---

**`ASSET_SIZE_LIMIT`** — `10000`

Fonts and images below this size (in bytes) will be inlined into JS chunks instead of being saved as separate files.

### Production Build

To create a production build for ServiceNow deployment:

1. Ensure correct API paths are set in `./webpack/servicenow.config.js`
2. Run `npm run build`
3. Find the production build in the `dist/` directory

#### Chunks and Assets

> **Note:** Instead of `.` (dots) in file names, all chunks and assets use `-` (dash), so build files don't have typical extensions.

Apart from application source code, the JS bundle includes images (png, jpg, gif) and fonts below the size limit (10kB by default) and all CSS styles. Files larger than the size limit are saved as separate files under the assets directory.

### Deployment

Once the application is built, the package files will be in the `./dist` folder:

1. Copy `index.html` code into a UI page. The HTML is ServiceNow-ready and requires no changes.
2. Drag-and-drop JavaScript files from `./dist/api/.../js` to the corresponding REST API resource. Do the same with image and asset files.

Open the application by navigating to the UI page URL.
