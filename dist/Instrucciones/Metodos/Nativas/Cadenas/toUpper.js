"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUpper = void 0;
const subString_1 = require("./subString");
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
class toUpper {
    /**
     * @function toUpperCase Una cadena puede ser convertida a mayusculas con la utilización de la función cadena.toUppercase())
java animal = "Tigre"; println(animal.toUppercase()); //TIGRE
     * @param id ID de la variable, tipo cadena, a convertir a mayusculas.
     * @param fila
     * @param columna
     */
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("push id: " + this.id.id);
        // console.log(this.id);
        if (this.id instanceof subString_1.subString) {
            // console.log("toupp subs");
            let cadena_primitivo = this.id.ejecutar(table, tree);
            if (typeof cadena_primitivo == "string") {
                this.tipo = Tipo_1.TIPO.CADENA;
                if (cadena_primitivo.length > 0) {
                    return cadena_primitivo.toUpperCase();
                }
                else {
                    return new Errores_1.Errores("Semantico", `La cadena con valor: '${this.id}' es vacia.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa 'toUppercase' no puede utilizase en valor '${this.id}', porque no es una cadena.`, this.fila, this.columna);
            }
        }
        else {
            let cadena = table.getSymbolTabla(this.id);
            if (cadena != null) {
                if (cadena.getTipo() == Tipo_1.TIPO.CADENA && !cadena.getArreglo()) {
                    this.tipo = cadena.getTipo();
                    if (cadena.getValor().length > 0) {
                        return cadena.getValor().toUpperCase();
                    }
                    else {
                        return new Errores_1.Errores("Semantico", `La cadena en la variable con ID: '${this.id}' es vacia.`, this.fila, this.columna);
                    }
                }
                else {
                    return new Errores_1.Errores("Semantico", `Nativa 'toUppercase' no puede utilizase en variable con ID '${this.id}', porque no es una cadena.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `La variable con ID '${this.id}', no existe.`, this.fila, this.columna);
            }
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented TOUPP.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("toLower", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}
exports.toUpper = toUpper;
