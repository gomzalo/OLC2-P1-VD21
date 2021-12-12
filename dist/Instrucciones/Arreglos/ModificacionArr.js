"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModificacionArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class ModificacionArr {
    //ID lista_exp IGUAL expr
    constructor(id, expresiones, valor, fila, columna) {
        this.arreglo = true;
        this.id = id;
        this.expresiones = expresiones;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let value = this.valor.ejecutar(table, tree);
        if (value instanceof Errores_1.Errores) {
            return value;
        }
        let simbolo = table.getSymbolTabla(this.id.toString());
        if (simbolo != null) {
            if (simbolo.getArreglo()) {
                if (simbolo.getTipo() != this.valor.tipo) {
                    return new Errores_1.Errores("Semantico", "Tipos de datos diferentes en modificacion de arreglo: \'" + this.id + "\'.", this.fila, this.columna);
                }
                console.log("modArr simb.tipo: " + simbolo.getTipo());
                this.tipo_arr = simbolo.getTipo();
                let result = this.modificarDimensiones(table, tree, this.expresiones, simbolo.getValor(), value); // Devuelve el arreglo de dimensiones
                if (result instanceof Errores_1.Errores) {
                    return result;
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", "Variable: \'" + this.id.toString() + "\', no encontrada.", this.fila, this.columna);
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
    modificarDimensiones(table, tree, expresiones, arreglo, valor) {
        let value = null;
        if (expresiones.length == 0) {
            if (arreglo instanceof Array) {
                return new Errores_1.Errores("Semantico", "Modificacion de arreglo incompleto.", this.fila, this.columna);
            }
            return valor;
        }
        if (!(arreglo instanceof Array)) {
            return new Errores_1.Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        let exp_tmp = expresiones.pop();
        let num = exp_tmp.ejecutar(table, tree);
        if (num instanceof Errores_1.Errores) {
            return num;
        }
        if (exp_tmp.tipo != Tipo_1.TIPO.ENTERO) {
            return new Errores_1.Errores("Semantico", "Expresion diferente a entero en arreglo.", this.fila, this.columna);
        }
        console.log("modArr exp: " + valor);
        console.log("modArr tipo exp: " + this.valor.tipo);
        if (this.valor.tipo != this.tipo_arr) {
            // console.log("Tipo distinto al tipo del arreglo");
            // console.log(tree);
            let res = new Errores_1.Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
            tree.Errores.push(res);
            tree.updateConsolaPrintln(res.toString());
        }
        else {
            value = this.modificarDimensiones(tree, table, expresiones, arreglo[num], valor);
            if (value instanceof Errores_1.Errores) {
                return value;
            }
            if (value != null) {
                arreglo[num] = value;
            }
        }
        return null;
    }
}
exports.ModificacionArr = ModificacionArr;
