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
import { Errores } from '../../Ast/Errores';

export class DoWhile implements Instruccion{

    public condicion;
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
        let valor_condicion = this.condicion.ejecutar(table, tree);
        if (valor_condicion instanceof Errores)
        {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if(typeof valor_condicion == 'boolean'){
            do{
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
            }
            while(this.condicion.ejecutar(table, tree))
        }
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        let genc3d = tree.generadorC3d;
        let entornoLocal = new TablaSimbolos(table);
        
        genc3d.gen_Comment('------------ DO WHILE -----------');
        entornoLocal.continue = this.condicion.lblTrue = genc3d.newLabel();
        entornoLocal.break = this.condicion.lblFalse = genc3d.newLabel();
        genc3d.gen_Label(this.condicion.lblTrue);
        for(let inst of this.lista_instrucciones)
        {
            inst.translate3d(entornoLocal,tree);
        }
        genc3d.gen_Comment('-----Condicion');
        let condicion = this.condicion.translate3d(table,tree);
        if (condicion.tipo !== TIPO.BOOLEANO){
            let error =  new Errores("c3d", "La condicion no es booleana.", this.fila, this.columna);
            tree.Errores.push(error);
            tree.updateConsolaPrintln(error.toString());
        }
        genc3d.gen_Label(condicion.lblFalse);
        genc3d.gen_Comment('----------- FIN DO WHILE  -------');
    }
    
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("DO WHILE","");
        let NodoInstr = new Nodo("INSTRUCCIONES","");
        for(let instr of this.lista_instrucciones)
        {
            NodoInstr.addChildNode(instr.recorrer(table,tree));
        }
        padre.addChildNode(NodoInstr);

        let condicion = new Nodo("CONDICION","");
        condicion.addChildNode(this.condicion.ejecutar(table,tree));
        padre.addChildNode(condicion);
        
        return padre;
    }

}