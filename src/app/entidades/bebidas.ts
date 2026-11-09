export class Bebidas {
    id:string = '';
    nombre:string = '';
    categoria:string = '';
    tipo:string = '';
    imagen:string = '';
    ingredientes:string[] = [];
    precio:number = 0;

    constructor(id?:string, nombre?:string, categoria?:string, tipo?:string, imagen?:string, ingredientes?:string[], precio?:number){
        this.id = id || '';
        this.nombre = nombre || '';
        this.categoria = categoria || '';
        this.tipo = tipo || '';
        this.imagen = imagen || '';
        this.ingredientes = ingredientes || [];
        this.precio = precio || 0;
    }
}
