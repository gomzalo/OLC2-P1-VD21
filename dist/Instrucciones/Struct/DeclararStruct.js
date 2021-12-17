"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclararStruct = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Llamada_1 = require("../../Expresiones/Llamada");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DeclararStruct {
    constructor(tipoStruct, id, llamada, fila, columna) {
        this.tipo = Tipo_1.TIPO.STRUCT;
        this.tipoStruct = tipoStruct; // Estudiante
        this.id = id; // variableID  
        this.fila = fila;
        this.columna = columna;
        this.llamada = llamada;
    }
    ejecutar(table, tree) {
        // Validamos si solo es declaracion sin INSTANCIAR =
        if (this.llamada == null) {
            let nuevo_simb = new Simbolo_1.Simbolo(this.id, Tipo_1.TIPO.STRUCT, false, this.fila, this.columna, null);
            nuevo_simb.tipoStruct = this.tipoStruct;
            nuevo_simb.variables = [];
            let resultStruct = table.setSymbolTabla(nuevo_simb);
            if (resultStruct instanceof Errores_1.Errores)
                return resultStruct;
            return null;
        }
        else {
            // SI NO, ES ASIGNACION CON DECLARACION=
            //1 Obtenemos Struct
            let struct = tree.getStruct(this.tipoStruct); // Struct
            // console.log(struct);
            if (struct == null) {
                return new Errores_1.Errores("Semantico", "Struct " + this.tipoStruct + ": NO coincide con la busqueda", this.fila, this.columna);
            }
            //2 EJECUTAMOS  STRUCT
            // struct.idSimbolo =this.id;
            let nuevo_simb = new Simbolo_1.Simbolo(this.id, Tipo_1.TIPO.STRUCT, false, this.fila, this.columna, new TablaSimbolos_1.TablaSimbolos(null));
            nuevo_simb.tipoStruct = this.tipoStruct;
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
            table.setSymbolTabla(nuevo_simb);
            // 
            // console.log(table.getSymbolTabla(this.id));
            // 2.1 if es nulo, solo declara
            if (!(this.llamada instanceof Llamada_1.Llamada))
                return new Errores_1.Errores("Semantico", "Struct  " + this.tipoStruct + ": Expresion no es de tipo Llamada", this.fila, this.columna);
            // Ejecutando parametros
            let SymbolStructNow = table.getSymbolTabla(this.id);
            SymbolStructNow.valor = new TablaSimbolos_1.TablaSimbolos(null);
            SymbolStructNow.valor = entornoAttributes;
            SymbolStructNow.variables = varSTemps;
            // tree.updateConsolaPrintln(`to strinng Struct: ${SymbolStructNow.valor.toStringTable()}`);
            // let newTable = nuevo_simb.getValor();
            // console.log("STRUCTTTTTTTTTTTTTTTTTTTTTTT")
            // console.log(SymbolStructNow)
            // valido tama;o de   parametros parameters de funcion y parametros de llamada
            if (this.llamada.parameters.length == SymbolStructNow.variables.length) {
                let count = 0;
                for (let expr of this.llamada.parameters) {
                    let valueExpr = expr.ejecutar(table, tree);
                    if (valueExpr instanceof Errores_1.Errores) {
                        return new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.llamada.fila, this.llamada.columna);
                    }
                    if (SymbolStructNow.variables[count].tipo == expr.tipo || SymbolStructNow.variables[count].tipo == Tipo_1.TIPO.ANY || expr.tipo == Tipo_1.TIPO.NULO) //Valida Tipos
                     {
                        let symbol;
                        if (SymbolStructNow.variables[count].tipo == Tipo_1.TIPO.ANY) {
                            symbol = new Simbolo_1.Simbolo(String(SymbolStructNow.variables[count].id), expr.tipo, false, this.llamada.fila, this.llamada.columna, valueExpr); // seteo para variables nativas
                        }
                        else if (SymbolStructNow.variables[count].tipo == Tipo_1.TIPO.STRUCT) {
                            // Dos formas 1: struct intanciado|| null
                            // IF el nuevo parametro es de tipo struct
                            if (expr.tipo == Tipo_1.TIPO.STRUCT && expr.tipoStruct == this.tipoStruct) {
                                symbol = new Simbolo_1.Simbolo(SymbolStructNow.variables[count].id, Tipo_1.TIPO.STRUCT, false, this.llamada.fila, this.llamada.columna, valueExpr.valor);
                                symbol.variables = valueExpr.variables;
                                symbol.tipoStruct = this.tipoStruct;
                            }
                            if (expr.tipo == Tipo_1.TIPO.NULO) {
                                symbol = new Simbolo_1.Simbolo(SymbolStructNow.variables[count].id, Tipo_1.TIPO.STRUCT, false, this.llamada.fila, this.llamada.columna, null);
                                // symbol.variables = valueExpr.variables;
                                symbol.variables = [];
                                symbol.tipoStruct = this.tipoStruct;
                            }
                            // symbol = new Simbolo(String(struct.variables[count].id),expr.tipo, true, this.llamada.fila, this.llamada.columna, valueExpr ); // seteo para variables nativas
                        }
                        else {
                            symbol = new Simbolo_1.Simbolo(SymbolStructNow.variables[count].id, SymbolStructNow.variables[count].tipo, false, this.llamada.fila, this.llamada.columna, valueExpr);
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
                console.log(`tam param call: ${this.llamada.parameters.length} func ${struct.instructions.length}`);
                return new Errores_1.Errores("Semantico", "Tamaño de Tipo de Parametros no coincide", this.fila, this.columna);
            }
        }
    }
    getTipoStruct() {
        throw new Error("Method not implemented DECLSTRC.");
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented DECLSTRC.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("DECLARAR STRUCT", "");
        let tipoStruct = new Nodo_1.Nodo("TIPO STRUCT", "");
        tipoStruct.addChildNode(new Nodo_1.Nodo(this.tipoStruct, ""));
        padre.addChildNode(tipoStruct);
        padre.addChildNode(this.llamada.recorrer(table, tree));
        return padre;
    }
}
exports.DeclararStruct = DeclararStruct;
