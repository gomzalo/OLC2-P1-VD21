"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Nodo_1 = require("../Ast/Nodo");
const Retorno_1 = require("../G3D/Retorno");
class Primitivo {
    constructor(valor, tipo, fila, columna) {
        this.valor = valor;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.lblFalse = "";
        this.lblTrue = "";
    }
    ejecutar(table, tree) {
        return this.valor;
    }
    translate3d(table, tree) {
        let valor = this.ejecutar(table, tree);
        const genc3d = tree.generadorC3d;
        switch (this.tipo) {
            case Tipo_1.TIPO.ENTERO:
                return new Retorno_1.Retorno(this.valor, false, Tipo_1.TIPO.ENTERO);
            case Tipo_1.TIPO.DECIMAL:
                // genc3d.gen_Comment('--------- INICIA RECORRE NUMERO ---------');
                return new Retorno_1.Retorno(this.valor, false, Tipo_1.TIPO.DECIMAL);
            case Tipo_1.TIPO.CADENA:
                const temp = genc3d.newTemp();
                genc3d.genAsignaTemp(temp, 'h');
                genc3d.gen_Comment('--------- INICIA RECORRE CADENA ---------');
                for (let i = 0; i < valor.length; i++) {
                    genc3d.gen_SetHeap('h', valor.charCodeAt(i));
                    genc3d.nextHeap();
                }
                genc3d.gen_Comment('--------- FIN RECORRE CADENA ---------');
                genc3d.gen_SetHeap('h', '-1');
                genc3d.nextHeap();
                return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
            case Tipo_1.TIPO.BOOLEANO:
                // genc3d.gen_Comment('--------- INICIA RECORRE BOOL ---------');
                this.lblTrue = this.lblTrue == '' ? tree.generadorC3d.newLabel() : this.lblTrue;
                this.lblFalse = this.lblFalse == '' ? tree.generadorC3d.newLabel() : this.lblFalse;
                this.valor ? tree.generadorC3d.gen_Goto(this.lblTrue) : tree.generadorC3d.gen_Goto(this.lblFalse);
                let retornar = new Retorno_1.Retorno("", false, Tipo_1.TIPO.BOOLEANO);
                retornar.lblTrue = this.lblTrue;
                retornar.lblFalse = this.lblFalse;
                return retornar;
            case Tipo_1.TIPO.NULO:
                return new Retorno_1.Retorno("-1", false, Tipo_1.TIPO.NULO);
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("PRIMITIVO", "");
        padre.addChildNode(new Nodo_1.Nodo(this.valor.toString(), ""));
        return padre;
    }
}
exports.Primitivo = Primitivo;
