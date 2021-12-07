import { Instruccion } from './../../Interfaces/Instruccion';
import { OperadorLogico } from './../../TablaSimbolos/Tipo';
import Nodo from "../../Ast/Nodo";
import Ast from "../../Ast/Ast"
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import Detener from '../Transferencia/Break';

export default class If implements Instruccion{

    public condicion : Expresion;
    public lista_ifs : Array<Instruccion>;
    public lista_elses : Array<Instruccion>;
    public linea : number;
    public columna : number;

    constructor(condicion, lista_ifs, lista_elses, linea, columna) {
        this.condicion = condicion;
        this.lista_ifs = lista_ifs;
        this.lista_elses = lista_elses;
        this.columna = columna;
        this.linea = linea;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let ts_local = new TablaSimbolos(table);

        let valor_condicion = this.condicion.getValorImplicito(table, tree);

        if(this.condicion.getTipo(table, tree) == TIPO.BOOLEANO){
            if(valor_condicion){
                for(let ins of this.lista_ifs){
                    let res = ins.ejecutar(ts_local, tree);
                    //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                    if(ins instanceof Detener || res instanceof Detener  ){
                        return res;
                    }
                }
            }else{
                for(let ins of this.lista_elses){
                    let res = ins.ejecutar(ts_local, tree);
                    //TODO verificar si res es de tipo CONTINUE, RETORNO 
                    if(ins instanceof Detener || res instanceof Detener  ){
                        return res;
                    }
                }
            }
        }
        return null;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }

}