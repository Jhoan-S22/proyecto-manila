import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompartirDatosService } from '../servicios/compartir-datos.service'; 
import { Pedido } from '../entidades/pedido';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent {

  public compartirDatosService = inject(CompartirDatosService);

  pedidoActual: Pedido = new Pedido();
  pedidoEnviado: boolean = false;

  // Clona los items al confirmar para que no se pierdan en el PDF aunque se limpie el servicio
  itemsComprobante: any[] = [];

  items = this.compartirDatosService.pedidoSignal;

  subtotal = computed(() => {
    return this.items().reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  });

  costoEnvio = computed(() => {
    return this.items().length > 0 ? 5000 : 0;
  });

  total = computed(() => {
    return this.subtotal() + this.costoEnvio();
  });

  eliminarItem(id: string): void {
    this.compartirDatosService.eliminarProducto(id);
  }

  vaciarCarrito(): void {
    this.compartirDatosService.limpiarPedido();
  }

  confirmarPedido(): void {
    if (!this.pedidoActual.nombreCliente || !this.pedidoActual.celularCliente || !this.pedidoActual.direccionCliente) {
      alert('Por favor completa todos los campos del formulario de entrega.');
      return;
    }

    this.itemsComprobante = [...this.items()];

    this.pedidoActual.subtotal = this.subtotal();
    this.pedidoActual.costoEnvio = this.costoEnvio();
    this.pedidoActual.total = this.total();
    this.pedidoActual.fecha = new Date().toLocaleString('es-CO');

    this.pedidoEnviado = true;

    setTimeout(() => {
      this.descargarPDF();
    }, 300);
  }

  descargarPDF(): void {
    window.print();
    this.compartirDatosService.limpiarPedido();
  }
}