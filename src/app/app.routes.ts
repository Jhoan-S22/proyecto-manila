import { Routes } from '@angular/router';
import {InicioComponent} from './inicio/inicio.component';
import {ComidasComponent} from './comidas/comidas.component';
import {BebidasComponent} from './bebidas/bebidas.component';
import {PedidoComponent} from './pedido/pedido.component';
import {JuegoComponent} from './juego/juego.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    { path: 'pedido', component: PedidoComponent },
    { path: 'comidas', component: ComidasComponent },
    { path: 'juego', component: JuegoComponent },
    { path: 'bebidas', component: BebidasComponent },
    { path: '**', component: InicioComponent },
];