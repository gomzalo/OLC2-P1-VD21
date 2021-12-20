"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
const Identificador_1 = require("./Identificador");
const Errores_1 = require("../Ast/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Nodo_1 = require("../Ast/Nodo");
class Llamada {
    constructor(id, parameters, fila, columna, arreglo = false) {
        this.arreglo = false;
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
        let newTable = new TablaSimbolos_1.TablaSimbolos(tree.getTSGlobal());
        // valido tama;o de   parametros parameters de funcion y parametros de llamada
        if (this.parameters.length == resultFunc.parameters.length) {
            let count = 0;
            for (let expr of this.parameters) {
                let valueExpr = expr.ejecutar(table, tree);
                // console.log("expr: ");
                // console.log(expr);
                // console.log("valueExpr: " + valueExpr);
                // console.log("resultFunc.parameters[count]: ");
                // console.log(resultFunc.parameters[count]);
                if (valueExpr instanceof Errores_1.Errores) {
                    return new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                }
                if (resultFunc.parameters[count].tipo == expr.tipo || resultFunc.parameters[count].tipo == Tipo_1.TIPO.ANY || (expr instanceof Identificador_1.Identificador && expr.symbol.arreglo)
                    || typeof valueExpr == "number") //Valida Tipos
                 {
                    let symbol;
                    // console.log(resultFunc.parameters[count]);
                    if (resultFunc.parameters[count].tipo == Tipo_1.TIPO.ANY) {
                        // alert("valexp ll: " + valueExpr);
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), expr.tipo, this.arreglo, this.fila, this.columna, valueExpr); // seteo para variables nativas
                    }
                    else if (expr instanceof Identificador_1.Identificador && valueExpr instanceof Array && resultFunc.parameters[count].tipo == Tipo_1.TIPO.STRUCT) { // ARRAY
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), resultFunc.parameters[count].tipo, true, this.fila, this.columna, valueExpr);
                    }
                    else if (valueExpr instanceof Simbolo_1.Simbolo && valueExpr.tipo == Tipo_1.TIPO.STRUCT && resultFunc.parameters[count].tipo == Tipo_1.TIPO.STRUCT) {
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), resultFunc.parameters[count].tipo, false, this.fila, this.columna, valueExpr.valor);
                        symbol.tipoStruct = valueExpr.tipo;
                    }
                    else {
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), resultFunc.parameters[count].tipo, this.arreglo, this.fila, this.columna, valueExpr);
                        if (!Number.isInteger(valueExpr) && symbol.tipo == Tipo_1.TIPO.DECIMAL) {
                            symbol.valor = Math.round(symbol.valor);
                        }
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
            console.log(`tam param call: ${this.parameters.length} func ${resultFunc.parameters.length}`);
            return new Errores_1.Errores("Semantico", "Tamaño de Tipo de Parametros no coincide", this.fila, this.columna);
        }
        let valor = resultFunc.ejecutar(newTable, tree);
        if (valor instanceof Errores_1.Errores) {
            return valor;
        }
        this.tipo = resultFunc.tipo;
        return valor;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented LLAMADA.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("LLAMADA FUNCION", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id.toString(), ""));
        let params = new Nodo_1.Nodo("PARAMETROS", "");
        for (let param of this.parameters) {
            params.addChildNode(new Nodo_1.Nodo(param.id, ""));
        }
        padre.addChildNode(params);
        return padre;
    }
}
exports.Llamada = Llamada;
