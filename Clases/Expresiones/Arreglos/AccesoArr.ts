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
        let simbolo = table.getSymbolTabla(this.id);
        if(simbolo == null){
            return new Errores("Semantico", "No se encontro la variable " + this.id + ".", this.fila, this.columna);
        }
        this.tipo = simbolo.getTipo();
        if(!simbolo.getArreglo()){
            return new Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
        }
        console.log("AccArr exp val: " + this.expresiones[0]);
        console.log("AccArr exp size: " + this.expresiones[0].length);
        console.log("AccArr exp type: " + (this.expresiones[0].tipo));
        if(this.expresiones[0] instanceof Rango){
            console.log("AccArr RANK");
            let rank = this.expresiones[0].ejecutar(table, tree);
            console.log("AccArr rank type: " + (rank instanceof Array));
            console.log("rank accArr: " + rank);
            if(rank == null){
                return new Errores("Semantico", "La variable \'" + this.id + "\', no es un rango.", this.fila, this.columna);
            }
            
            let begin = rank[0].ejecutar(table, tree);
            if(begin instanceof Errores){
                return begin;
            }
            let end = rank[1].ejecutar(table, tree);
            if(end instanceof Errores){
                return end;
            }
            console.log("begin: " + begin);
            console.log("end: " + end);
            let array = [];
            let contador = begin;
            while(contador <= end){
                array.push(simbolo.getValor()[contador]);
                contador++;
            }
            return array;
        }else{
            console.log("AccArr NOT RANK");
            let value = this.buscarDimensiones(table, tree, this.expresiones[0], simbolo.getValor());
            console.log("val acc arr: " + value);
            if(value instanceof Errores){
                return value;
            }
            if(value instanceof Array){
                return new Errores("Semantico", "Acceso a arreglo incompleto.", this.fila, this.columna);
            }
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
        let value = null;
        if(expresiones.length == 0){
            return arreglo;
        }
        if(!(arreglo instanceof Array)){
            return new Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        let dimension = expresiones.pop();
        let num = dimension.ejecutar(table, tree)    ;
        if(num instanceof Errores){
            return num;
        }
        if(dimension.tipo != TIPO.ENTERO){
            return new Errores("Semantico", "Expresion diferente a entero en arreglo.", this.fila, this.columna);
        }
        value = this.buscarDimensiones(tree, table, expresiones, arreglo[num]);
        return value;
    }

}
