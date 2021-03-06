"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subString = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
class subString {
    /**
     * @function subString El acceso a una porción de una cadena se define de la siguiente manera: string.subString(inicial,final), el cual devolvera la cadena correspondiente al intervalo definido.
     * @param id ID de la variable, tipo cadena, que se desea obtener parcialmente.
     * @param inicio Posicion inicial a obtener.
     * @param fin Posicion final a obtener.
     * @param fila
     * @param columna
     */
    constructor(id, inicio, fin, fila, columna) {
        this.id = id;
        this.inicio = inicio;
        this.fin = fin;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("substr: ");
        let cadena = table.getSymbolTabla(this.id);
        if (cadena != null) {
            if (cadena.getTipo() == Tipo_1.TIPO.CADENA && !cadena.getArreglo()) {
                this.tipo = cadena.getTipo();
                let inicio = this.inicio.ejecutar(table, tree);
                if (inicio == null) {
                    return new Errores_1.Errores("Semantico", `No se obtuvo una posicion ${inicio}.`, this.fila, this.columna);
                }
                let fin = this.fin.ejecutar(table, tree);
                if (fin == null) {
                    return new Errores_1.Errores("Semantico", `No se obtuvo una posicion ${fin}.`, this.fila, this.columna);
                }
                // console.log("charofpos tipo cadena: " + cadena.getTipo());
                // console.log("charofpos tipo inicio: " + this.inicio);
                let tam = cadena.getValor().length;
                if (!(tam > 0)) {
                    return new Errores_1.Errores("Semantico", `La cadena en la variable con ID: '${this.id} es vacia'.`, this.fila, this.columna);
                }
                if (this.inicio.tipo == Tipo_1.TIPO.ENTERO && this.fin.tipo == Tipo_1.TIPO.ENTERO) {
                    // console.log("fin: " + fin + ", tam: " + tam);
                    if (fin <= tam) {
                        if (inicio >= 0) {
                            if (inicio < fin) {
                                let cont = inicio;
                                let result = "";
                                while (cont < fin) {
                                    result += cadena.getValor().charAt(cont);
                                    cont++;
                                }
                                // console.log("valor substr");
                                // console.log(result);
                                this.valor = result;
                                return result;
                            }
                            else {
                                return new Errores_1.Errores("Semantico", `La posicion '${inicio}' debe ser menor que '${fin}'.`, this.fila, this.columna);
                            }
                        }
                        else {
                            return new Errores_1.Errores("Semantico", `La posicion '${inicio}' no se encuentra no puede ser negativa.`, this.fila, this.columna);
                        }
                    }
                    else {
                        return new Errores_1.Errores("Semantico", `La posicion '${fin}' no se encuentra dentro de '${this.id}'.`, this.fila, this.columna);
                    }
                }
                else {
                    return new Errores_1.Errores("Semantico", `Los accesos deben de ser de tipo entero.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa 'subString' no puede utilizase en variable con ID '${this.id}', porque no es una cadena.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID '${this.id}', no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented SUBSTRING.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("CharOfPos", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        let instruccion = new Nodo_1.Nodo("INICIO", "");
        instruccion.addChildNode(this.inicio.recorrer(table, tree));
        let fin = new Nodo_1.Nodo("FIN", "");
        fin.addChildNode(this.fin.recorrer(table, tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        padre.addChildNode(instruccion);
        padre.addChildNode(fin);
        return padre;
    }
}
exports.subString = subString;
