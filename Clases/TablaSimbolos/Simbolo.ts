import { TablaSimbolos } from "./TablaSimbolos";
import { TIPO } from "./Tipo";

export class Simbolo{
    public id: string;
    public tipo:TIPO;
    public fila: number;
    public columna: number;
    public valor : any; // if is Struct = TablaSibolos
    public arreglo : any;
    public structEnv: any; // ENTORNO STRUCT
    public variables ; // instructions de STRUCT
    
    constructor(id, tipo, arreglo, fila, columna, valor, structEnv = false){
        this.id = id;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.valor =  valor;
        this.arreglo = arreglo;
        this.structEnv = structEnv;
        console.log("simbolor: "+this.valor);
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

    getTipoStruct(){
        return this.id;
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

    public toStringStruct()
    {
        // return this.id + " - " + this.descripcion + " [" + String(this.fila) + "," + String(this.columna) + "]";
        console.log("entre a to string struct")
        let cadena =""
        
        if (this.valor instanceof TablaSimbolos)
        {
            console.log(this.valor.tabla)
            cadena = this.valor.toStringTable();
        }
        return this.id + "(" +`${cadena}` +")"; 
    }
}