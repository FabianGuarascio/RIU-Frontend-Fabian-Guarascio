import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col gap-6 p-4 sm:p-6 max-w-3xl mx-auto">
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl font-semibold">About this project</h2>
        <p>
          This is a technical test for a Frontend Developer position, built as a single-page
          application (SPA) with Angular that manages a roster of super heroes: listing, searching,
          creating, editing and deleting them.
        </p>
      </div>

      <section class="flex flex-col gap-2">
        <h3 class="text-lg font-medium">What it does</h3>
        <ul class="list-disc pl-5 flex flex-col gap-1">
          <li>Paginated list of heroes with add, edit, view and delete actions.</li>
          <li>Live filter by name (e.g. "man" matches Spiderman, Superman, Manolito el Fuerte).</li>
          <li>Form with validation to create a new hero, returning to the list afterwards.</li>
          <li>
            Form pre-filled with the selected hero's data to edit it, returning to the list
            afterwards.
          </li>
          <li>Confirmation prompt before deleting a hero.</li>
          <li>
            Hero data is kept in-memory (no real backend), served through an HTTP interceptor that
            mocks the API.
          </li>
        </ul>
      </section>

      <section class="flex flex-col gap-2">
        <h3 class="text-lg font-medium">Extras on top of the requirements</h3>
        <ul class="list-disc pl-5 flex flex-col gap-1">
          <li>Angular Material for the UI.</li>
          <li>Routing and navigation between the heroes list and hero detail views.</li>
          <li>A loading interceptor that shows a spinner while requests are in flight.</li>
          <li>Light/dark theme toggle.</li>
        </ul>
      </section>

      <section class="flex flex-col gap-2">
        <h3 class="text-lg font-medium">Stack</h3>
        <p>Angular, Angular Material, RxJS, Tailwind CSS and Vitest for unit tests.</p>
      </section>

      <a routerLink="/heroes" class="self-start underline-offset-2 hover:underline"
        >← Back to heroes</a
      >
    </div>
  `,
  styles: ``,
})
export class About {}
