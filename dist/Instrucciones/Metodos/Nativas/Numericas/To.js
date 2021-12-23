"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.To = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
class To {
    /**
     * @function To Metodo para castear Enteros a Float y viceversa.
     * @param tipo_conversion toInt | toDouble
     * @param parameters Parametros a castear
     * @param fila
     * @param columna
     */
    constructor(tipo_conversion, parameters, fila, columna) {
        this.tipo_conversion = tipo_conversion;
        this.parameters = parameters;
        this.fila = fila;
        this.columna = columna;
    }
    /**
     *
     * @param table
     * @param tree
     * @returns Valores casteados
     */
    ejecutar(table, tree) {
        // console.log("parse params: " + this.parameters);
        let valor = this.parameters.ejecutar(table, tree);
        // console.log("parse valor: " + this.parameters.tipo);
        if (valor != null) {
            if (!isNaN(valor)) {
                switch (this.tipo_conversion) {
                    case "toInt":
                        try {
                            this.tipo = Tipo_1.TIPO.ENTERO;
                            return parseInt(valor);
                        }
                        catch (error) {
                            return new Errores_1.Errores("Semantico", `No fue posible castear a entero el valor '${valor.toString()}'.`, this.fila, this.columna);
                        }
                    case "toDouble":
                        try {
                            this.tipo = Tipo_1.TIPO.DECIMAL;
                            return parseFloat(valor);
                        }
                        catch (error) {
                            return new Errores_1.Errores("Semantico", `No fue posible castear a double el valor '${valor.toString()}'.`, this.fila, this.columna);
                        }
                    default:
                        return new Errores_1.Errores("Semantico", `No fue posible castear el valor '${valor.toString()}'.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa '${this.tipo_conversion}' no puede utilizarse, porque no es un numero.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `Valor invalido.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented TO_CONV.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("toLower", "");
        padre.addChildNode(new Nodo_1.Nodo(this.tipo_conversion.toString(), ""));
        padre.addChildNode(this.parameters.recorrer(table, tree));
        return padre;
    }
}
exports.To = To;
