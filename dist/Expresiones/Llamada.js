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
        // validacion si es una asignacion de Struct
        if (resultFunc == null) {
            let resultStruct = tree.getStruct(this.id);
            if (resultStruct != null) {
                return this.ejecutarCreateStruct(table, tree);
            }
        }
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
                        // }else if(expr instanceof Identificador && valueExpr instanceof Array && resultFunc.parameters[count].tipo == TIPO.STRUCT){ // ARRAY
                    }
                    else if (expr instanceof Identificador_1.Identificador && valueExpr instanceof Array) { // ARRAY
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), resultFunc.parameters[count].tipo, true, this.fila, this.columna, valueExpr);
                    }
                    else if (valueExpr instanceof Simbolo_1.Simbolo && valueExpr.tipo == Tipo_1.TIPO.STRUCT && resultFunc.parameters[count].tipo == Tipo_1.TIPO.STRUCT) {
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), resultFunc.parameters[count].tipo, false, this.fila, this.columna, valueExpr.valor);
                        symbol.tipoStruct = resultFunc.parameters[count].tipoStruct;
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
        if (valor instanceof Simbolo_1.Simbolo && valor.tipo == Tipo_1.TIPO.STRUCT) {
            this.tipo = valor.tipo;
            return valor;
        }
        this.tipo = resultFunc.tipo;
        return valor;
    }
    ejecutarCreateStruct(table, tree) {
        // SI NO, ES ASIGNACION CON DECLARACION=
        //1 Obtenemos Struct
        let struct = tree.getStruct(this.id); // Struct
        // console.log(struct);
        if (struct == null) {
            return new Errores_1.Errores("Semantico", "Llamada - Struct " + this.id + ": NO coincide con la busqueda", this.fila, this.columna);
        }
        //2 EJECUTAMOS  STRUCT
        // struct.idSimbolo =this.id;
        let SymbolStructNow = new Simbolo_1.Simbolo(this.id, Tipo_1.TIPO.STRUCT, false, this.fila, this.columna, new TablaSimbolos_1.TablaSimbolos(null));
        // nuevo_simb.tipoStruct = this.id;
        // tree.updateConsolaPrintln(" tamano variables: struct; " + this.variables.length);
        // tree.updateConsolaPrintln(" tamano instruccines: struct; " + this.instructions.length);
        /**
         * GUARDAMOS SIMBOLO STRUCT
         */
        let entornoAttributes = new TablaSimbolos_1.TablaSimbolos(null);
        let varSTemps = [];
        let resultStruct = struct.executeEnvironment(entornoAttributes, tree, varSTemps); // retorna variables
        if (resultStruct instanceof Errores_1.Errores)
            return resultStruct;
        // table.setSymbolTabla(nuevo_simb);
        // 
        // console.log(table.getSymbolTabla(this.id));
        // 2.1 if es nulo, solo declara
        // Ejecutando parametros
        // let SymbolStructNow = table.getSymbolTabla(this.id);
        SymbolStructNow.valor = new TablaSimbolos_1.TablaSimbolos(null);
        SymbolStructNow.valor = entornoAttributes;
        SymbolStructNow.variables = varSTemps;
        // tree.updateConsolaPrintln(`to strinng Struct: ${SymbolStructNow.valor.toStringTable()}`);
        // let newTable = nuevo_simb.getValor();
        // console.log("STRUCTTTTTTTTTTTTTTTTTTTTTTT")
        // console.log(SymbolStructNow)
        // valido tama;o de   parametros parameters de funcion y parametros de llamada
        if (this.parameters.length == SymbolStructNow.variables.length) {
            let count = 0;
            for (let expr of this.parameters) {
                let valueExpr = expr.ejecutar(table, tree);
                if (valueExpr instanceof Errores_1.Errores) {
                    return new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                }
                if (SymbolStructNow.variables[count].tipo == expr.tipo || SymbolStructNow.variables[count].tipo == Tipo_1.TIPO.ANY || expr.tipo == Tipo_1.TIPO.NULO) //Valida Tipos
                 {
                    let symbol;
                    if (SymbolStructNow.variables[count].tipo == Tipo_1.TIPO.ANY) {
                        symbol = new Simbolo_1.Simbolo(String(SymbolStructNow.variables[count].id), expr.tipo, false, this.fila, this.columna, valueExpr); // seteo para variables nativas
                    }
                    else if (SymbolStructNow.variables[count].tipo == Tipo_1.TIPO.STRUCT) {
                        // Dos formas 1: struct intanciado|| null
                        // IF el nuevo parametro es de tipo struct
                        if (expr.tipo == Tipo_1.TIPO.STRUCT && expr.tipoStruct == this.id) {
                            symbol = new Simbolo_1.Simbolo(SymbolStructNow.variables[count].id, Tipo_1.TIPO.STRUCT, false, this.fila, this.columna, valueExpr.valor);
                            symbol.variables = valueExpr.variables;
                            symbol.tipoStruct = this.id;
                        }
                        if (expr.tipo == Tipo_1.TIPO.NULO) {
                            symbol = new Simbolo_1.Simbolo(SymbolStructNow.variables[count].id, Tipo_1.TIPO.STRUCT, false, this.fila, this.columna, null);
                            // symbol.variables = valueExpr.variables;
                            symbol.variables = [];
                            symbol.tipoStruct = this.id;
                        }
                        // symbol = new Simbolo(String(struct.variables[count].id),expr.tipo, true, this.llamada.fila, this.llamada.columna, valueExpr ); // seteo para variables nativas
                    }
                    else {
                        symbol = new Simbolo_1.Simbolo(SymbolStructNow.variables[count].id, SymbolStructNow.variables[count].tipo, false, this.fila, this.columna, valueExpr);
                    }
                    // console.log(struct)
                    // console.log(symbol)
                    let resultTable = SymbolStructNow.valor.updateSymbolTabla(symbol);
                    if (resultTable instanceof Errores_1.Errores)
                        return resultTable;
                }
                else {
                    return new Errores_1.Errores("Semantico", "Verificacion de Tipo de Parametros no coincide", this.fila, this.columna);
                }
                count++;
            }
            // let resultStruct = table.updateSymbolTabla(SymbolStructNow); // Update Struct Actual
            // if (resultStruct instanceof Errores)
            //     return resultStruct
            // return null;
        }
        else {
            console.log(`tam param call: ${this.parameters.length} func ${struct.instructions.length}`);
            return new Errores_1.Errores("Semantico", "Tamaño de Tipo de Parametros no coincide", this.fila, this.columna);
        }
        return SymbolStructNow.valor;
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
