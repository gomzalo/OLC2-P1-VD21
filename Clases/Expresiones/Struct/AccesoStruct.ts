import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Identificador } from "../Identificador";

export class AccesoStruct implements Instruccion{
    fila: number;
    columna: number;
    arreglo: boolean;
    public id: string;
    public idStruct;
    public tipo : TIPO;
    // public simboloStruct :Simbolo;
    public expresiones: Identificador; // OBjeto de objetos Identificador
    // { expresiones: [],
    // identificador:
    //  }
    public accesoAttributes: TablaSimbolos;

    constructor(idStruct,expresiones,fila,columna )
    {
        this.idStruct = idStruct;
        this.expresiones = expresiones;
        this.fila = fila,
        this.columna = columna;
        this.tipo = TIPO.STRUCT
    }
    
    ejecutar(table: TablaSimbolos, tree: Ast) {
        let simboloStruct = this.idStruct.ejecutar(table,tree);
        this.id= this.idStruct.id; 
        if (simboloStruct == null){
            return new Errores("Semantico", "Struct " + this.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
        }
        if (simboloStruct.tipo != TIPO.STRUCT)
        {
            return new Errores("Semantico", "Struct " + this.id + " NO es TIPO STRUCT", this.fila, this.columna);
        }

        // Acceso atributos
        // let value = this.accesoAttribute(this.expresiones, simboloStruct.valor)
        console.log(this.expresiones)
        let resultAcceso = this.expresiones.ejecutar(simboloStruct.getValor(),tree);
        return resultAcceso;


        let entornoAttributes = simboloStruct.getValor();
        
        // if (this.expresiones.expresiones.length >0)
        // {
        //     return this.accesoAttribute(this.expresiones.expresiones,entornoAttributes,tree);
        // }else{
        //     return null;
        // }



        // let valueId = null;
        // for (let expr of this.expresiones)
        // {
        //     return valueId = expr.ejecutar(entornoAttributes,tree);
        // }

    }
    
    accesoAttribute(expresion : Instruccion| Identificador | any,entornoPadre: TablaSimbolos, tree:Ast, )
    {
        // let entornoAttributes = null;
        // if (expresion.tipo == TIPO.STRUCT)
        // {
        //     entornoAttributes = entorno.getValor();
        // }
        if (entornoPadre == null)
        {
            return new Errores("Semantico", "Acceso Atributo Struct: "+ this.id +", no encontrado", this.fila, this.columna);;
        }else{
            let resultIdentificador = expresion.identificador.ejecutar(entornoPadre,tree); //TablaSimbolos || resultado
            //recomiendo su array de expresiones
            
            if (resultIdentificador instanceof TablaSimbolos && expresion.expresiones.length >0)
            {
                // 2 if is TablasSimbolos
                return this.accesoAttribute(expresion.expresiones, resultIdentificador, tree);
            }else{
                //error
                if (resultIdentificador instanceof Errores){
                    return resultIdentificador;
                }
                return resultIdentificador;
            }
            // if (value instanceof Errores)
            // {
            //     tree.getErrores().push(result);
            //     tree.updateConsolaPrintln(result.toString());
            // }
            // if (result instanceof Identificador)
            // {
            //     if (result.tipo == TIPO.STRUCT){}
            //     {

            //     }
            // }

        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}