import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carta } from '../entidades/carta';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent implements OnInit {

  cartas: Carta[] = [];
  cartasSeleccionadas: Carta[] = [];
  bloquearTablero: boolean = false;
  
  intentos: number = 0;
  juegoCompletado: boolean = false;


  private fotoComida = {
    nombre: 'Pastel de Choclo',
    imagen: 'https://www.themealdb.com/images/media/meals/medium/47abic1782854326.jpg'
  };

  private fotoBebida = {
    nombre: 'Margarita Cocktail',
    imagen: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg'
  };

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.intentos = 0;
    this.juegoCompletado = false;
    this.cartasSeleccionadas = [];
    this.bloquearTablero = false;

    const baraja: Carta[] = [];

    baraja.push(new Carta(1, 1, this.fotoComida.nombre, this.fotoComida.imagen, 'comida'));

    baraja.push(new Carta(2, 1, this.fotoBebida.nombre, this.fotoBebida.imagen, 'bebida'));

    for (let i = 3; i <= 16; i++) {
      baraja.push(new Carta(i, 99 + i, 'Incorrecto', 'X', 'comida'));
    }

    this.cartas = baraja.sort(() => Math.random() - 0.5);
  }

  seleccionarCarta(carta: Carta): void {
    if (this.bloquearTablero || carta.volteada || carta.emparejada) return;

    carta.volteada = true;
    this.cartasSeleccionadas.push(carta);

    if (this.cartasSeleccionadas.length === 2) {
      this.intentos++;
      this.evaluarPareja();
    }
  }

  private evaluarPareja(): void {
    this.bloquearTablero = true;
    const [c1, c2] = this.cartasSeleccionadas;

    if (c1.parejaId === 1 && c2.parejaId === 1) {
      c1.emparejada = true;
      c2.emparejada = true;
      this.juegoCompletado = true;

      setTimeout(() => {
        this.iniciarJuego();
      }, 2500);
    } else {
      setTimeout(() => {
        c1.volteada = false;
        c2.volteada = false;
        this.cartasSeleccionadas = [];
        this.bloquearTablero = false;
      }, 900);
    }
  }
}