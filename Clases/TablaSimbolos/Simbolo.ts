import { TIPO } from "./Tipo";

export class Simbolo{
    public id: string;
    public tipo:TIPO;
    public fila: number;
    public columna: number;
    public valor : any;
    public arreglo : any;
    public structEnv: any; // ENTORNO STRUCT
    
    constructor(id,tipo,arreglo,fila,columna,valor,structEnv = null){
        this.id = id;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.valor =  valor;
        this.arreglo = arreglo;
        this.structEnv = structEnv;
    }

    getId(){
        return this.id;
    }

    setId(id){
        this.id = id;
    }

    getTipo(){
        return this.tipo;
    }

    setTipo(tipo){
        this.tipo = tipo
    }

    getValor(){
        return this.valor;
    }

    setValor(valor){
        this.valor = valor;
    }

    getFila(){
        return this.fila;
    }

    getColumna(){
        return this.columna;
    }

    getArreglo(){
        return this.arreglo;
    }
}