import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Detener } from "../Transferencia/Break";
import { Continuar } from "../Transferencia/Continuar";
import { Return } from "../Transferencia/Return";

export class Funcion implements Instruccion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id : string;
    public parameters: Array<any>;
    public instructions : Array<Instruccion>;
    arreglo: boolean;

    constructor(id,tipo,parameters,instructions,fila,columna)
    {
        this.tipo =tipo;
        this.id = id;
        this.parameters =parameters;
        this.instructions = instructions;
        this.fila = fila;
        this.columna =columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let newTable = new TablaSimbolos(table);
        if(this.instructions.length > 0){
            for(let instr of this.instructions)
            {
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
                    this.tipo = result.tipo;
                    return result.valor;
                }
            }
        }
        return null;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}