import { Errores } from './../../Ast/Errores';
import { Instruccion } from './../../Interfaces/Instruccion';
import { OperadorLogico } from './../../TablaSimbolos/Tipo';
import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Detener } from '../Transferencia/Break';
import { Continuar } from '../Transferencia/Continuar';
import { Return } from '../Transferencia/Return';

export class While implements Instruccion{

    public condicion : any;
    public lista_instrucciones : Array<Instruccion>;
    public fila : number;
    public columna : number;
    arreglo: boolean;

    constructor(condicion, lista_instrucciones, fila, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        while(true){
            let valor_condicion = this.condicion.ejecutar(table, tree);
            if (valor_condicion instanceof Errores)
            {
                tree.getErrores().push(valor_condicion);
                tree.updateConsolaPrintln(valor_condicion.toString());
            }
            if(this.condicion.tipo == TIPO.BOOLEANO){
                if(this.getBool(valor_condicion)){
                    let ts_local = new TablaSimbolos(table);
                    for(let ins of this.lista_instrucciones){
                        let res = ins.ejecutar(ts_local, tree);
                        if (res instanceof Errores)
                        {
                            tree.getErrores().push(res);
                            tree.updateConsolaPrintln(res.toString());
                        }
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
                }else{
                    break;
                }
            }else{
                return new Errores("Semantico", "Valor no booleano", this.fila, this.columna);
            }
        }
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        let genc3d = tree.generadorC3d;
        let lbl = genc3d.newLabel();
        let entornoLocal = new TablaSimbolos(table);
        
        genc3d.gen_Comment('------------ WHILE -----------');
        genc3d.gen_Label(lbl);
        genc3d.gen_Comment('-----Condicion');
        let condicion = this.condicion.translate3d(table,tree);
        
        if (condicion.tipo !== TIPO.BOOLEANO){
            let error =  new Errores("c3d", "La condicion no  es boolean", this.fila, this.columna);
            tree.updateConsolaPrintln(error.toString());
        }


        entornoLocal.break = condicion.lblFalse;
        entornoLocal.continue = lbl;
        genc3d.gen_Label(condicion.lblTrue);
        genc3d.gen_Comment('-----End Condicion');

        for(let inst of this.lista_instrucciones)
        {
            inst.translate3d(entornoLocal,tree);
        }
        // this.sentencias.translate3d(entornoLocal);


        genc3d.gen_Goto(lbl);
        genc3d.gen_Label(condicion.lblFalse);
        genc3d.gen_Comment('-----------fin while -------');
        
    }
    
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("WHILE","");
        padre.addChildNode(new Nodo("while",""));
        // padre.addChildNode(new Nodo("(",""));
        padre.addChildNode(this.condicion.recorrer(table, tree));
        // padre.addChildNode(new Nodo(")",""));
        // padre.addChildNode(new Nodo("{",""));
        padre.addChildNode(new Nodo("INSTRUCCIONES",""));
        for(let ins of this.lista_instrucciones){
            padre.addChildNode(ins.recorrer(table, tree));
        }
        // padre.addChildNode(new Nodo("}",""));
        return padre;
    }

    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }

}