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
    public tipo: TIPO =  TIPO.STRUCT;
    public tipoStruct : string;
    public attributes: TablaSimbolos;
    public instructions: any[];
    public llamada : Llamada ;

    constructor(tipoStruct, id, llamada, fila, columna)
    {
        this.tipoStruct = tipoStruct; // Estudiante
        this.id = id;                 // variableID  
        this.fila = fila;
        this.columna =columna;
        this.llamada = llamada;
    }
    ejecutar(table: TablaSimbolos, tree: Ast) {
        // Validamos si solo es declaracion sin INSTANCIAR =
        if (this.llamada == null)
        {
            let nuevo_simb = new Simbolo(this.id, TIPO.STRUCT, false, this.fila, this.columna, null);
            nuevo_simb.tipoStruct = this.tipoStruct;
            let resultStruct = table.setSymbolTabla(nuevo_simb);
            if (resultStruct instanceof Errores)
                return resultStruct
            return null;
        }else{
            // SI NO, ES ASIGNACION CON DECLARACION=
            //1 Obtenemos Struct
            let struct = tree.getStruct(this.tipoStruct); // Struct
            console.log(struct);
            if (struct == null){
                return new Errores("Semantico", "Struct " + this.tipoStruct + ": NO coincide con la busqueda", this.fila, this.columna);
            }
            //2 Ejecutamos struct
            // struct.idSimbolo =this.id;
            let entonrnoStruct = new TablaSimbolos(null);
            let nuevo_simb = new Simbolo(this.id, TIPO.STRUCT, false, this.fila, this.columna, null);
            nuevo_simb.tipoStruct = this.tipoStruct;
            
            // tree.updateConsolaPrintln(" tamano variables: struct; " + this.variables.length);
            // tree.updateConsolaPrintln(" tamano instruccines: struct; " + this.instructions.length);
            
            /**
             * GUARDAMOS SIMBOLO STRUCT
             */
            let resultStruct = struct.ejecutar(table,tree); // retorna variables
            // console.log(nuevo_simb.valor)
            // struct.valor =entonrnoStruct; // set entorno
            if (resultStruct instanceof Errores)
                return resultStruct
            // nuevo_simb.variables = resultStruct[1];  // variables
            // nuevo_simb.valor = resultStruct[0];      // valor entorno TABLA SIMOBOLOS
            table.setSymbolTabla(nuevo_simb);
            // 
            // console.log(table.getSymbolTabla(this.id));
            // 2.1 if es nulo, solo declara
            

            if (!(this.llamada instanceof Llamada))
                return new Errores("Semantico", "Struct  " + this.tipoStruct + ": Expresion no es de tipo Llamada", this.fila, this.columna);

            
            // Ejecutando parametros
            let newTable = struct.attributes;
            console.log("STRUCTTTTTTTTTTTTTTTTTTTTTTT")
            console.log(struct)
            // valido tama;o de   parametros parameters de funcion y parametros de llamada
            if (this.llamada.parameters.length == struct.instructions.length)
            {
                let count=0;
                for (let expr of this.llamada.parameters) 
                {
                    let valueExpr = expr.ejecutar(struct.attributes,tree);

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
                            // Dos formas 1: struct intanciado|| null
                            // IF el nuevo parametro es de tipo struct
                            if(expr.tipo == TIPO.STRUCT && expr.getTipoStruct() == this.tipoStruct)
                            {
                                symbol = new Simbolo(struct.variables[count].id,TIPO.STRUCT, false, this.llamada.fila, this.llamada.columna, valueExpr.valor);
                                symbol.variables = valueExpr.variables;
                                symbol.tipoStruct = this.tipoStruct;
                            }
                            if(expr.tipo == TIPO.NULO )
                            {
                                symbol = new Simbolo(struct.variables[count].id,TIPO.STRUCT, false, this.llamada.fila, this.llamada.columna, null);
                                // symbol.variables = valueExpr.variables;
                                symbol.tipoStruct = this.tipoStruct
                            }
                            // symbol = new Simbolo(String(struct.variables[count].id),expr.tipo, true, this.llamada.fila, this.llamada.columna, valueExpr ); // seteo para variables nativas
                            
                        }else{
                            symbol = new Simbolo(struct.variables[count].id,struct.variables[count].tipo, false, this.llamada.fila, this.llamada.columna, valueExpr );
                        }
                        console.log(struct)
                        console.log(symbol)
                        let resultTable = struct.attributes.updateSymbolTabla(symbol)
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