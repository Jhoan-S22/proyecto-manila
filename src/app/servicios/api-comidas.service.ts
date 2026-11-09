import { Injectable } from '@angular/core';
import { Comidas } from '../entidades/comidas';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {

  constructor() { }

  private urlComidasNombre = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  private urlComidasLetra = "https://www.themealdb.com/api/json/v1/1/search.php?f=";
  private urlComidasCategoria = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
  private urlComidasIngrediente = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";

  // Trae la lista masiva de comidas con TODOS sus ingredientes reales usando el endpoint por letra (search.php?f=)
  obtenerTodasLasComidas(): Promise<Comidas[]> {
    const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'k', 'l', 'm', 'p', 'r', 's', 't', 'v', 'w'];

    const peticiones = letras.map(letra =>
      fetch(this.urlComidasLetra + letra)
        .then(res => res.json())
        .then(data => data.meals || [])
    );

    return Promise.all(peticiones)
      .then(resultados => {
        // Unimos todas las comidas de todas las letras en un solo arreglo sin duplicados
        const todasLasComidasRaw = resultados.flat();
        return this.procesarRespuestaComidas(todasLasComidasRaw);
      })
      .catch(error => {
        console.error('Error al obtener todas las comidas:', error);
        throw error;
      });
  }

  obtenerComidasPorNombre(nombre: string = ''): Promise<Comidas[]> {
    return fetch(this.urlComidasNombre + nombre)
      .then(response => response.json())
      .then(data => this.procesarRespuestaComidas(data.meals))
      .catch(error => {
        console.error('Error al buscar por nombre:', error);
        throw error;
      });
  }

  obtenerComidasPorCategoria(categoria: string): Promise<Comidas[]> {
    return fetch(this.urlComidasCategoria + categoria)
      .then(response => response.json())
      .then(data => data.meals || [])
      .then(mealsSimple => {
        // Para traer ingredientes en categoría, pedimos las comidas completas por nombre
        const peticiones = mealsSimple.slice(0, 15).map((m: any) =>
          fetch(this.urlComidasNombre + m.strMeal)
            .then(r => r.json())
            .then(d => (d.meals ? d.meals[0] : m))
        );
        return Promise.all(peticiones);
      })
      .then(mealsCompletos => this.procesarRespuestaComidas(mealsCompletos))
      .catch(error => {
        console.error('Error al buscar por categoría:', error);
        throw error;
      });
  }

  obtenerComidasPorIngrediente(ingrediente: string): Promise<Comidas[]> {
    return fetch(this.urlComidasIngrediente + ingrediente)
      .then(response => response.json())
      .then(data => data.meals || [])
      .then(mealsSimple => {
        const peticiones = mealsSimple.slice(0, 15).map((m: any) =>
          fetch(this.urlComidasNombre + m.strMeal)
            .then(r => r.json())
            .then(d => (d.meals ? d.meals[0] : m))
        );
        return Promise.all(peticiones);
      })
      .then(mealsCompletos => this.procesarRespuestaComidas(mealsCompletos))
      .catch(error => {
        console.error('Error al buscar por ingrediente:', error);
        throw error;
      });
  }

  private generarPrecioRandom(): number {
    const min = 18;
    const max = 40;
    return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000;
  }

  private procesarRespuestaComidas(meals: any[]): Comidas[] {
    if (!meals) return [];

    return meals.map((meal: any) => {
      const ingredientes: string[] = [];

      // Extraemos los ingredientes reales presentes
      for (let i = 1; i <= 20; i++) {
        const ingrediente = meal[`strIngredient${i}`];
        if (ingrediente && ingrediente.trim() !== '') {
          ingredientes.push(ingrediente.trim());
        }
      }

      return new Comidas(
        meal.idMeal,
        meal.strMeal,
        meal.strCategory || 'Plato Principal',
        meal.strMealThumb,
        ingredientes.length > 0 ? ingredientes.slice(0, 5) : ['Ingrediente secreto'],
        this.generarPrecioRandom()
      );
    });
  }
}