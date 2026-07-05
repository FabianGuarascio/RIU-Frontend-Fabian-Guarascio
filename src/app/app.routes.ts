import { Routes } from '@angular/router';
import { HeroesList } from './features/heroes/components/heroes-list/heroes-list';
import { About } from './features/about/about/about';
import { HeroDetail } from './features/heroes/components/hero-detail/hero-detail';
import { AddHero } from './features/heroes/components/add-hero/add-hero';
import { Heroes } from './features/heroes/components/heroes/heroes';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  {
    path: 'heroes',
    component: Heroes,
    children: [
      { path: '', component: HeroesList },
      { path: 'new', component: AddHero },
      { path: ':id', component: HeroDetail },
    ],
  },
  { path: 'about', component: About },
];
