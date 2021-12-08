import { Ast } from "../Ast/Ast";
import {Errores} from "../Ast/Errores";
import { Instruccion } from "../Interfaces/Instruccion";
import {Simbolo} from "../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";

export  class Declaracion implements Instruccion{
    // public id;
    public tipo;
    public simbolos: Array<Simbolo>;
    public fila;
    public columna;
    public arreglo = false;

    constructor(tipo,fila,columna,simbolos /*= null*/){
        // this.id = id;
        this.tipo= tipo;
        this.simbolos = simbolos;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = false;
    }
    ejecutar(table: TablaSimbolos, tree: Ast) {
        let value = null;
        let tipoExp = null;
        // if (this.expresion != null){
        //     value = this.expresion.ejecutar(table,tree);
        //     if (value instanceof Errores){
        //         return value;
        //     }
        //     this.tipo = this.expresion.tipo
        // }

        // for(let simbolo of this.simbolos){

        //     let variable = simbolo as Simbolos;

        //     //--> verifico que la variable no exista en la tabla de simbolos actual \
        //     if(ts.existeEnActual(variable.identificador)){
        //         let error = new Errores('Semantico', `La variable ${variable.identificador} ya existe en el entorno actual.`, this.linea, this.columna);
        //         controlador.errores.push(error);
        //         controlador.append(`** Error Semantico : La variable ${variable.identificador} ya existe en el entorno actual. En la linea ${this.linea} y columna ${this.columna}`);
        //         continue;
        //     }

        //     //int p1 = 2;
        //     // int p2;
        //     if(variable.valor != null){
        //         let valor = variable.valor.getValor(controlador,ts);

        //         //TODO: Verificar que el tipo del valor obtenido sea igual al de la declaracion 
        //         let tipo_valor = variable.valor.getTipo(controlador,ts);
        //         console.log(tipo_valor, this.type.type);
        //         if(tipo_valor == this.type.type || (tipo_valor == tipo.DOBLE && this.type.type == tipo.ENTERO)){
        //             //--> Lo agregamos a la tabla de simbolos 
                   
        //             let nuevo_simb = new Simbolos(variable.simbolo, this.type, variable.identificador, valor);
        //             ts.agregar(variable.identificador, nuevo_simb);
        //             console.log("son del mismo tipo")
        //         }else{
        //             //Error no se puede declarar por incopatibilidad de simbolos
        //         }
                
        //     }else{
        //         //--> Lo agregamos a la tabla de simbolos 
        //         let nuevo_simb = new Simbolos(variable.simbolo, this.type, variable.identificador, null);
        //         ts.agregar(variable.identificador, nuevo_simb);
        //     }

        // }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}
