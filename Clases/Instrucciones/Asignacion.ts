import { Ast } from "../Ast/Ast";
import { Errores } from "../Ast/Errores";
import { Nodo } from "../Ast/Nodo";
import { Retorno } from "../G3D/Retorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";
import { Return } from "./Transferencia/Return";

export class Asignacion implements Instruccion{
    public id: string;
    public expresion : any;
    public fila : number;
    public columna : number;
    arreglo = false;
    
    constructor(id:string, expresion, fila, columna){
        this.id = id;
        this.expresion = expresion;
        this.fila = fila;
        this.columna =columna;
    }
    
    ejecutar(table: TablaSimbolos, tree: Ast) {
        if (table.existe(this.id)){
            let valor = this.expresion.ejecutar(table,tree );
            // console.log(valor)

            if (valor instanceof Errores)
            {
                return valor;
            }
            if (valor instanceof Return)
            {
                let temp : Return;
                temp = valor;
                // // validacion struct
                /**
                 * Agregar struct y arreglos aca
                 */
                // if (temp.valor instanceof Struct){

                // }
                valor = temp.valor;
            }
            /**
             * Agregar struct y arreglos aca
             */
            // console.log(`Existe id: ${this.id} ${table.existe(this.id)}`);
            let getSym = table.getSymbolTabla(this.id);
            let update = new Simbolo(this.id, this.expresion.tipo, this.arreglo, this.fila,this.columna,valor); 
            if (getSym != null)
            {
                update.tipoStruct = getSym.tipoStruct;
                update.variables = getSym.variables;
                update.tipo = getSym.tipo;
                update.arreglo = getSym.arreglo;
            }
            let result = table.updateSymbolTabla(update);
            
            
            if (result instanceof Errores){
                // console.log(result);
                // console.log(`tipoo exp: ${this.expresion.tipo} `)
                // console.log(`error en updateSymbol ${this.id} `)
                return result;
            }
        }else{
            return new Errores("Semantico", `Variable con ID: "${this.id}", no encontrada en asignacion.`, this.fila,this.columna);
        }
        return null
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        let genc3d = tree.generadorC3d;
        genc3d.gen_Comment("----------- ASIGNANDO ----------");
        if(table.existe(this.id)){
            console.log("asignacion");
            console.log(this.id);
            let varSymb = table.getSymbolTabla(this.id);
            if (varSymb == null){
                let error = new Errores("C3D ", `Asignacion, variable con ID: "${this.id}", no se encontro.`, this.fila, this.columna);;
                tree.updateConsolaPrintln(error.toString());
                tree.Errores.push(error);
                return error;
            }
            let retActual;
            
            if (varSymb.isGlobal) {
                retActual= new Retorno(String(varSymb.posicion), false, varSymb.tipo, varSymb);
            }
            else {
                const temp = genc3d.newTemp();
                genc3d.gen_Exp(temp, 'p', varSymb.posicion, '+');
                retActual =  new Retorno(temp, true, varSymb.tipo, varSymb);
            }
            //obteniendo resultado
            let valorExp = this.expresion.translate3d(table,tree);
            if (varSymb.tipo === TIPO.ENTERO && valorExp.tipo === TIPO.DECIMAL)
                varSymb.tipo = valorExp.tipo;

            // if(varSymb?.inHeap || varSymb?.isGlobal){
            if(varSymb?.inHeap){
                if (varSymb.tipo == TIPO.BOOLEANO) {
                    let templabel = genc3d.newLabel();
                    genc3d.gen_Label(valorExp.lblTrue);
                    genc3d.gen_SetHeap(retActual.valor, '1');
                    genc3d.gen_Goto(templabel);
                    genc3d.gen_Label(valorExp.lblFalse);
                    genc3d.gen_SetHeap(retActual.valor, '0');
                    genc3d.gen_Label(templabel);
                }
                else {
                    genc3d.gen_SetHeap(retActual.valor, valorExp.valor);
                    table.updateSymbolTabla(new Simbolo(this.id, this.expresion.tipo, this.arreglo, this.fila, this.columna, valorExp.valor));
                }
            }else{
                if (varSymb.tipo == TIPO.BOOLEANO) {
                    const templabel = genc3d.newLabel();
                    genc3d.gen_Label(valorExp.lblTrue);
                    genc3d.gen_SetStack(retActual.valor, '1');
                    genc3d.gen_Goto(templabel);
                    genc3d.gen_Label(valorExp.lblFalse);
                    genc3d.gen_SetStack(retActual.valor, '0');
                    genc3d.gen_Label(templabel);
                }
                else {
                    genc3d.gen_SetStack(retActual.valor, valorExp.valor);
                    table.updateSymbolTabla(new Simbolo(this.id, this.expresion.tipo, this.arreglo, this.fila, this.columna, valorExp.valor));
                }
            }
        }else{
            let error = new Errores("C3D ", `Asignacion, variable con ID: "${this.id}", no se encontro.`, this.fila, this.columna);;
            tree.updateConsolaPrintln(error.toString());
            tree.Errores.push(error);
            return error;
        }
        

    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("ASIGNACION","");
        padre.addChildNode(new Nodo(this.id,""));
        padre.addChildNode(this.expresion.recorrer(table,tree));
        return padre;
    }


}