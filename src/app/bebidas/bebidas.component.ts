import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BebidaService } from '../servicios/api-bebidas.service';
import { CompartirDatosService } from '../servicios/compartir-datos.service';
import { Bebidas } from '../entidades/bebidas';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bebidas.component.html',
  styleUrl: './bebidas.component.css'
})
export class BebidasComponent implements OnInit {

  mensajeToast: string = '';
  mostrarToast: boolean = false;

  private bebidaService = inject(BebidaService);
  private pedidoService = inject(CompartirDatosService);

  bebidas: Bebidas[] = [];
  cargando: boolean = true;

  // Filtros exigidos en la guía
  busquedaNombre: string = '';
  busquedaIngrediente: string = '';
  tipoSeleccionado: string = 'TODAS';
  categoriaSeleccionada: string = 'TODAS';

  ngOnInit(): void {
    this.cargarBebidasIniciales();
  }

  cargarBebidasIniciales(): void {
    this.cargando = true;

    if (this.tipoSeleccionado !== 'TODAS') {
      this.bebidaService.obtenerBebidasPorTipo(this.tipoSeleccionado)
        .then(data => { this.bebidas = data; this.cargando = false; })
        .catch(err => { console.error(err); this.cargando = false; });
    } else if (this.categoriaSeleccionada !== 'TODAS') {
      this.bebidaService.obtenerBebidasPorCategoria(this.categoriaSeleccionada)
        .then(data => { this.bebidas = data; this.cargando = false; })
        .catch(err => { console.error(err); this.cargando = false; });
    } else {
      this.bebidaService.obtenerTodasLasBebidas()
        .then(data => { this.bebidas = data; this.cargando = false; })
        .catch(err => { console.error(err); this.cargando = false; });
    }
  }

  buscarPorNombre(): void {
    if (!this.busquedaNombre.trim()) {
      this.cargarBebidasIniciales();
      return;
    }
    this.cargando = true;
    this.bebidaService.obtenerBebidasPorNombre(this.busquedaNombre.trim())
      .then(data => { this.bebidas = data; this.cargando = false; })
      .catch(err => { console.error(err); this.cargando = false; });
  }

  buscarPorIngrediente(): void {
    if (!this.busquedaIngrediente.trim()) {
      this.cargarBebidasIniciales();
      return;
    }
    this.cargando = true;
    this.bebidaService.obtenerBebidasPorIngrediente(this.busquedaIngrediente.trim())
      .then(data => { this.bebidas = data; this.cargando = false; })
      .catch(err => { console.error(err); this.cargando = false; });
  }

  agregarAlPedido(bebida: Bebidas): void {
    this.pedidoService.agregarProducto({
      id: bebida.id,
      nombre: bebida.nombre,
      precio: bebida.precio,
      imagen: bebida.imagen,
      tipo: 'bebida'
    });
    this.mensajeToast = `¡${bebida.nombre} se ha agregado al pedido!`;
    this.mostrarToast = true;

    setTimeout(() => {
      this.mostrarToast = false;
    }, 1500);
  }
}