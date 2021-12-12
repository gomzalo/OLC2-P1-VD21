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
import { AccesoArr } from '../../Expresiones/Arreglos/AccesoArr';

export class ForIn implements Instruccion{

    public iterador;
    public rango;
    public lista_instrucciones : Array<Instruccion>;
    public fila : number;
    public columna : number;
    arreglo = false;

    constructor(iterador, rango, lista_instrucciones, fila, columna) {
        this.iterador = iterador;
        this.rango = rango;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        if(this.rango.tipo == TIPO.CADENA){
            let rango = this.rango.ejecutar(table, tree);
            if (rango instanceof Errores)
            {
                tree.getErrores().push(rango);
                tree.updateConsolaPrintln(rango.toString());
            }
            if(rango instanceof Errores){
                return rango;
            }
            console.log("FOR IN CADENA");
            for(var i = 0; i < rango.length; i++){
                let char = rango.charAt(i);
                let nuevo_simb = new Simbolo(this.iterador, TIPO.CHARACTER, this.arreglo, this.fila, this.columna, char);
                let ts_local = new TablaSimbolos(table);
                ts_local.setSymbolTabla(nuevo_simb);
                ts_local.updateSymbolTabla(nuevo_simb);
                for(let ins of this.lista_instrucciones){
                    let res = ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores)
                    {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
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
        }else if (this.rango.tipo == TIPO.ARREGLO || this.rango instanceof Array ) {
            console.log("FOR IN ARR XD");
            this.rango.forEach(e => {
                let element = e.ejecutar(table, tree);
                if (element instanceof Errores)
                {
                    tree.getErrores().push(element);
                    tree.updateConsolaPrintln(element.toString());
                }
                if(element instanceof Errores){
                    return element;
                }
                let nuevo_simb = new Simbolo(this.iterador, TIPO.ARREGLO, this.arreglo, this.fila, this.columna, element);
                let ts_local = new TablaSimbolos(table);
                let result = ts_local.updateSymbolTabla(nuevo_simb);
                if (result instanceof Errores)
                {
                    result = ts_local.setSymbolTabla(nuevo_simb);
                    if (result instanceof Errores)
                    {
                        tree.getErrores().push(result);
                        tree.updateConsolaPrintln(result.toString());
                    }
                }
                for(let ins of this.lista_instrucciones){
                    let res = ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores)
                    {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
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
            });
        }else if(this.rango instanceof AccesoArr){
            console.log("FOR IN ARR DEC");
            // console.log(this.rango.);
            let arr = table.getSymbolTabla(this.rango.id.toString());
            if(arr != null){
                if(arr.getArreglo()){
                    arr.getValor().forEach(element => {
                        let nuevo_simb = new Simbolo(this.iterador, TIPO.ARREGLO, this.arreglo, this.fila, this.columna, element);
                        let ts_local = new TablaSimbolos(table);
                        let result = ts_local.updateSymbolTabla(nuevo_simb);
                        if (result instanceof Errores)
                        {
                            result = ts_local.setSymbolTabla(nuevo_simb);
                            if (result instanceof Errores)
                            {
                                tree.getErrores().push(result);
                                tree.updateConsolaPrintln(result.toString());
                            }
                        }
                        for(let ins of this.lista_instrucciones){
                            let res = ins.ejecutar(ts_local, tree);
                            if (res instanceof Errores)
                            {
                                tree.getErrores().push(res);
                                tree.updateConsolaPrintln(res.toString());
                            }
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
                    });
                }else{
                    return new Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no es un arreglo.", this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no existe.", this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", "For-in no valido.", this.fila, this.columna);
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