export class Comidas {
    id:string = '';
    nombre:string = '';
    categoria:string = '';
    imagen:string = '';
    ingredientes:string[] = [];
    precio:number = 0;

    constructor(id?:string, nombre?:string, categoria?:string, imagen?:string, ingredientes?:string[], precio?:number){
        this.id = id || '';
        this.nombre = nombre || '';
        this.categoria = categoria || '';
        this.imagen = imagen || '';
        this.ingredientes = ingredientes || [];
        this.precio = precio || 0;
        
    }
}
