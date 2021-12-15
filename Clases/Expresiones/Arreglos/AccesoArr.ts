import { Arreglo } from './Arreglo';
import exp from "constants";
import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Rango } from "./Rango";

export  class AccesoArr implements Instruccion{
    public id;
    public expresiones;
    public fila;
    public columna;
    tipo: TIPO;
    arreglo: boolean;

    constructor(id, expresiones, fila, columna){
        this.id = id;
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        if(this.expresiones instanceof AccesoArr){
            return this.expresiones.ejecutar(table, tree);
        }
        let simbolo = table.getSymbolTabla(this.id);
        if(simbolo == null){
            return new Errores("Semantico", "No se encontro la variable " + this.id + ".", this.fila, this.columna);
        }
        this.tipo = simbolo.getTipo();
        if(!simbolo.getArreglo()){
            return new Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
        }
        // console.log("AccArr exp val: " + this.expresiones[0]);
        // console.log("AccArr exp size: " + this.expresiones[0].length);
        // console.log("AccArr exp type: " + (this.expresiones[0].tipo));
        if(this.expresiones[0] instanceof Rango){
            // console.log("AccArr RANK");
            let rank = this.expresiones[0].ejecutar(table, tree);
            // console.log("AccArr rank type: " + (rank instanceof Array));
            // console.log("rank[0] type: " + (typeof(rank[0]) == "string"));
            // console.log("rank accArr: " + rank);
            if(rank == null){
                return new Errores("Semantico", "La variable \'" + this.id + "\', no es un rango.", this.fila, this.columna);
            }
            
            let begin;
            if(rank[0] == "begin"){
                begin = 0;
            }else{
                begin = rank[0].ejecutar(table, tree);
            }
            if(begin instanceof Errores){
                return begin;
            }
            let end;
            if(rank[1] == "end"){
                end = simbolo.getValor().length;
            }else{
                end = rank[1].ejecutar(table, tree);
            }
            if(end instanceof Errores){
                return end;
            }
            // console.log("begin: " + begin);
            // console.log("end: " + end);
            let array = [];
            let contador = begin;
            while(contador <= end){
                array.push(simbolo.getValor()[contador]);
                contador++;
            }
            return array;
        }else{
            // console.log("AccArr NOT RANK");
            // console.log("AccArr exp val: " + this.expresiones);
            // console.log("AccArr exp size: " + this.expresiones.length);
            let value = this.buscarDimensiones(table, tree, this.expresiones, simbolo.getValor());
            // console.log("val acc arr: " + value);
            if(value instanceof Errores){
                return value;
            }
            // if(value instanceof Array){
            //     return new Errores("Semantico", "Acceso a arreglo incompleto.", this.fila, this.columna);
            // }
            return value;
        }
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

    public buscarDimensiones(table, tree, expresiones, arreglo){
        // let value = null;
        if(expresiones.length == 0){
            return arreglo;
        }
        if(!(arreglo instanceof Array)){
            return new Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        // Obteniendo las dimensiones
        let dimension = expresiones.shift();
        // console.log("accArr exp: " + expresiones);
        // Posicion en dimension
        let num = dimension.ejecutar(table, tree);
        // console.log("accArr num dim: " + num);
        // console.log("accArr arr: " + arreglo);
        if(num instanceof Errores){
            return num;
        }
        if(dimension.tipo != TIPO.ENTERO){
            return new Errores("Semantico", "Expresion diferente a entero en arreglo.", this.fila, this.columna);
        }
        // console.log("arreglo[num]: " + arreglo[num][0].toString());
        if(arreglo[num] != undefined){
            // console.log("no null");
            return this.buscarDimensiones(tree, table, expresiones.slice(), arreglo[num][0].slice());
        }else{
            // console.log("null");
            return new Errores("Semantico", "Posicion inexistente en el arreglo.", this.fila, this.columna);
        }
    }

}
