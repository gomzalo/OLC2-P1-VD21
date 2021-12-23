import { Ast } from "../Ast/Ast";
import { Errores } from "../Ast/Errores";
import { Nodo } from "../Ast/Nodo";
import { Primitivo } from "../Expresiones/Primitivo";
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
                if(tipo_valor == this.tipo || (this.tipo == TIPO.DECIMAL && tipo_valor== TIPO.ENTERO ))
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
        // console.log("declaracion")
        const genc3d = tree.generadorC3d;
        for(let simbolo of this.simbolos)
        {
            let variable = simbolo as Simbolo;
            // console.log(variable.id)
            let valor = variable.valor?.translate3d(table, tree);
            
            //1 Si se crea por primera vez
            if (valor == null)
            {
                genc3d.gen_Comment("------- Default primitivo Declaracion-------");
                if(this.tipo == TIPO.DECIMAL)
                {
                    let primitivo = new Primitivo( 0,TIPO.DECIMAL, this.fila, this.columna);
                    valor = primitivo.translate3d(table,tree);
                }
                if(this.tipo == TIPO.ENTERO)
                {
                    let primitivo = new Primitivo( 0,TIPO.ENTERO, this.fila, this.columna);
                    valor = primitivo.translate3d(table,tree);
                }
                if(this.tipo == TIPO.CADENA)
                {
                    let primitivo = new Primitivo( "null",TIPO.CADENA, this.fila, this.columna);
                    valor = primitivo.translate3d(table,tree);
                }
                if(this.tipo == TIPO.BOOLEANO)
                {
                    let primitivo = new Primitivo( false,TIPO.BOOLEANO, this.fila, this.columna);
                    valor = primitivo.translate3d(table,tree);
                }
                if(this.tipo == TIPO.CHARACTER)
                {
                    let primitivo = new Primitivo( "0",TIPO.CHARACTER, this.fila, this.columna);
                    valor = primitivo.translate3d(table,tree);
                }
                /// arreglos en clase arreglo

            }
            // console.log(valor)
            // console.log("while tipos:");
            // console.log(this.tipo);
            // console.log(valor.tipo);
            console.log(!(this.tipo == TIPO.DECIMAL && valor.tipo == TIPO.ENTERO));
            if (this.tipo == valor.tipo  || (this.tipo == TIPO.DECIMAL && valor.tipo == TIPO.ENTERO)){
                
                // Verificar si guardar
                let nuevo_simb = new Simbolo(variable.id, this.tipo, this.arreglo, variable.fila,variable.columna,"");
                nuevo_simb.posicion = table.size;
                // console.log(nuevo_simb);
                // nuevo_simb.isRef=true;
                let res_simb = table.setSymbolTabla(nuevo_simb);
                if(res_simb instanceof Errores){
                    tree.updateConsolaPrintln(res_simb.toString());
                    return;
                }
                genc3d.gen_Comment("------- Declarando-------");
                ///array en declaracion array
                
                if (nuevo_simb.isGlobal) {
                    if (valor.tipo === TIPO.BOOLEANO) {
                        genc3d.gen_Comment("------- is ref true-------");
                        const lbl = genc3d.newLabel();
                        genc3d.gen_Label(valor.lblTrue);
                        genc3d.gen_SetStack(nuevo_simb.posicion, '1');
                        genc3d.gen_Goto(lbl);
                        genc3d.gen_Label(valor.lblFalse);
                        genc3d.gen_SetStack(nuevo_simb.posicion, '0');
                        genc3d.gen_Label(lbl);
                    }
                    else
                    genc3d.gen_SetStack(nuevo_simb.posicion, valor.valor);
                }
                else {
                    genc3d.gen_Comment("------- is ref false-------");
                    const temp = genc3d.newTemp(); genc3d.freeTemp(temp);
                    genc3d.gen_Exp(temp, 'p', nuevo_simb.posicion, '+');
                    if (valor.tipo === TIPO.BOOLEANO) {
                        const lbl = genc3d.newLabel();
                        genc3d.gen_Label(valor.lblTrue);
                        genc3d.gen_SetStack(nuevo_simb.posicion, '1');
                        genc3d.gen_Goto(lbl);
                        genc3d.gen_Label(valor.lblFalse);
                        genc3d.gen_SetStack(nuevo_simb.posicion, '0');
                        genc3d.gen_Label(lbl);
                    }
                    else
                        genc3d.gen_SetStack(temp, valor.valor);
                }
            }else{
                let error = new Errores("\nC3D ", `Declaracion, variable con ID: "${variable.id}", no coincide el tipo.`, simbolo.getFila(), simbolo.getColumna());
                tree.updateConsolaPrintln(error.toString());
                tree.Errores.push(error);
                return error;
            }

        }
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
