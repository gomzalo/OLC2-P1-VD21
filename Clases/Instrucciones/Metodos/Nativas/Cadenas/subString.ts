import { Instruccion } from '../../../../Interfaces/Instruccion';
import { Ast } from "../../../../Ast/Ast";
import { Errores } from "../../../../Ast/Errores";
import { TablaSimbolos } from "../../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../../TablaSimbolos/Tipo";
import { Detener } from "../../../Transferencia/Break";
import { Continuar } from "../../../Transferencia/Continuar";
import { Return } from "../../../Transferencia/Return";
import { Funcion } from "../../Funcion";
import { resourceUsage } from 'process';

export class subString implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id;
    public parameters: Array<any>;
    public instructions: Array<any>;
    inicio;
    fin;
    arreglo: boolean;

    constructor(id, inicio, fin, fila, columna)
    {
        this.id = id;
        this.inicio = inicio;
        this.fin = fin;
        this.fila = fila;
        this.columna =columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        // console.log("push id: " + this.id.id);
        let cadena = table.getSymbolTabla(this.id);
        if(cadena != null){
            if(cadena.getTipo() == TIPO.CADENA && !cadena.getArreglo()){
                this.tipo = cadena.getTipo();
                let inicio = this.inicio.ejecutar(table, tree);
                if(inicio == null){
                    return new Errores("Semantico", `No se obtuvo una posicion ${inicio}.`, this.fila, this.columna);
                }
                let fin = this.fin.ejecutar(table, tree);
                if(fin == null){
                    return new Errores("Semantico", `No se obtuvo una posicion ${fin}.`, this.fila, this.columna);
                }
                console.log("charofpos tipo cadena: " + cadena.getTipo());
                console.log("charofpos tipo inicio: " + this.inicio);
                let tam = cadena.getValor().length;
                if(!(tam > 0)){
                    return new Errores("Semantico", `La cadena en la variable con ID: '${this.id} es vacia'.`, this.fila, this.columna);
                }
                if(this.inicio.tipo == TIPO.ENTERO && this.fin.tipo == TIPO.ENTERO){
                    if(fin < tam){
                        if(inicio >= 0){
                            if(inicio < fin){
                                let cont = inicio;
                                let result = "";
                                while(cont <= fin){
                                    result += cadena.getValor().charAt(cont);
                                    cont++;
                                }
                                return result;
                            }else{
                                return new Errores("Semantico", `La posicion ${inicio} debe ser menor que ${fin}.`, this.fila, this.columna);
                            }
                        }else{
                            return new Errores("Semantico", `La posicion ${inicio} no se encuentra no puede ser negativa.`, this.fila, this.columna);
                        }
                    }else{
                        return new Errores("Semantico", `La posicion ${fin} no se encuentra dentro de ${this.id}.`, this.fila, this.columna);
                    }
                }else{
                    return new Errores("Semantico", `Los accesos deben de ser de tipo entero.`, this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", `Nativa 'subString' no puede utilizase en variable con ID ${this.id}, porque no es una cadena.`, this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}