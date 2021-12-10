import { Return } from '../Transferencia/Return';
import { Continuar } from '../Transferencia/Continuar';
import { Instruccion } from '../../Interfaces/Instruccion';
import { OperadorLogico } from '../../TablaSimbolos/Tipo';
import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Detener } from '../Transferencia/Break';
import { timingSafeEqual } from 'crypto';
import { Errores } from '../../Ast/Errores';
import { isInt16Array } from 'util/types';
import { Simbolo } from "../../TablaSimbolos/Simbolo";

export class ForIn implements Instruccion{

    public iterador;
    public rango;
    public lista_instrucciones : Array<Instruccion>;
    public fila : number;
    public columna : number;

    constructor(iterador, rango, lista_instrucciones, fila, columna) {
        this.iterador = iterador;
        this.rango = rango;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let rango = this.rango.ejecutar(table, tree);
        if(rango instanceof Errores){
            return rango;
        }
        if(this.rango.tipo == TIPO.CADENA){
            for(var i = 0; i < rango.length; i++){
                let char = rango.charAt(i);
                let nuevo_simb = new Simbolo(this.iterador, TIPO.CHARACTER, null, this.fila, this.columna, char);
                let ts_local = new TablaSimbolos(table);
                ts_local.setSymbolTabla(nuevo_simb);
                ts_local.updateSymbolTabla(nuevo_simb);
                for(let ins of this.lista_instrucciones){
                    let res = ins.ejecutar(ts_local, tree);
                    if(ins instanceof Detener || res instanceof Detener ){
                        return null;
                    }
                    if(ins instanceof Continuar || res instanceof Continuar){
                        break;
                    }
                    if(ins instanceof Return || res instanceof Return){
                        return res;
                    }
                }
            }
        }
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }
    
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }

    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }    
}