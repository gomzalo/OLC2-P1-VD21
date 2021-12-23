"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
const Retorno_1 = require("./../G3D/Retorno");
const Identificador_1 = require("./Identificador");
const Errores_1 = require("../Ast/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Nodo_1 = require("../Ast/Nodo");
class Llamada {
    /**
     * @class Llamada: Llamada de funciones y structs.
     * @param id ID de la funcion que se esta llamada.
     * @param parameters Parametros enviados.
     * @param fila
     * @param columna
     * @param arreglo Booleano que indica si es un arreglo o no.
     */
    constructor(id, parameters, fila, columna, arreglo = false) {
        this.arreglo = false;
        this.id = id;
        this.parameters = parameters;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = arreglo;
    }
    /**
     * @function ejecutar Interpreta el codigo.
     * @param table
     * @param tree
     * @returns
     */
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
                        // }else if(expr instanceof Identificador && valueExpr instanceof Array && resultFunc.parameters[count].tipo == TIPO.STRUCT){ // ARRAY
                    }
                    else if (expr instanceof Identificador_1.Identificador && valueExpr instanceof Array) { // ARRAY
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
        if (valor instanceof Simbolo_1.Simbolo && valor.tipo == Tipo_1.TIPO.STRUCT) {
            this.tipo = valor.tipo;
            return valor;
        }
        this.tipo = resultFunc.tipo;
        return valor;
    }
    /**
     * @function translate3d Traduce a 3D.
     * @param table
     * @param tree
     */
    translate3d(table, tree) {
        let funcion = tree.getFunction(this.id);
        if (funcion === null || funcion === undefined) {
            let error = new Errores_1.Errores("Semantico", "Verificacion de tipo de parametros no coincide", this.fila, this.columna);
            tree.updateConsolaPrintln(error.toString());
            tree.Errores.push(error);
        }
        let paramValores = new Array();
        let genc3d = tree.generadorC3d;
        let size = genc3d.salvandoTemporales(table);
        this.parameters.forEach((param) => {
            paramValores.push(param.translate3d(table, tree));
        });
        // Comprobando parametros correctos
        let temp = genc3d.newTemp();
        genc3d.freeTemp(temp);
        if (paramValores.length !== 0) {
            genc3d.gen_Exp(temp, 'p', table.size + 1, '+'); //+1 porque la posicion 0 es para el retorno;
            paramValores.forEach((valor, index) => {
                //TODO paso de parametros booleanos
                genc3d.gen_SetStack(temp, valor.translate3d());
                if (index != paramValores.length - 1)
                    genc3d.gen_Exp(temp, temp, '1', '+');
            });
        }
        // const newTabla = new TablaSimbolos(tree.getTSGlobal());
        const newTabla = new TablaSimbolos_1.TablaSimbolos(table);
        const returnLbl = genc3d.newLabel();
        newTabla.setTableFuncion(funcion, returnLbl);
        funcion.parameters.forEach((param) => {
            let newSymbol = new Simbolo_1.Simbolo(param["id"], param["tipo"], false, this.fila, this.columna, null);
            console.log("simbolo en llam:");
            console.log(newSymbol);
            newTabla.setSymbolTabla(newSymbol);
        });
        //genc3d.clearTempStorage();
        genc3d.gen_NextEnv(table.size);
        genc3d.gen_Call(funcion.id);
        genc3d.gen_GetStack(temp, 'p');
        genc3d.gen_AntEnv(table.size);
        genc3d.recuperandoTemporales(table, size);
        genc3d.gen_Temp(temp);
        if (funcion.tipo !== Tipo_1.TIPO.BOOLEANO)
            return new Retorno_1.Retorno(temp, true, funcion.tipo, null, newTabla, tree);
        const retorno = new Retorno_1.Retorno('', true, funcion.tipo, null, newTabla, tree);
        this.lblTrue = this.lblTrue == '' ? genc3d.newLabel() : this.lblTrue;
        this.lblFalse = this.lblFalse == '' ? genc3d.newLabel() : this.lblFalse;
        genc3d.gen_If(temp, '1', '==', this.lblTrue);
        genc3d.gen_Goto(this.lblFalse);
        retorno.lblTrue = this.lblTrue;
        retorno.lblFalse = this.lblFalse;
        return retorno;
    }
    /**
     * @function recorrer Recorre el AST.
     * @param table
     * @param tree
     * @returns
     */
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
