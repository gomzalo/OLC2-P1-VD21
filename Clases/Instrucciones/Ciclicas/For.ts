import { Return } from './../Transferencia/Return';
import { Continuar } from './../Transferencia/Continuar';
import { Instruccion } from './../../Interfaces/Instruccion';
import { OperadorLogico } from './../../TablaSimbolos/Tipo';
import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Detener } from '../Transferencia/Break';
import { timingSafeEqual } from 'crypto';

export class For implements Instruccion{

    public condicion : Instruccion;
    public lista_instrucciones : Array<Instruccion>;
    public inicio;
    public fin;
    public fila : number;
    public columna : number;

    constructor(condicion, lista_instrucciones, inicio, fin, fila, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.inicio = inicio;
        this.fin = fin;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let ts_for = new TablaSimbolos(table);
        this.inicio.ejecutar(ts_for, tree);
        let valor_condicion = this.condicion.ejecutar(ts_for, tree);

        if(typeof valor_condicion == 'boolean'){

            while(this.condicion.ejecutar(ts_for, tree)){

                let ts_local = new TablaSimbolos(ts_for);

                for(let ins of this.lista_instrucciones){
                    let res = ins.ejecutar(ts_local, tree);
                     //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                    if(ins instanceof Detener || res instanceof Detener ){
                        return null;
                    }else{
                        if(ins instanceof Continuar || res instanceof Continuar){
                            break;
                        }else{
                            if(ins instanceof Return || res instanceof Return){
                                return res;
                            }
                        }
                    }
                }
                this.fin.ejecutar(ts_for, tree);
            }
        }
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }
    
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }

}