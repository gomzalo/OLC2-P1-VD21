export default class Errores{

    public tipo : string;
    public descripcion : string;
    public fila : number;
    public columna : number;

    constructor(tipo, descripcion, fila, columna) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fila = fila;
        this.columna = columna;
    }
}