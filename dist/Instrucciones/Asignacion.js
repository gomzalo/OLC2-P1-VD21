"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
const Retorno_1 = require("../G3D/Retorno");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Return_1 = require("./Transferencia/Return");
class Asignacion {
    constructor(id, expresion, fila, columna) {
        this.arreglo = false;
        this.id = id;
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (table.existe(this.id)) {
            let valor = this.expresion.ejecutar(table, tree);
            // console.log(valor)
            if (valor instanceof Errores_1.Errores) {
                return valor;
            }
            if (valor instanceof Return_1.Return) {
                let temp;
                temp = valor;
                // // validacion struct
                /**
                 * Agregar struct y arreglos aca
                 */
                // if (temp.valor instanceof Struct){
                // }
                valor = temp.valor;
            }
            /**
             * Agregar struct y arreglos aca
             */
            // console.log(`Existe id: ${this.id} ${table.existe(this.id)}`);
<<<<<<< HEAD
            let getSym = table.getSymbolTabla(this.id);
            let update = new Simbolo_1.Simbolo(this.id, this.expresion.tipo, null, this.fila, this.columna, valor);
            if (getSym != null) {
                update.tipoStruct = getSym.tipoStruct;
                update.variables = getSym.variables;
                update.tipo = getSym.tipo;
                update.arreglo = getSym.arreglo;
            }
            let result = table.updateSymbolTabla(update);
=======
            let result = table.updateSymbolTabla(new Simbolo_1.Simbolo(this.id, this.expresion.tipo, this.arreglo, this.fila, this.columna, valor));
>>>>>>> develop
            if (result instanceof Errores_1.Errores) {
                // console.log(result);
                // console.log(`tipoo exp: ${this.expresion.tipo} `)
                // console.log(`error en updateSymbol ${this.id} `)
                return result;
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `Variable con ID: "${this.id}", no encontrada en asignacion.`, this.fila, this.columna);
        }
        return null;
    }
    translate3d(table, tree) {
        let genc3d = tree.generadorC3d;
        genc3d.gen_Comment("----------- ASIGNANDO ----------");
        if (table.existe(this.id)) {
            console.log("asignacion");
            console.log(this.id);
            let varSymb = table.getSymbolTabla(this.id);
            if (varSymb == null) {
                let error = new Errores_1.Errores("C3D ", `Asignacion, variable con ID: "${this.id}", no se encontro.`, this.fila, this.columna);
                ;
                tree.updateConsolaPrintln(error.toString());
                tree.Errores.push(error);
                return error;
            }
            let retActual;
            if (varSymb.isGlobal) {
                retActual = new Retorno_1.Retorno(String(varSymb.posicion), false, varSymb.tipo, varSymb);
            }
            else {
                const temp = genc3d.newTemp();
                genc3d.gen_Exp(temp, 'p', varSymb.posicion, '+');
                retActual = new Retorno_1.Retorno(temp, true, varSymb.tipo, varSymb);
            }
            //obteniendo resultado
            let valorExp = this.expresion.translate3d(table, tree);
            if (varSymb.tipo === Tipo_1.TIPO.ENTERO && valorExp.tipo === Tipo_1.TIPO.DECIMAL)
                varSymb.tipo = valorExp.tipo;
            // if(varSymb?.inHeap || varSymb?.isGlobal){
            if (varSymb === null || varSymb === void 0 ? void 0 : varSymb.inHeap) {
                if (varSymb.tipo == Tipo_1.TIPO.BOOLEANO) {
                    let templabel = genc3d.newLabel();
                    genc3d.gen_Label(valorExp.lblTrue);
                    genc3d.gen_SetHeap(retActual.valor, '1');
                    genc3d.gen_Goto(templabel);
                    genc3d.gen_Label(valorExp.lblFalse);
                    genc3d.gen_SetHeap(retActual.valor, '0');
                    genc3d.gen_Label(templabel);
                }
                else {
                    genc3d.gen_SetHeap(retActual.valor, valorExp.valor);
                    table.updateSymbolTabla(new Simbolo_1.Simbolo(this.id, this.expresion.tipo, this.arreglo, this.fila, this.columna, valorExp.valor));
                }
            }
            else {
                if (varSymb.tipo == Tipo_1.TIPO.BOOLEANO) {
                    const templabel = genc3d.newLabel();
                    genc3d.gen_Label(valorExp.lblTrue);
                    genc3d.gen_SetStack(retActual.valor, '1');
                    genc3d.gen_Goto(templabel);
                    genc3d.gen_Label(valorExp.lblFalse);
                    genc3d.gen_SetStack(retActual.valor, '0');
                    genc3d.gen_Label(templabel);
                }
                else {
                    genc3d.gen_SetStack(retActual.valor, valorExp.valor);
                    table.updateSymbolTabla(new Simbolo_1.Simbolo(this.id, this.expresion.tipo, this.arreglo, this.fila, this.columna, valorExp.valor));
                }
            }
        }
        else {
            let error = new Errores_1.Errores("C3D ", `Asignacion, variable con ID: "${this.id}", no se encontro.`, this.fila, this.columna);
            ;
            tree.updateConsolaPrintln(error.toString());
            tree.Errores.push(error);
            return error;
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("ASIGNACION", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        padre.addChildNode(this.expresion.recorrer(table, tree));
        return padre;
    }
}
exports.Asignacion = Asignacion;
