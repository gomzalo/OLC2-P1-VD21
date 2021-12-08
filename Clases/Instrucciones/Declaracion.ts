import { Ast } from "../Ast/Ast";
import { Errores } from "../Ast/Errores";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";

export  class Declaracion implements Instruccion{
    // public id;
    public tipo;
    public simbolos: Array<Simbolo>;
    public fila;
    public columna;
    public arreglo = false;

    constructor(tipo,fila,columna,simbolos /*= null*/){
        // this.id = id;
        this.tipo= tipo;
        this.simbolos = simbolos;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = false;
    }
    ejecutar(table: TablaSimbolos, tree: Ast) {

        for(let simbolo of this.simbolos){

            let variable = simbolo as Simbolo;

            //--> verifico que la variable no exista en la tabla de simbolos actual \
            // if(table.existeEnActual(variable.identificador))
            // {
            //     let error = new Errores('Semantico', `La variable ${variable.identificador} ya existe en el entorno actual.`, this.linea, this.columna);
            //     controlador.errores.push(error);
            //     controlador.append(`** Error Semantico : La variable ${variable.identificador} ya existe en el entorno actual. En la linea ${this.linea} y columna ${this.columna}`);
            //     continue;
            // }

            //int p1 = 2;
            // int p2;
            if(variable.valor != null){
                let valor = variable.valor.ejecutar(table, tree);

                //Verificando TIPOS de Variable
                let tipo_valor = variable.valor.getTipo();
                if (valor instanceof Errores)
                {
                    return valor;
                }
                if(tipo_valor == this.tipo )
                {
                    //--> Lo agregamos a la tabla de simbolos 
                    let nuevo_simb = new Simbolo(variable.id, this.tipo, null, variable.fila,variable.columna,valor);
                    table.setSymbolTabla(nuevo_simb);
                }else{
                    //Error no se puede declarar por incopatibilidad de simbolos
                    return new Excepcion("Semantico", "Declaracion " + variable.id + " -No coincide el tipo", simbolo.getFila(), simbolo.getColumna());
                }
                
            }else{
                //-- Se agrega a la tabla de simbolos 
                let nuevo_simb = new Simbolo(variable.id, this.tipo, null, variable.fila,variable.columna,null);
                table.setSymbolTabla(nuevo_simb);
            }

        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}
