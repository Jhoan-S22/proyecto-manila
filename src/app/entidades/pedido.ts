// Estructura para cada producto dentro de la orden
export interface ItemPedido {
    id: string;
    nombre: string;
    tipo: 'comida' | 'bebida';
    precio: number;
    cantidad: number;
    subtotal: number;
}

export class Pedido {
    nombreCliente: string = '';
    celularCliente: string = '';
    direccionCliente: string = '';
    items: ItemPedido[] = [];
    subtotal: number = 0;
    costoEnvio: number = 0;
    total: number = 0;
    fecha: string = '';

    constructor(nombreCliente?: string,celularCliente?: string,direccionCliente?: string,items?: ItemPedido[],costoEnvio: number = 5000
    ) {
    this.nombreCliente = nombreCliente || '';
    this.celularCliente = celularCliente || '';
    this.direccionCliente = direccionCliente || '';
    this.items = items || [];
    this.costoEnvio = costoEnvio;
    this.fecha = new Date().toLocaleDateString('es-CO');
    this.calcularTotales();
    }

    calcularTotales(): void {
    this.subtotal = this.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    this.total = this.items.length > 0 ? this.subtotal + this.costoEnvio : 0;
    }
}
