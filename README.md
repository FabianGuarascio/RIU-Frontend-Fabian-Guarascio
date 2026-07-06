# RIU Frontend - Fabian Guarascio

Technical test for a Frontend Developer position: a single-page application (SPA) built with Angular that manages a roster of super heroes — listing, searching, creating, editing and deleting them.

## What it does

- Paginated list of heroes with add, edit, view and delete actions.
- Live filter by name (e.g. "man" matches Spiderman, Superman, Manolito el Fuerte).
- Form with validation to create a new hero, returning to the list afterwards.
- Form pre-filled with the selected hero's data to edit it, returning to the list afterwards.
- Confirmation prompt before deleting a hero.
- Hero data is kept in-memory (no real backend), served through an HTTP interceptor that mocks the API.

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
