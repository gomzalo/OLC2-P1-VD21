"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructInStruct = void 0;
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
class StructInStruct {
    constructor(tipoStruct, id, fila, columna) {
        this.tipo = Tipo_1.TIPO.STRUCT;
        this.tipoStruct = tipoStruct; // Estudiante
        this.id = id; // variableID  
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let nuevo_simb = new Simbolo_1.Simbolo(this.id, Tipo_1.TIPO.STRUCT, false, this.fila, this.columna, null);
        nuevo_simb.tipoStruct = this.tipoStruct;
        nuevo_simb.variables = [];
        let resultStruct = table.setSymbolTabla(nuevo_simb);
        if (resultStruct instanceof Errores_1.Errores)
            return resultStruct;
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("StructInStruct", "");
        let NodoInstr = new Nodo_1.Nodo("TIPO STRUCT", "");
        NodoInstr.addChildNode(new Nodo_1.Nodo(this.tipoStruct, ""));
        let id = new Nodo_1.Nodo("ID", "");
        id.addChildNode(new Nodo_1.Nodo(this.id, ""));
        padre.addChildNode(NodoInstr);
        padre.addChildNode(id);
        return padre;
    }
}
exports.StructInStruct = StructInStruct;
