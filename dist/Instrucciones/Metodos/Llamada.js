"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
const Errores_1 = require("../../Ast/Errores");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Llamada {
    constructor(id, parameters, fila, columna, arreglo = false) {
        this.id = id;
        this.parameters = parameters;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = arreglo;
    }
    ejecutar(table, tree) {
        let resultFunc = tree.getFunction(this.id);
        if (resultFunc == null) {
            return new Errores_1.Errores("Semantico", "Funcion no encontrada en asignacion", this.fila, this.columna);
        }
        // Ejecutando parametros
        let newTable = new TablaSimbolos_1.TablaSimbolos(table);
        // valido tama;o de   parametros parameters de funcion y parametros de llamada
        if (this.parameters.length == resultFunc.parameters.length) {
            let count = 0;
            for (let expr of this.parameters) {
                let valueExpr = expr.ejecutar(table, tree);
                if (valueExpr instanceof Errores_1.Errores) {
                    return new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                }
                if (resultFunc.parameters[count].tipo == expr.tipo || resultFunc.parameters[count].tipo == Tipo_1.TIPO.ANY) //Valida Tipos
                 {
                    let symbol;
                    if (resultFunc.parameters[count].tipo == Tipo_1.TIPO.ANY) {
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), expr.tipo, this.arreglo, this.fila, this.columna, valueExpr); // seteo para variables nativas
                    }
                    else {
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), resultFunc.parameters[count].tipo, this.arreglo, this.fila, this.columna, valueExpr);
                    }
                    let resultTable = newTable.setSymbolTabla(symbol);
                    if (resultTable instanceof Errores_1.Errores)
                        return resultTable;
                }
                else {
                    return new Errores_1.Errores("Semantico", "Verificacion de Tipo de Parametros no coincide", this.fila, this.columna);
                }
                count++;
            }
        }
        else {
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Llamada = Llamada;
