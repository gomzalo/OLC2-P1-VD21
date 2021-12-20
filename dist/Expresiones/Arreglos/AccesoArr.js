"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoArr = void 0;
const Identificador_1 = require("./../Identificador");
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Rango_1 = require("./Rango");
class AccesoArr {
    /**
     * @function AccesoArr
     * @param id Identificador del arreglo que se desea acceder
     * @param expresiones Index o Rango que se desea obtener
     * @param fila Numero de fila
     * @param columna Numero de columna
     */
    constructor(id, expresiones, fila, columna) {
        this.id = id;
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (this.expresiones instanceof AccesoArr) {
            return this.expresiones.ejecutar(table, tree);
        }
        let simbolo = table.getSymbolTabla(this.id);
        if (simbolo == null) {
            return new Errores_1.Errores("Semantico", "No se encontro la variable " + this.id + ".", this.fila, this.columna);
        }
        // this.tipo = simbolo.getTipo();
        if (!simbolo.getArreglo()) {
            return new Errores_1.Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
        }
        this.tipo = simbolo.getTipo();
        // console.log("this.tipo: " + this.tipo);
        // console.log("AccArr exp val: ");
        // console.log(this.expresiones);
        // console.log("AccArr exp size: " + this.expresiones[0].length);
        // console.log("AccArr exp type: " + (this.expresiones[0].tipo));
        if (this.expresiones[0] instanceof Rango_1.Rango) {
            // console.log("AccArr RANK");
            // console.log("TIPO acc: " + this.tipo);
            let rank = this.expresiones[0].ejecutar(table, tree);
            // console.log("AccArr rank type: " + (rank instanceof Array));
            // console.log("rank[0] type: " + (typeof(rank[0]) == "string"));
            // console.log("rank accArr: " + rank);
            if (rank == null) {
                return new Errores_1.Errores("Semantico", "La variable \'" + this.id + "\', no es un rango.", this.fila, this.columna);
            }
            let begin;
            if (rank[0] == "begin") {
                begin = 0;
            }
            else {
                begin = rank[0].ejecutar(table, tree);
            }
            if (begin instanceof Errores_1.Errores) {
                return begin;
            }
            let end;
            if (rank[1] == "end") {
                end = simbolo.getValor().length;
            }
            else {
                end = rank[1].ejecutar(table, tree);
            }
            if (end instanceof Errores_1.Errores) {
                return end;
            }
            // console.log("begin: " + begin);
            // console.log("end: " + end);
            let array = [];
            let contador = begin;
            while (contador <= end) {
                array.push(simbolo.getValor()[contador]);
                contador++;
            }
            return array;
        }
        else {
            // console.log("AccArr NOT RANK");
            // console.log("-----------AccArr exp val-----------");
            // console.log(this.expresiones);
            // console.log("AccArr exp size: " + this.expresiones.length);
            // 
            // console.log("val acc arr: " + value);
            // TEST
            let value;
            if (this.expresiones.length == 1) {
                let indice;
                if (this.expresiones[0] instanceof Identificador_1.Identificador) {
                    // console.log("id");
                    // console.log(this.expresiones[0].id);
                    let simbolo_iterador = table.getSymbolTabla(this.expresiones[0].id);
                    if (simbolo_iterador == null) {
                        return new Errores_1.Errores("Semantico", "No se encontro la variable " + this.expresiones[0].id + ".", this.fila, this.columna);
                    }
                    indice = simbolo_iterador.valor;
                }
                else {
                    indice = this.expresiones[0].ejecutar(table, tree);
                    // if (indice.tipo !== TIPO.ENTERO){
                    //     return new Errores('Semantico', `Indice no es un entero`, this.fila, this.columna);
                    // }
                }
                if (!Number.isInteger(indice)) {
                    return new Errores_1.Errores('Semantico', `Indice no es un entero`, this.fila, this.columna);
                }
                console.log("indice: " + indice + " simbolo.getValor().length " + simbolo.getValor().length);
                // console.log(indice);
                // console.log("simbolo.getValor().length");
                // console.log(simbolo.getValor().length);
                if (indice >= (simbolo.getValor().length)) {
                    console.log("rank out of index");
                    return new Errores_1.Errores('Semantico', `Indice ${indice}, no existe en arreglo.`, this.fila, this.columna);
                }
                else {
                    console.log(indice);
                    return simbolo.getValor()[indice];
                }
                // for(let i = 0; i < simbolo.getValor().length; i++){
                //     if(indice == i){
                //         return simbolo.getValor()[i];
                //     }
                // }
            }
            else {
                value = this.buscarDimensiones(table, tree, this.expresiones, simbolo.getValor());
                return value;
            }
            // if(value instanceof Errores){
            //     return value;
            // }
            // if(!isNaN(value)){
            //     return parseInt(value);
            // }
            // return "value";
            // if(value instanceof Array){
            //     return new Errores("Semantico", "Acceso a arreglo incompleto.", this.fila, this.columna);
            // }
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented ACCARR.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Acceso ARR", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
    buscarDimensiones(table, tree, expresiones, arreglo) {
        // let value = null;
        if (expresiones.length == 0) {
            return arreglo;
        }
        if (!(arreglo instanceof Array)) {
            return new Errores_1.Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        // Obteniendo las dimensiones
        let dimension = expresiones.shift();
        // console.log("accArr exp: " + expresiones);
        // Posicion en dimension
        // console.log("accArr num dim: " + num);
        // console.log("accArr arr: " + arreglo);
        // if(num instanceof Errores){
        //     return num;
        // }
        // console.log("dimension");
        // console.log(dimension);
        let num;
        if (dimension instanceof Identificador_1.Identificador) {
            // console.log("dimension es id");
            // console.log(dimension.id);
            let simbolo_iterador = table.getSymbolTabla(dimension.id);
            if (simbolo_iterador == null) {
                return new Errores_1.Errores("Semantico", "No se encontro la variable " + dimension.id + ".", this.fila, this.columna);
            }
            num = simbolo_iterador.valor;
            // console.log("dimension val");
            // console.log(simbolo_iterador);
            // console.log(simbolo_iterador.valor);
        }
        else {
            // console.log("dimension no es id");
            // console.log(dimension);
            num = dimension.ejecutar(table, tree);
        }
        if (dimension.tipo != Tipo_1.TIPO.ENTERO && !(dimension instanceof Identificador_1.Identificador)) {
            return new Errores_1.Errores("Semantico", "Expresion diferente a entero en arreglo.", this.fila, this.columna);
        }
        if (!isNaN(arreglo[num])) {
            // console.log("aaaaaaaa");
            // this.tipo = arreglo[num].tipo;
            // console.log("TIPO acc: " + this.tipo);
            return arreglo[num];
        }
        // console.log("arreglo[num]: " + arreglo[num]);
        if (arreglo[num] != undefined || arreglo[num] != null) {
            // console.log("no null");
            // this.tipo = arreglo[num].tipo;
            // console.log("TIPO acc: " + this.tipo);
            // if(expresiones == null || expresiones == undefined){
            //     return arreglo[num];
            // }
            if (this.tipo == Tipo_1.TIPO.CADENA) {
                return this.buscarDimensiones(tree, table, expresiones.slice(), arreglo[num]);
            }
            else {
                // console.log("no str");
                return this.buscarDimensiones(tree, table, expresiones.slice(), arreglo[num][0]);
            }
        }
        else {
            // console.log("null");
            return new Errores_1.Errores("Semantico", `Posicion "${num}", inexistente en el arreglo.`, this.fila, this.columna);
        }
    }
}
exports.AccesoArr = AccesoArr;
