import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


export interface ItemPedido {
  id: string;
  nombre: string;
  tipo: 'comida' | 'bebida';
  cantidad: number;
  precio: number;
  imagen: string;
}
@Injectable({
  providedIn: 'root'
})
export class CompartirDatosService {
  private platformId = inject(PLATFORM_ID);
  public pedidoSignal = signal<ItemPedido[]>(this.obtenerPedidoInicial());
  
  private obtenerPedidoInicial(): ItemPedido[] {
    if (isPlatformBrowser(this.platformId)) {
      const pedidoGuardado = localStorage.getItem('pedidoActual');
      return pedidoGuardado ? JSON.parse(pedidoGuardado) : [];
    }
    return [];
  }

    agregarProducto(producto: { id: string; nombre: string; precio: number; imagen: string; tipo: 'comida' | 'bebida' }): void {
    const itemsActuales = [...this.pedidoSignal()];
    const indiceExistente = itemsActuales.findIndex(item => item.id === producto.id);

    if (indiceExistente !== -1) {
      itemsActuales[indiceExistente].cantidad += 1;
    } else {
      itemsActuales.push({
        id: producto.id,
        nombre: producto.nombre,
        tipo: producto.tipo,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen
      });
    }
    this.actualizarEstado(itemsActuales);
  }

    eliminarProducto(id: string): void {
    const itemsFiltrados = this.pedidoSignal().filter(item => item.id !== id);
    this.actualizarEstado(itemsFiltrados);
  }

  limpiarPedido(): void {
    this.pedidoSignal.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('pedidoActual');
    }
  }

  private actualizarEstado(items: ItemPedido[]): void {
    this.pedidoSignal.set(items);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('pedidoActual', JSON.stringify(items));
    }
  }


  constructor() {}
}

