import { Identificador } from './../../Expresiones/Identificador';
import { Return } from '../Transferencia/Return';
import { Continuar } from '../Transferencia/Continuar';
import { Instruccion } from '../../Interfaces/Instruccion';
import { OperadorLogico } from '../../TablaSimbolos/Tipo';
import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Detener } from '../Transferencia/Break';
import { Errores } from '../../Ast/Errores';
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { AccesoArr } from '../../Expresiones/Arreglos/AccesoArr';

export class ForIn implements Instruccion{

    public iterador;
    public rango;
    public lista_instrucciones : Array<Instruccion>;
    public fila : number;
    public columna : number;
    arreglo = false;
    /**
     * @function ForIn Accede a posiciones de arreglos o cadenas, asignando sus valores en una variable temporal.
     * @param iterador Variable temporal que contiene el valor del arreglo/cadena en la iteracion actual.
     * @param rango Arreglo o cadena que se desea iterar.
     * @param lista_instrucciones Instrucciones a realizar con los valores guardados en la variable temporal @param iterador.
     * @param fila 
     * @param columna 
     */
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
        }// Arreglos no declarados anteriormente, creados en caliente.
        else if (this.rango.tipo == TIPO.ARREGLO || this.rango instanceof Array ) {
            console.log("FOR IN ARR XD");
            let ts_local_fiarr1 = new TablaSimbolos(table);
            let index_rank = 0;
            this.rango.forEach(e => {
                let element = e.ejecutar(ts_local_fiarr1, tree);
                // let ts_e_farr1 = new TablaSimbolos(ts_local_fiarr1)
                if (element instanceof Errores)
                {
                    tree.getErrores().push(element);
                    tree.updateConsolaPrintln(element.toString());
                }
                if(element instanceof Errores){
                    return element;
                }
                let nuevo_simb = new Simbolo(this.iterador, e.tipo, this.arreglo, this.fila, this.columna, element);
                // console.log("nuevo simb for in:");
                // console.log(nuevo_simb);
                let result = ts_local_fiarr1.updateSymbolTabla(nuevo_simb);
                if (result instanceof Errores)
                {
                    result = ts_local_fiarr1.setSymbolTabla(nuevo_simb);
                    if (result instanceof Errores)
                    {
                        tree.getErrores().push(result);
                        tree.updateConsolaPrintln(result.toString());
                    }
                }
                for(let ins of this.lista_instrucciones){
                    // console.log("instrucciones en forin: ");
                    // console.log(ins);
                    let res = ins.ejecutar(ts_local_fiarr1, tree);
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
                index_rank++;
            });
        }else if(this.rango instanceof AccesoArr){
            console.log("FOR IN ARR DEC RANGO");
            // console.log(this.rango.);
            let arr = table.getSymbolTabla(this.rango.id.toString());
            if(arr != null){
                if(arr.getArreglo()){
                    console.log("foinarrdec rank: " + this.rango.expresiones[0]);
                    let rank = this.rango.expresiones[0].ejecutar(table, tree);
                    // console.log("AccArr rank type: " + (rank instanceof Array));
                    // console.log("rank[0] type: " + (typeof(rank[0]) == "string"));
                    // console.log("rank accArr: " + rank);
                    if(rank == null){
                        return new Errores("Semantico", "La variable \'" + this.rango.id + "\', no es un rango.", this.fila, this.columna);
                    }
                    
                    let begin;
                    if(rank[0] == "begin"){
                        begin = 0;
                    }else{
                        begin = rank[0].ejecutar(table, tree);
                    }
                    if(begin instanceof Errores){
                        return begin;
                    }
                    let end;
                    if(rank[1] == "end"){
                        end = arr.getValor().length;
                    }else{
                        end = rank[1].ejecutar(table, tree);
                    }
                    if(end instanceof Errores){
                        return end;
                    }
                    console.log("begin: " + begin);
                    console.log("end: " + end);
                    let array = [];
                    let contador = begin;
                    while(contador <= end){
                        array.push(arr.getValor()[contador]);
                        let element = arr.getValor()[contador];
                        let nuevo_simb = new Simbolo(this.iterador, arr.getTipo(), this.arreglo, this.fila, this.columna, element);
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
                        contador++;
                    }
                }else{
                    return new Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no es un arreglo.", this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no existe.", this.fila, this.columna);
            }
        }else if(this.rango instanceof Identificador){
            let variable = table.getSymbolTabla(this.rango.id.toString());
            if(variable != null){
                let rango = variable.getValor();
                if (rango instanceof Errores)
                {
                    tree.getErrores().push(rango);
                    tree.updateConsolaPrintln(rango.toString());
                }
                if(rango instanceof Errores){
                    return rango;
                }
                if(variable.getTipo() == TIPO.CADENA && !variable.getArreglo()){
                    console.log("FOR IN VAR CADENA");
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
                }else if(variable.getArreglo()){
                    console.log("FOR IN ARR DEC");
                    variable.getValor().forEach(element => {
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
                }
            }else{
                return new Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no existe.", this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", "For-in no valido.", this.fila, this.columna);
        }
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented FOR IN.');
    }
    
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("FOR-IN","");
        let iterador = new Nodo("ITERADOR","");
        iterador.addChildNode(new Nodo(this.iterador,""))
        let rango = new Nodo("RANGO","");
        // recorriendo rango
        if(this.rango.tipo == TIPO.CADENA || this.rango instanceof Identificador){
            rango.addChildNode(this.rango.recorrer(table, tree));
        }else if(this.rango.tipo == TIPO.ARREGLO || this.rango instanceof Array){
            for (let r of this.rango )
            {
                rango.addChildNode(r.recorrer(table, tree));
            }
        }else if (this.rango instanceof AccesoArr)
        {
            rango.addChildNode(this.rango.recorrer(table, tree));
        }
        
        // rango.addChildNode(this.rango.recorrer(table,tree));
        let NodoInstr = new Nodo("INSTRUCCIONES","");
        for(let instr of this.lista_instrucciones)
        {
            NodoInstr.addChildNode(instr.recorrer(table,tree));
        }
        padre.addChildNode(iterador);
        padre.addChildNode(rango);
        padre.addChildNode(NodoInstr);

        return padre;
    }

    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }    
}