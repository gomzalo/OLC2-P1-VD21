"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Nodo_1 = require("../Ast/Nodo");
class Print {
    constructor(parametros, fila, columna, tipo) {
        this.parametros = parametros;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
    }
    ejecutar(table, tree) {
        // console.log("print params: " + this.parametros.toString());
        //TODO: verificar que el tipo del valor sea primitivo
        this.value = "";
        this.parametros.forEach((expresion) => {
            let valor = expresion.ejecutar(table, tree);
            console.log("print exp val: " + String(valor));
            console.log(valor);
            if (this.tipo) {
                // this.value += valor.toString() + "\n";
                tree.updateConsolaPrintln(String(valor));
            }
            else {
                this.value += valor.toString();
                tree.updateConsolaPrint(String(valor));
            }
            return valor;
        });
        // if(this.tipo){
        //     tree.updateConsolaPrintln(this.value.toString())
        // }else{
        // tree.updateConsolaPrint(this.value.toString())
        // }
        return null;
    }
    translate3d(table, tree) {
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Print", "");
        padre.addChildNode(new Nodo_1.Nodo("print", ""));
        padre.addChildNode(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        // hijo.addChildNode(this.parametros.recorrer());
        padre.addChildNode(hijo);
        padre.addChildNode(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Print = Print;
