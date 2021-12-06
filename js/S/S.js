// class S extends Nodo{
//     public entornoGlobal:Entorno = new Entorno(null);
//     constructor(nombre:string,valor:null,fila:number,columna:number){
//         super(nombre,valor,fila,columna);
//     }
//     ejecutar(entorno:Entorno){
//         //DECLARACION METODOS
//         for(let instruccion of this.getHijos()){
//             if( instruccion instanceof Declaracion_Funcion ){
//                 instruccion.ejecutar(entorno);
//             }            
//         }
//         for(let instruccion of this.getHijos()){
//             if( instruccion instanceof Declaracion_Funcion ){
//                 //instruccion.ejecutar(this.entornoGlobal);
//             }else{
//                 instruccion.ejecutar(entorno);
//             }
//         }
//         //Lista_Imprimir.getInstance().push("********** T A B L A   D E   S I M B O L O S **********");
//         //Lista_Imprimir.getInstance().push(entorno.imprimirEntorno());
//         //Lista_Imprimir.getInstance().push("*******************************************************");
//         return null;
//     }
//     traducir(entorno:Entorno):string{
//         let traduccion = "/* Texto Traduccion */\n";
//         for( let instruccion of this.getHijos() ){
//             traduccion += instruccion.traducir(entorno);
//             if( instruccion instanceof Sentencia_While )
//                 traduccion += "\n";
//             else
//                 traduccion += ";\n";
//         }
//         return traduccion;
//     }
// }
