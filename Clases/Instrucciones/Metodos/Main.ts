import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Nodo } from "../../Ast/Nodo";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { Detener } from "../Transferencia/Break";
import { Continuar } from "../Transferencia/Continuar";
import { Return } from "../Transferencia/Return";

export class Main implements Instruccion{
    public instructions : Array<Instruccion>;
    public fila: number;
    public columna: number;
    arreglo: boolean;
    
    constructor(instructions, fila, columna)
    {
        this.instructions = instructions;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let newTable = new TablaSimbolos(table);

        for(let instr of this.instructions)
        {
            // console.log(instr)
            let result = instr.ejecutar(newTable,tree);
            if (result instanceof Errores)
            {
                tree.getErrores().push(result);
                tree.updateConsolaPrintln(result.toString());
            }
            if( result instanceof Detener ){
                let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if( result instanceof Continuar){
                let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if( result instanceof Return){
                return result;
            }
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented MAIN.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("MAIN","");

        let NodoInstr = new Nodo("INSTRUCCIONES","");
        for(let instr of this.instructions)
        {
            NodoInstr.addChildNode(instr.recorrer(table,tree));
        }
        padre.addChildNode(NodoInstr);
        return padre;
    }

}