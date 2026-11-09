import { Injectable } from '@angular/core';
import { Bebidas } from '../entidades/bebidas';

@Injectable({
  providedIn: 'root'
})
export class BebidaService {

  constructor() { }

  private urlBebidasNombre = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
  private urlBebidasLetra = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=";
  private urlBebidasIngrediente = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=";
  private urlBebidasTipo = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=";
  private urlBebidasCategoria = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=";

  // Carga masiva de bebidas con ingredientes
  obtenerTodasLasBebidas(): Promise<Bebidas[]> {
    const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'm', 'p', 'r', 's', 't', 'v', 'w'];

    const peticiones = letras.map(letra =>
      fetch(this.urlBebidasLetra + letra)
        .then(res => res.json())
        .then(data => data.drinks || [])
    );

    return Promise.all(peticiones)
      .then(resultados => {
        const todasLasBebidasRaw = resultados.flat();
        return this.procesarRespuestaBebidas(todasLasBebidasRaw);
      })
      .catch(error => {
        console.error('Error al obtener todas las bebidas:', error);
        throw error;
      });
  }

  // 1. Buscar coctel por nombre
  obtenerBebidasPorNombre(bebida: string = ''): Promise<Bebidas[]> {
    return fetch(this.urlBebidasNombre + bebida)
      .then(response => response.json())
      .then(data => this.procesarRespuestaBebidas(data.drinks))
      .catch(error => {
        console.error('Error al buscar bebida por nombre:', error);
        throw error;
      });
  }

  // 2. Buscar por ingrediente
  obtenerBebidasPorIngrediente(ingrediente: string): Promise<Bebidas[]> {
    return fetch(this.urlBebidasIngrediente + ingrediente)
      .then(response => response.json())
      .then(data => data.drinks || [])
      .then(drinksSimple => {
        const peticiones = drinksSimple.slice(0, 15).map((d: any) =>
          fetch(this.urlBebidasNombre + d.strDrink)
            .then(r => r.json())
            .then(res => (res.drinks ? res.drinks[0] : d))
        );
        return Promise.all(peticiones);
      })
      .then(drinksCompletos => this.procesarRespuestaBebidas(drinksCompletos))
      .catch(error => {
        console.error('Error al buscar por ingrediente:', error);
        throw error;
      });
  }

  // 3. Filtrar por tipo
  obtenerBebidasPorTipo(tipo: string): Promise<Bebidas[]> {
    return fetch(this.urlBebidasTipo + tipo)
      .then(response => response.json())
      .then(data => data.drinks || [])
      .then(drinksSimple => {
        const peticiones = drinksSimple.slice(0, 15).map((d: any) =>
          fetch(this.urlBebidasNombre + d.strDrink)
            .then(r => r.json())
            .then(res => (res.drinks ? res.drinks[0] : d))
        );
        return Promise.all(peticiones);
      })
      .then(drinksCompletos => this.procesarRespuestaBebidas(drinksCompletos))
      .catch(error => {
        console.error('Error al buscar por tipo:', error);
        throw error;
      });
  }

  // 4. Filtrar por categoría
  obtenerBebidasPorCategoria(categoria: string): Promise<Bebidas[]> {
    return fetch(this.urlBebidasCategoria + categoria)
      .then(response => response.json())
      .then(data => data.drinks || [])
      .then(drinksSimple => {
        const peticiones = drinksSimple.slice(0, 15).map((d: any) =>
          fetch(this.urlBebidasNombre + d.strDrink)
            .then(r => r.json())
            .then(res => (res.drinks ? res.drinks[0] : d))
        );
        return Promise.all(peticiones);
      })
      .then(drinksCompletos => this.procesarRespuestaBebidas(drinksCompletos))
      .catch(error => {
        console.error('Error al buscar por categoría:', error);
        throw error;
      });
  }

  private generarPrecioRandom(): number {
    const min = 12;
    const max = 30;
    return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000;
  }

  private procesarRespuestaBebidas(drinks: any[]): Bebidas[] {
    if (!drinks) return [];

    return drinks.map((drink: any) => {
      const ingredientes: string[] = [];

      for (let i = 1; i <= 15; i++) {
        const ingrediente = drink[`strIngredient${i}`];
        if (ingrediente && ingrediente.trim() !== '') {
          ingredientes.push(ingrediente.trim());
        }
      }

      return new Bebidas(
        drink.idDrink,
        drink.strDrink,
        drink.strCategory || 'Coctelería',
        drink.strAlcoholic || 'Alcoholic',
        drink.strDrinkThumb,
        ingredientes.length > 0 ? ingredientes.slice(0, 5) : ['Hielo', 'Fruta especial'],
        this.generarPrecioRandom()
      );
    });
  }
}