import { Ast } from "../Ast/Ast";
import { Errores} from "../Ast/Errores";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";
import { Simbolo } from "../TablaSimbolos/Simbolo"
import { Nodo } from "../Ast/Nodo";

export class Identificador implements Instruccion{
    public id : string ;
    public fila: number ;
    public columna :  number;
    public tipo : TIPO;
    public tipoStruct : string;
    public symbol :Simbolo| any;
    arreglo: boolean;
    
    constructor(id:string, fila, columna){
        this.id =id
        this.fila = fila
        this.columna = columna
        this.tipo = null;
    }
    
    ejecutar(table: TablaSimbolos, tree: Ast) {
        // console.log(table.existeEnActual(this.id));
        // console.log((table));
        // table.getSymbolTabla(this.id);
        this.symbol = table.getSymbolTabla(this.id);
        // console.log(table.getSymbolTabla(this.id));

        if (this.symbol == null){
            return new Errores("Semantico", "Variable " + this.id + " NO coincide con la busqueda", this.fila, this.columna);
        }
        this.tipo = this.symbol.getTipo()
        console.log(`tipo id: ${this.tipo}`)
        if (this.tipo == TIPO.STRUCT)
        {
            this.tipoStruct = this.symbol.getTipoStruct()
            return this.symbol;
        }
        return this.symbol.getValor()
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("IDENTIFICADOR","");
        padre.addChildNode(new Nodo(this.id.toString(),""));
        return padre;
    }

}