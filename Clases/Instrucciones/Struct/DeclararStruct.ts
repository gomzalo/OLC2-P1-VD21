import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Identificador } from "../../Expresiones/Identificador";
import { Llamada } from "../../Expresiones/Llamada";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";

export class DeclararStruct implements Instruccion{
    fila: number;
    columna: number;
    arreglo: boolean;
    public id:  string;
    public tipo: TIPO;
    public tipoStruct : string;
    public attributes: TablaSimbolos;
    public instructions: any[];
    public llamada : Llamada ;

    constructor(tipoStruct, id, llamada, fila, columna)
    {
        this.tipoStruct = tipoStruct;
        this.id = id;
        this.fila = fila;
        this.columna =columna;
        this.llamada = llamada;
    }
    ejecutar(table: TablaSimbolos, tree: Ast) {
        //1 Obtenemos Struct
        let struct = tree.getStruct(this.tipoStruct); // Struct
        if (struct == null){
            return new Errores("Semantico", "Struct " + this.tipoStruct + ": NO coincide con la busqueda", this.fila, this.columna);
        }
        //2 Ejecutamos struct
        struct.idSimbolo =this.id;
        let resultStruct = struct.ejecutar(table,tree);
        if (resultStruct instanceof Errores)
            return resultStruct

        if (!(this.llamada instanceof Llamada))
            return new Errores("Semantico", "Struct  " + this.tipoStruct + ": Expresion no es de tipo Llamada", this.fila, this.columna);

        // Ejecutando parametros
        let newTable = struct.attributes;
        // valido tama;o de   parametros parameters de funcion y parametros de llamada
        if (this.llamada.parameters.length == struct.instructions.length)
        {
            let count=0;
            for (let expr of this.llamada.parameters)
            {
                let valueExpr = expr.ejecutar(newTable,tree);

                if( valueExpr instanceof Errores ){
                    return new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.llamada.fila, this.llamada.columna);
                }
                if (struct.variables[count].tipo == expr.tipo || struct.variables[count].tipo == TIPO.ANY)  //Valida Tipos
                {
                    let symbol;
                    if (struct.variables[count].tipo == TIPO.ANY)
                    {
                        symbol = new Simbolo(String(struct.variables[count].id),expr.tipo, false, this.llamada.fila, this.llamada.columna, valueExpr ); // seteo para variables nativas
                        
                    }else if (struct.variables[count].tipo == TIPO.STRUCT)
                    {
                        symbol = new Simbolo(String(struct.variables[count].id),expr.tipo, true, this.llamada.fila, this.llamada.columna, valueExpr ); // seteo para variables nativas
                        
                    }else{
                        symbol = new Simbolo(String(struct.variables[count].id),struct.variables[count].tipo, false, this.llamada.fila, this.llamada.columna, valueExpr );
                    }
                    console.log(struct)
                    console.log(symbol)
                    let resultTable = newTable.updateSymbolTabla(symbol)
                    if (resultTable instanceof Errores)
                        return resultTable
                }else{
                    return new Errores("Semantico", "Verificacion de Tipo de Parametros no coincide", this.fila, this.columna);
                }

                count++;
            }
        }else{
            console.log(`tam param call: ${this.llamada.parameters.length} func ${struct.instructions.length}`);
            return new Errores("Semantico", "Tamaño de Tipo de Parametros no coincide", this.fila, this.columna);
        }
        


    }
    getTipoStruct(): string {
        throw new Error("Method not implemented.");
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    
}