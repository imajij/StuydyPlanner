# Vite + React + Tailwind Study Planner

This is a simple study planner application built with React, Vite, and Tailwind CSS. Data is stored locally using the browser's localStorage.

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install 
    # or yarn install or pnpm install
    ```

## Development

1.  **Start the development server:**
    ```bash
    npm run dev
    # or yarn dev or pnpm dev
    ```
    This will start the Vite development server, typically at `http://localhost:3000`.

## Build for Production

1.  **Build the application:**
    ```bash
    npm run build
    # or yarn build or pnpm build
    ```
    This command type-checks the code and then builds the static assets into the `public` directory at the project root.

2.  **Preview the production build:**
    ```bash
    npm run preview
    # or yarn preview or pnpm preview
    ```
    This command serves the contents of the build output (`public`) directory locally, allowing you to test the production build before deployment.

## Project Structure Notes

*   **`public/` (Source - Optional):** If you need static assets (like `favicon.ico`, images) that should be copied directly to the build output root *without processing*, place them in a directory named `public` at the project root. Vite handles merging this with the build output.
*   **`public/` (Output):** The build command generates the final production-ready files into this directory at the project root.
*   **`src/`**: Contains the main application source code (React components, hooks, styles, etc.).
*   **`index.html`**: The main HTML entry point (located at the project root).
*   **`vite.config.ts`**: Vite configuration file.
*   **`tailwind.config.js` / `postcss.config.js`**: Tailwind CSS configuration.
