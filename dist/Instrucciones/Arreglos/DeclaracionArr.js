"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DeclaracionArr {
<<<<<<< Updated upstream
    constructor(tipo, simbolos, fila, columna) {
        this.arreglo = false;
        // this.id = id;
        this.tipo = tipo;
        this.simbolos = simbolos;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = false;
    }
    ejecutar(table, tree) {
        for (let simbolo of this.simbolos) {
            let variable = simbolo;
            // console.log(variable.id)
            if (variable.valor != null) {
                let valor = variable.valor.ejecutar(table, tree);
                //Verificando TIPOS de Variable
                let tipo_valor = variable.valor.tipo;
                if (valor instanceof Errores_1.Errores) {
                    return valor;
                }
                if (tipo_valor == this.tipo) {
                    console.log("entree tipo declaracion");
                    //--> Lo agregamos a la tabla de simbolos 
                    let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, valor);
                    table.setSymbolTabla(nuevo_simb);
                }
                else {
                    // console.log("errorrr tipo declaracion");
                    // console.log("tipo actual: " + tipo_valor + " tipo var es: " + this.tipo)
                    //Error no se puede declarar por incopatibilidad de simbolos
                    return new Errores_1.Errores("Semantico", "Declaracion " + variable.id + " -No coincide el tipo", simbolo.getFila(), simbolo.getColumna());
                }
            }
            else {
                //-- DECLARACION 1ERA VEZ -Se agrega a la tabla de simbolos 
                let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, null);
                switch (this.tipo) {
                    case Tipo_1.TIPO.ENTERO:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, 0);
                        break;
                    case Tipo_1.TIPO.DECIMAL:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, 0.00);
                        break;
                    case Tipo_1.TIPO.CADENA:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, null);
                        break;
                    case Tipo_1.TIPO.BOOLEANO:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, false);
                        break;
                    case Tipo_1.TIPO.CHARACTER:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, '0');
                        break;
                    default:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, null);
                        break;
                }
                table.setSymbolTabla(nuevo_simb);
            }
        }
=======
    constructor(tipo_arr, dimensiones, id, expresiones, fila, columna) {
        this.tipo = Tipo_1.TIPO.ARREGLO;
        this.arreglo = true;
        this.arr = [];
        this.tipo_arr = tipo_arr;
        this.dimensiones = dimensiones;
        this.id = id;
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // Verificando dimensiones
        if (this.dimensiones != this.dimensiones.length) {
            return new Errores_1.Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
        }
        // Creando arreglo
        this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
        let value = this.arr;
        console.log("value declArr: " + value);
        if (value instanceof Errores_1.Errores) {
            return value;
        }
        let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo_arr, null, this.fila, this.columna, value);
        let result = table.setSymbolTabla(nuevo_simb);
        if (result instanceof Errores_1.Errores) {
            return result;
        }
        return null;
>>>>>>> Stashed changes
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
<<<<<<< Updated upstream
=======
    crearDimensiones(table, tree, expresiones) {
        if (expresiones.length == 0) {
            return;
        }
        else {
            console.log("entro crearD");
            let dimension = expresiones.pop();
            // alert("expr crearD arr: " + expresiones);
            // alert("expr crearD arr size: " + expresiones.length);
            let num = dimension.ejecutar(table, tree);
            this.arr.push(num);
            // alert("num arr: " + num);
            // if(num instanceof Errores){
            //     return num;
            // }
            // if(expresiones > 0){
            this.crearDimensiones(tree, table, expresiones.slice());
            // }s
        }
        // return this.arr;
    }
>>>>>>> Stashed changes
}
exports.DeclaracionArr = DeclaracionArr;
