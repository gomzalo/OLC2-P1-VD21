class Simbolo{
    private id;
    private tipo:TIPO;
    private fila: number;
    private col: number;
    private valor : any;
    private arreglo : any;
    private structEnv: any; // ENTORNO STRUCT
    
    constructor(id,tipo,arreglo,fila,col,valor,structEnv = null){
        this.id = id;
        this.tipo = tipo;
        this.fila = fila;
        this.col = col;
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

    getColumn(){
        return this.col;
    }

    getArreglo(){
        return this.arreglo;
    }
}