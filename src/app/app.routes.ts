import { Routes } from '@angular/router';
import { HeroesList } from './features/heroes/components/heroes-list/heroes-list';
import { About } from './features/about/about/about';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  { path: 'heroes', component: HeroesList },
  { path: 'heroes/new', redirectTo:'heroes' },
  { path: 'heroes/:id', redirectTo:'heroes' },
  { path: 'about', component: About },
];
