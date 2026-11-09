export class Carta {
    id: number;
  parejaId: number; // Identificador único de la pareja
    nombre: string;
    imagen: string;
    tipo: 'comida' | 'bebida';
    volteada: boolean;
    emparejada: boolean;

    constructor(id: number, parejaId: number, nombre: string, imagen: string, tipo: 'comida' | 'bebida') {
    this.id = id;
    this.parejaId = parejaId;
    this.nombre = nombre;
    this.imagen = imagen;
    this.tipo = tipo;
    this.volteada = false;
    this.emparejada = false;
    }
}
