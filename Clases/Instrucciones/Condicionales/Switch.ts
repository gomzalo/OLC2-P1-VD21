import { Instruccion } from './../../Interfaces/Instruccion';
import { OperadorLogico } from './../../TablaSimbolos/Tipo';
import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Detener } from '../Transferencia/Break';
import { Return } from '../Transferencia/Return';
import { Case } from './Case';
import { Errores } from '../../Ast/Errores';

export class Switch implements Instruccion{

    public valor_sw : Instruccion;
    public lista_case : Array<Case>;
    public lista_default : Array<Instruccion>;
    public fila : number;
    public columna : number;
    arreglo: boolean;

    constructor(valor_sw, lista_case, lista_default, fila, columna) {
        this.valor_sw = valor_sw;
        this.lista_case = lista_case;
        this.lista_default = lista_default;
        this.columna = columna;
        this.fila = fila;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let ts_local = new TablaSimbolos (table);
        for(let sw of this.lista_case){
            sw.valor_sw=this.valor_sw.ejecutar(ts_local, tree);
            if (sw.valor_sw instanceof Errores)
            {
                tree.getErrores().push(sw.valor_sw);
                tree.updateConsolaPrintln(sw.valor_sw.toString());
            }
        }
        let x=0;
        for(let ins of this.lista_case){
            let res=ins.ejecutar(ts_local, tree);
            if (res instanceof Errores)
            {
                tree.getErrores().push(res);
                tree.updateConsolaPrintln(res.toString());
            }
            if( ins instanceof Detener || res instanceof Detener){
                // controlador.graficarEntornos(controlador,ts_local," (switch)");
                x=1;
                break;
            }else{
                    if( ins instanceof Return || res instanceof Return){
                        // controlador.graficarEntornos(controlador,ts_local," (switch)");
                        return res; 
                    }
                }
            }

            if(x==0){
                for(let ins of this.lista_default){
                    let res=ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores)
                    {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    if( ins instanceof Detener || res instanceof Detener){
                        // controlador.graficarEntornos(controlador,ts_local," (switch)");
                        break;
                    }else{
                            if( ins instanceof Return || res instanceof Return){
                                // controlador.graficarEntornos(controlador,ts_local," (switch)");
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
        let padre = new Nodo("SWITCH", "");

        let condicion = new Nodo("CONDICION","");
        condicion.addChildNode(this.valor_sw.ejecutar(table,tree));
        
        let listaCase = new Nodo("LISTA CASE","");
        for(let instr of this.lista_case)
        {
            listaCase.addChildNode(instr.recorrer(table,tree));
        }

        let listaDefault = new Nodo("LISTA DEFAULT","");
        if (this.lista_default != null)
        {
            for(let instr of this.lista_default)
            {
                listaDefault.addChildNode(instr.recorrer(table,tree));
            }
        }


        return padre;
    }

}