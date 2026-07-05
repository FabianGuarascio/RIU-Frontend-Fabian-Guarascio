import { Routes } from '@angular/router';
import { HeroesList } from './features/heroes/components/heroes-list/heroes-list';
import { About } from './features/about/about/about';
import { HeroDetail } from './features/heroes/components/hero-detail/hero-detail';
import { AddHero } from './features/heroes/components/add-hero/add-hero';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  { path: 'heroes', component: HeroesList },
  { path: 'heroes/new', component: AddHero },
  { path: 'heroes/:id', component: HeroDetail },
  { path: 'about', component: About },
];
