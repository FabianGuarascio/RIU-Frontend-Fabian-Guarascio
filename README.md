# RIU Frontend - Fabian Guarascio

Technical test for a Frontend Developer position: a single-page application (SPA) built with Angular that manages a roster of super heroes — listing, searching, creating, editing and deleting them.

## What it does

- Paginated list of heroes with add, edit, view and delete actions.
- Live filter by name.
- Form with validation to create a new hero.
- Edition of Hero.
- Confirmation prompt before deleting a hero.
- Hero data is kept in-memory (no real backend), served through an HTTP interceptor that mocks the API.

## My remarks and decisions

This app was built with Angular v21, which is zoneless by default. Because of that, using signals was essential to have the template react correctly to state changes.

Every component uses the `OnPush` change detection strategy to improve performance, and the About page is lazy-loaded, since it's a route most users won't need to visit on every session.

I chose to self-host Roboto and Material Icons instead of pulling them from a CDN, since Lighthouse (Chrome DevTools) flagged the CDN fonts as a render-blocking cost.

For state sharing between components, I built a lightweight store using an injectable service that follows a simple Redux-like pattern. This could have been done with NgRx or NgRx Signal Store, but I went with the approach my previous company used for state sharing — a pattern close to "Subject as a service," adapted here as "signal as a service."

I used Reactive Forms for form creation and validation, though I personally prefer Template-Driven Forms, and I'm looking forward to the new Signal Forms API.

Unit tests are written with Vitest, and the project uses Vite as the build tool instead of Webpack, since it's faster and increasingly the standard choice.

The header includes navigation and a sidebar that appears on tablet-sized viewports.

Hero creation navigates to a separate route, while editing opens a modal — this was a deliberate choice to demonstrate both approaches, since either could reasonably be implemented either way.

An HTTP interceptor simulates the backend and its data store, so the API service layer works against the same HTTP verb-based structure it would use with a real backend. This was the most challenging part of the project — building an actual backend with NestJS, SQLite, and Docker would have been simpler in some ways, but I wanted to keep the project setup lightweight ( you only need to do `ng s` to up the local app).

To demonstrate output bindings, the search input was extracted into its own component, communicating with its parent via an `output()`.

I added a light/dark theme toggle, partly because I prefer dark mode and partly to experiment with it. The user's preference is stored in `localStorage`, though I think this is arguably better suited to cookies than local storage.

I decided to add Tailwind because it's cleaner and avoids writing a lot of SCSS across separate style files. This makes it possible to build components with an inline template, requiring only the `.ts` file — keeping components smaller and simpler. It's also easier to see the styles directly in the HTML rather than jumping back and forth between the `html` and `scss` files.

I added labels and `aria-label` attributes to support web accessibility.

## Extras on top of the requirements

- Angular Material for the UI.
- Routing and navigation between the heroes list and hero detail views.
- A loading interceptor that shows a spinner while requests are in flight.
- Light/dark theme toggle.

## Stack

AngularV21, Angular Material, RxJS, signals, Tailwind CSS and Vitest for unit tests.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.18.

## Getting started

### Prerequisites

- Node.js version >= 22.23.1
- npm

### Clone the repository

```bash
  git clone https://github.com/FabianGuarascio/RIU-Frontend-Fabian-Guarascio.git
  cd RIU-Frontend-Fabian-Guarascio
```

### Install dependencies

```bash
npm i
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically redirect you to `/heroes"` url.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```
