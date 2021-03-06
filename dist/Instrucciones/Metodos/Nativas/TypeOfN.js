"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOfN = void 0;
const Errores_1 = require("../../../Ast/Errores");
const Nodo_1 = require("../../../Ast/Nodo");
const Tipo_1 = require("../../../TablaSimbolos/Tipo");
class TypeOfN {
    /**
     * @function typeof Muestra el tipo del argumento.
     * @param expresion Argumento del que se quiere saber el tipo.
     * @param fila
     * @param columna
     */
    constructor(expresion, fila, columna) {
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (this.expresion instanceof Array) {
            return "array";
        }
        else {
            let valor = this.expresion.ejecutar(table, tree);
            // console.log("pop type: " + valor.tipo);
            if (valor != null) {
                this.tipo = valor.tipo;
                return this.getTipo(this.expresion.tipo);
            }
            else {
                return new Errores_1.Errores("Semantico", `Valor nulo.`, this.fila, this.columna);
            }
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented TYPEOF.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("TypeOfN", "");
        // padre.addChildNode(new Nodo(this.id,""));
        if (this.expresion instanceof Array) {
            padre.addChildNode(new Nodo_1.Nodo("array", ""));
        }
        else {
            padre.addChildNode(this.expresion.recorrer(table, tree));
        }
        return padre;
    }
    getTipo(tipo) {
        switch (tipo) {
            case Tipo_1.TIPO.CADENA:
                return "String";
            case Tipo_1.TIPO.ENTERO:
                return "int";
            case Tipo_1.TIPO.DECIMAL:
                return "double";
            case Tipo_1.TIPO.BOOLEANO:
                return "boolean";
            case Tipo_1.TIPO.CHARACTER:
                return "char";
            case Tipo_1.TIPO.ARREGLO:
                return "array";
            case Tipo_1.TIPO.STRUCT:
                return "struct";
            case Tipo_1.TIPO.RANGO:
                return "rango";
            case Tipo_1.TIPO.NULO:
                return "null";
            default:
                return "invalido";
        }
    }
}
exports.TypeOfN = TypeOfN;
