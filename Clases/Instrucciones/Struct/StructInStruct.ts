import { Ast } from "../../Ast/Ast";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { Errores } from "../../Ast/Errores";

export class StructInStruct implements Instruccion {
    fila: number;
    columna: number;
    arreglo: boolean;
    public tipoStruct : string;
    public id:  string;
    public tipo: TIPO =  TIPO.STRUCT;

    constructor(tipoStruct, id, fila, columna)
    {
        this.tipoStruct = tipoStruct; // Estudiante
        this.id = id;                 // variableID  
        this.fila = fila;
        this.columna =columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let nuevo_simb = new Simbolo(this.id, TIPO.STRUCT, false, this.fila, this.columna, null);
        nuevo_simb.tipoStruct = this.tipoStruct;
        nuevo_simb.variables =[]
        let resultStruct = table.setSymbolTabla(nuevo_simb);
        if (resultStruct instanceof Errores)
            return resultStruct
        return null;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}