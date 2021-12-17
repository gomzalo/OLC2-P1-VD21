import { Ast } from "../Ast/Ast";
import { Errores } from "../Ast/Errores";
import { Nodo } from "../Ast/Nodo";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";

export  class Declaracion implements Instruccion{
    // public id;
    public tipo;
    public simbolos: Array<Simbolo>;
    public fila;
    public columna;
    public arreglo = false;

    constructor(tipo, simbolos, fila, columna){
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
            // console.log(variable.id)
            if(variable.valor != null){
                let valor = variable.valor.ejecutar(table, tree);
                //Verificando TIPOS de Variable
                let tipo_valor = variable.valor.tipo;
                // console.log("variable.valor.tipo: " + variable.valor.tipo);
                if (valor instanceof Errores)
                {
                    return valor;
                }
                if(tipo_valor == this.tipo )
                {
                    // console.log("entre tipo declaracion");
                    //--> Lo agregamos a la tabla de simbolos 
                    // console.log("SI tipo actual: " + tipo_valor + " tipo var es: " + this.tipo)
                    let nuevo_simb = new Simbolo(variable.id, this.tipo, this.arreglo, variable.fila,variable.columna,valor);
                    table.setSymbolTabla(nuevo_simb);
                }else{
                    // console.log("errorrr tipo declaracion");
                    console.log("NO tipo actual: " + tipo_valor + " tipo var es: " + this.tipo)
                    //Error no se puede declarar por incopatibilidad de simbolos
                    return new Errores("Semantico", "Declaracion " + variable.id + " -No coincide el tipo", simbolo.getFila(), simbolo.getColumna());
                }
                
            }else{
                //-- DECLARACION 1ERA VEZ -Se agrega a la tabla de simbolos 
                let nuevo_simb = new Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, null);
                

                switch(this.tipo)
                {
                    case TIPO.ENTERO:
                        nuevo_simb = new Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, 0);
                        break;
                    case TIPO.DECIMAL:
                        nuevo_simb = new Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, 0.00);
                        break;
                    case TIPO.CADENA:
                        nuevo_simb = new Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, null);
                        break;
                    case TIPO.BOOLEANO:
                        nuevo_simb = new Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, false);
                        break;
                    case TIPO.CHARACTER:
                        nuevo_simb = new Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, '0');
                        break;
                    default:
                        nuevo_simb = new Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, null);
                        break;

                }
                table.setSymbolTabla(nuevo_simb);
            }

        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented DECLARACION.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("DECLARACION","");
        for (let sim of this.simbolos)
        {
            padre.addChildNode(new Nodo(sim.id,""));
        }
        return padre;
    }

}
