"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
class Funcion {
    constructor(id, tipo, parameters, instructions, fila, columna) {
        this.tipo = tipo;
        this.id = id;
        this.parameters = parameters;
        this.instructions = instructions;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let newTable = new TablaSimbolos_1.TablaSimbolos(table);
        if (this.instructions.length > 0) {
            for (let instr of this.instructions) {
                let result = instr.ejecutar(newTable, tree);
                if (result instanceof Errores_1.Errores) {
                    tree.getErrores().push(result);
                    tree.updateConsolaPrintln(result.toString());
                }
                if (result instanceof Break_1.Detener) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                    tree.getErrores().push(error);
                    tree.updateConsolaPrintln(error.toString());
                }
                if (result instanceof Continuar_1.Continuar) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo", this.fila, this.columna);
                    tree.getErrores().push(error);
                    tree.updateConsolaPrintln(error.toString());
                }
                if (result instanceof Return_1.Return) {
                    this.tipo = result.tipo;
                    return result.valor;
                }
            }
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("FUNCION", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        let params = new Nodo_1.Nodo("PARAMETROS", "");
        for (let par of this.parameters) {
            let parametro = new Nodo_1.Nodo("PARAMETRO", "");
            parametro.addChildNode(par["tipo"]);
            parametro.addChildNode(par["id"]);
            params.addChildNode(parametro);
        }
        padre.addChildNode(params);
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.instructions) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(NodoInstr);
        return padre;
    }
}
exports.Funcion = Funcion;
