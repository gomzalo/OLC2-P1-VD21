"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identificador = void 0;
const Errores_1 = require("../Ast/Errores");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Nodo_1 = require("../Ast/Nodo");
const Retorno_1 = require("../G3D/Retorno");
class Identificador {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
        this.tipo = null;
        this.lblFalse = "";
        this.lblFalse = "";
    }
    ejecutar(table, tree) {
        // console.log(table.existeEnActual(this.id));
        // console.log((table));
        // table.getSymbolTabla(this.id);
        this.symbol = table.getSymbolTabla(this.id);
        // console.log(table.getSymbolTabla(this.id));
        if (this.symbol == null) {
            return new Errores_1.Errores("Semantico", "Variable " + this.id + ", no coincide con la busqueda en Identificador.", this.fila, this.columna);
        }
        this.tipo = this.symbol.getTipo();
        // console.log(`tipo id: ${this.tipo}`)
        if (this.tipo == Tipo_1.TIPO.STRUCT) {
            this.tipoStruct = this.symbol.getTipoStruct();
            return this.symbol;
        }
        return this.symbol.getValor();
    }
    translate3d(table, tree) {
        let genC3d = tree.generadorC3d;
        let varSimb = table.getSymbolTabla(this.id);
        let temp = genC3d.newTemp();
        if (varSimb != null) {
            if (varSimb.isGlobal) {
                genC3d.gen_Comment("--------Id-------");
                genC3d.gen_GetStack(temp, varSimb.posicion);
                if (varSimb.tipo !== Tipo_1.TIPO.BOOLEANO) // si no es booleano
                 {
                    return new Retorno_1.Retorno(temp, true, varSimb.tipo, varSimb);
                }
                genC3d.gen_Comment("--------Id booleano-------");
                //si lo es : booleano
                let retorno = new Retorno_1.Retorno("", false, varSimb.tipo, varSimb);
                this.lblTrue = this.lblTrue == "" ? genC3d.newLabel() : this.lblTrue;
                this.lblFalse = this.lblFalse == "" ? genC3d.newLabel() : this.lblFalse;
                genC3d.gen_If(temp, '1', '==', this.lblTrue);
                genC3d.gen_Goto(this.lblFalse);
                retorno.lblTrue = this.lblTrue;
                retorno.lblFalse = this.lblFalse;
                return retorno;
            }
            else {
                genC3d.gen_Comment("--------Id-------");
                let tempAux = genC3d.newTemp();
                genC3d.freeTemp(tempAux);
                genC3d.gen_Exp(tempAux, 'p', varSimb.posicion, '+');
                genC3d.gen_GetStack(temp, tempAux);
                if (varSimb.tipo !== Tipo_1.TIPO.BOOLEANO) {
                    return new Retorno_1.Retorno(temp, true, varSimb.tipo, varSimb);
                }
                //si lo es : booleano
                genC3d.gen_Comment("--------Id booleano-------");
                const retorno = new Retorno_1.Retorno('', false, varSimb.tipo, varSimb);
                this.lblTrue = this.lblTrue == '' ? genC3d.newLabel() : this.lblTrue;
                this.lblFalse = this.lblFalse == '' ? genC3d.newLabel() : this.lblFalse;
                genC3d.gen_If(temp, '1', '==', this.lblTrue);
                genC3d.gen_Goto(this.lblFalse);
                retorno.lblTrue = this.lblTrue;
                retorno.lblFalse = this.lblFalse;
                return retorno;
            }
            const generator = tree.generadorC3d;
            if (typeof this.symbol.valor == "number") {
                return new Retorno_1.Retorno(this.symbol.valor + "", false, Tipo_1.TIPO.DECIMAL);
            }
            else if (typeof this.symbol.valor == "string") {
                // console.log("entre****");
                // console.log(this.symbol);
                const temp = generator.newTemp();
                generator.genAsignaTemp(temp, "h");
                for (let i = 0; i < this.symbol.valor.length; i++) {
                    generator.gen_SetHeap("h", this.symbol.valor.charCodeAt(i));
                    generator.nextHeap();
                }
                generator.gen_SetHeap("h", "-1");
                generator.nextHeap();
                return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
            }
            else {
                // console.log("no entre");
            }
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("IDENTIFICADOR", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id.toString(), ""));
        return padre;
    }
}
exports.Identificador = Identificador;
