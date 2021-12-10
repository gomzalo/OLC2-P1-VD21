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
        let tabla_intermedia = new TablaSimbolos(table);
        let iterador = this.iterador.ejecutar(tabla_intermedia, tree);
        console.log("iterador: " + iterador);
        if( iterador instanceof Errores){
            return iterador;
        }
        while(true){
            let rango = this.rango.ejecutar(tabla_intermedia, tree);
            console.log("rango: " + rango);
            if(this.rango.tipo == TIPO.BOOLEANO){
                if(this.getBool(rango)){
                    let ts_local = new TablaSimbolos(tabla_intermedia);
                    for(let ins of this.lista_instrucciones){
                        let res = ins.ejecutar(ts_local, tree);
                        //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                        
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
                    le = this.actualizacion.ejecutar(tabla_intermedia, tree);
                    console.log("actualizacion: " );
                    if instanceof Errores){
                        retur;
                    }
                }else{
                    break;
                }
            }else{
                return new Errores("Semantico", "Valor no booleano", this.fila, this.columna);
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