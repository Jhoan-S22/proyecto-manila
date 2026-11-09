import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import{ CompartirDatosService } from '../servicios/compartir-datos.service';
import {ComidaService} from '../servicios/api-comidas.service';
import { Comidas } from '../entidades/comidas';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comidas.component.html',
  styleUrl: './comidas.component.css'
})
export class ComidasComponent implements OnInit {

  private comidaService = inject(ComidaService);
  private pedidoService = inject(CompartirDatosService);

  comidas: Comidas[] = [];
  cargando: boolean = true;

  busquedaNombre: string = '';
  busquedaIngrediente: string = '';
  categoriaSeleccionada: string = 'TODAS';

  mensajeToast: string = '';
  mostrarToast: boolean = false;

  ngOnInit(): void {
    this.cargarComidasIniciales();
  }

  cargarComidasIniciales(): void {
    this.cargando = true;

    if (this.categoriaSeleccionada === 'TODAS') {
      this.comidaService.obtenerTodasLasComidas()
        .then(data => {
          this.comidas = data;
          this.cargando = false;
        })
        .catch(err => {
          console.error('Error al cargar todas las comidas:', err);
          this.cargando = false;
        });
    } else {
      this.comidaService.obtenerComidasPorCategoria(this.categoriaSeleccionada)
        .then(data => {
          this.comidas = data;
          this.cargando = false;
        })
        .catch(err => {
          console.error('Error al cargar por categoría:', err);
          this.cargando = false;
        });
    }
  }

  buscarPorNombre(): void {
    if (!this.busquedaNombre.trim()) {
      this.cargarComidasIniciales();
      return;
    }
    this.cargando = true;
    this.comidaService.obtenerComidasPorNombre(this.busquedaNombre.trim())
      .then(data => {
        this.comidas = data;
        this.cargando = false;
      })
      .catch(err => {
        console.error('Error al buscar por nombre:', err);
        this.cargando = false;
      });
  }

  buscarPorIngrediente(): void {
    if (!this.busquedaIngrediente.trim()) {
      this.cargarComidasIniciales();
      return;
    }
    this.cargando = true;
    this.comidaService.obtenerComidasPorIngrediente(this.busquedaIngrediente.trim())
      .then(data => {
        this.comidas = data;
        this.cargando = false;
      })
      .catch(err => {
        console.error('Error al buscar por ingrediente:', err);
        this.cargando = false;
      });
  }

  agregarAlPedido(comida: Comidas): void {
    this.pedidoService.agregarProducto({
      id: comida.id,
      nombre: comida.nombre,
      precio: comida.precio,
      imagen: comida.imagen,
      tipo: 'comida'
    });
    this.mensajeToast = `¡${comida.nombre} se ha agregado al pedido!`;
    this.mostrarToast = true;

    setTimeout(() => {
      this.mostrarToast = false;
    }, 1500);
  }
}
