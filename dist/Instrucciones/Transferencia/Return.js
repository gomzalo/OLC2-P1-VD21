"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Errores_1 = require("../../Ast/Errores");
const Retorno_1 = require("../../G3D/Retorno");
class Return {
    constructor(expresion, fila, columna) {
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (this.expresion != null) {
            let valor = this.expresion.ejecutar(table, tree);
            if (valor instanceof Errores_1.Errores) {
                return valor;
            }
            this.tipo = this.expresion.tipo;
            this.valor = valor;
            return this;
        }
        else {
            return null;
        }
        // this.tipo = this.valor.tipo;
    }
    translate3d(table, tree) {
        var _a;
        const genc3d = tree.generadorC3d;
        const valor = ((_a = this.expresion) === null || _a === void 0 ? void 0 : _a.translate3d(table, tree)) || new Retorno_1.Retorno('-1', false, Tipo_1.TIPO.VOID);
        let result_func = table.actual_funcion;
        if (valor == null) {
            return new Errores_1.Errores('Semantico', 'No se permite el uso de return en la instrucción.', this.fila, this.columna);
        }
        if (result_func.tipo == Tipo_1.TIPO.BOOLEANO) {
            const templabel = genc3d.newLabel();
            genc3d.gen_Label(valor.lblTrue);
            genc3d.gen_SetStack('p', '1');
            genc3d.gen_Goto(templabel);
            genc3d.gen_Label(valor.lblFalse);
            genc3d.gen_SetStack('p', '0');
            genc3d.gen_Label(templabel);
        }
        else if (result_func.tipo !== Tipo_1.TIPO.VOID) {
            genc3d.gen_SetStack('p', valor.getValor());
        }
        genc3d.gen_Goto(table.return || '');
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("RETURN", "");
        padre.addChildNode(new Nodo_1.Nodo("return", ""));
        if (this.valor != null) {
            padre.addChildNode(this.expresion.recorrer());
        }
        return padre;
    }
}
exports.Return = Return;
