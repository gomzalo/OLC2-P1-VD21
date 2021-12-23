import { TablaSimbolos } from "./TablaSimbolos";
import { TIPO } from "./Tipo";

export class Simbolo{
    public id: string;
    public tipo:TIPO;
    public fila: number;
    public columna: number;
    public valor : any; // if is Struct = TablaSibolos
    public arreglo : boolean;
    public structEnv: any; // ENTORNO STRUCT
    public variables ; // instructions de STRUCT
    public tipoStruct : string;
    public isGlobal: boolean; // isRef
    public posicion: number;
    public inHeap :boolean;
    
    /**
     * 
     * @param id Identificador del simbolos
     * @param tipo Tipo del simbolo
     * @param arreglo Booleano para verificar si es arreglo
     * @param fila Numero de fila
     * @param columna Numero de columna
     * @param valor Valor del simbolo | if(tipo==TIPO.STRUCT)= tablaSimbolos
     * @param structEnv 
     */
    constructor(id, tipo, arreglo, fila, columna, valor, structEnv = false){
        this.id = id;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.valor =  valor;
        this.arreglo = arreglo;
        this.structEnv = structEnv;
        this.isGlobal = false;
        this.inHeap = false;
        this.posicion = 0;
        // console.log("simbolor: "+this.valor);
    }
    
    setPosicion(posicion){
        this.posicion =this.posicion;
    }
    /**
     * 
     * @returns this.posicion
     */
    getPosicion(){
        return this.posicion;
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
        return this.tipoStruct;
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
        let cadena =""
        
        // if (this.valor instanceof TablaSimbolos)
        // {
            if(this.valor !=null){
                // console.log(this.valor.tabla)
                if (this.valor instanceof TablaSimbolos)
                {
                    cadena += this.valor.toStringTable();
                }else if(this.valor instanceof Simbolo)
                {
                    cadena += this.valor.toStringStruct();
                }
                
            }else{
                return this.id + "(null)"; 
            }
        // }
        return this.id + "(" + cadena +")"; 
    }
}