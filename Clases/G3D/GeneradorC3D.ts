import { TablaSimbolos } from './../TablaSimbolos/TablaSimbolos';
import { Nativas } from "./Nativas";

export class GeneradorC3D {
    private static generador: GeneradorC3D;
    private temporal: number;
    private label: number;
    private code: string[];
    codeFuncion: string[];
    private tempStorage: Set<string>;
    isFunc = '';

    /**
     * SINGLETON
     */
    constructor() {
        this.temporal = this.label = 0;
        this.code = [];
        this.codeFuncion = [];
        this.tempStorage = new Set();
    }

    public agregarFuncion(funcion: string[]) {
        funcion.forEach((fun) => {
            this.codeFuncion.push(fun);
        });
    }

    /**
     * @method static gET INSTANCIA
     * @returns Retorna esta misma intanca (SINGLETON)
     */
    public static getInstancia() {
        return this.generador || (this.generador = new this());
    }

    
    /**
     * 
     * @returns Retorna Temp Storage, temporales usados
     */
    public getTempStorage() {
        return this.tempStorage;
    }

    /**
     * limpia todos los temporales
     * @method clearTempStorage
     */
    public clearTempStorage() {
        this.tempStorage.clear();
    }

    /**
     * Asinacion del set al set local de temporales
     * @param tempStorage lista :Set<string>   se asigna al set local
     */
    public setTempStorage(tempStorage: Set<string>) {
        this.tempStorage = tempStorage;
    }

    
    /**
     * @method clearCode
     * Borra todo el C3D
     * Se borra temporalses, code, code de FUnciones, y el TempSotarage
     */
    public clearCode() {
        this.temporal = this.label = 0;
        this.code = [];
        this.codeFuncion = [];
        this.tempStorage = new Set();

    }

    /**
     * @method clearSoloCode
     * Borra todo el codigo guardado en this.code
     */
    public clearSoloCode() {
        this.code = [];
    }

    /**
     * @method GenerarCode genCode
     * Ingresa en el C3D el valor que se asigna como parametro
     * @param code se inserta en el array code[]
     */
    public gen_Code(code: string) {
        this.code.push(this.isFunc + code);
    }

    /**
     * Retorna el C3D que se haya generado en la clase singleton
     */
    /**
     * @method ObtenerCode
     * @returns Devuelve un String con  todo el c3d
     */
    public getCode() {
        let nativas = new Nativas();
        let encabezado = '#include <stdio.h>\n#include <math.h>\ndouble Stack[30101999]; double Heap[30101999];\nint p; int h;\n';
        let main = `\nint main() {\n${this.code.join('\n')}\n\nreturn 0;\n}\n`;
        const funciones = this.codeFuncion.join('\n');
        this.code = [];
        let strNativas = nativas.generarNativas();
        //strNativas = ''; // comentar despues de terminar
        let c3d = `${encabezado}${this.getTemps()};\n${strNativas}\n${funciones}\n${main}`;

        return c3d;
    }

    /**
     * @method getOnlyCode
     * @returns  obtiene solo el code
     */
    getOnlyCode() {
        return this.code;
    }

    /**
     * @method setOnlyCode
     * @param codeA obtieen string[]
     */
    setOnlyCode(codeA: string[]) {
        this.code = codeA;
    }

    /**
     * @method getCodeNativas getNativas
     * @returns  el codigo como string,. concatenado
     */
    getCodeNativas() {
        return this.code.join('\n');
    }

    /**
     * @method getTemps getTemporales
     * @returns todas las temporales concatenadas String
     */
    getTemps() {
        let lista = 'double ';
        for (let i = 0; i < this.temporal; i++) {
            lista += 'T' + i;
            lista += i < this.temporal - 1 ? ',' : '';
        }
        return lista;
    }

    /**
     * @method newTemp newTemporal
     * @returns Crea un nuevo temporal : String
     */
    public newTemp(): string {
        const temp = 'T' + this.temporal++;
        this.tempStorage.add(temp);
        return temp;
    }


    /**
     * @method newLabel
     * @returns Nuevo label : string
     */
    public newLabel(): string {
        return 'L' + this.label++;
    }


    /**
     * @method gen_Label genLabel
     * agrega una nueva etiqueta el C3D
     * @param label : string > se agrega etiqueta al c3d
     */
    public gen_Label(label: string) {
        // si es funcion lo agrega con el label
        this.code.push(`${this.isFunc}${label}:`);
    }

    /**
     * @method gen_Exp genExpresion
     * Genera una nueva expresion y la agrega al C3D 
     * @param tem Temporal al que se le asignara la expresion
     * @param izq Expresion izquierda que se asignara al temporal
     * @param der Expresion derecha que se asignara al temporal
     * @param operator Operador de la expresion 
     */
    public gen_Exp(tem: string, iqz: any, der: any = '', operator: string = '') {
        this.code.push(`${this.isFunc}${tem} = ${iqz} ${operator} ${der};`);
    }

    /**
     * @method genAsignaTemp genAsignacion
     * Asigna un valor a un temporal 
     * @param tem variable que recibira el parametro valor
     * @param val valor a asignar
     */
    public genAsignaTemp(tem: string, val: string) {
        this.code.push(`${this.isFunc}${tem} = ${val};`);
    }

    /**
     * @method gen_Goto genGoto
     * genera un goto con el valor de label 
     * Agrega al c3d
     * @param label etiqueta a donde redirigira el goto
     */
    public gen_Goto(label: string) {// prnGoto
        this.code.push(`${this.isFunc}goto ${label};`);
    }

    /**
     * @method gen_If genIf
     * Genera  if -> lo agrega al C3D
     * @param izq EXPR izq de la condicion if
     * @param der EXPR der de la condicion if
     * @param op Operador boleano -> condicion
     * @param label Etiqueta de salto si la condicion es TRUE
     */
    public gen_If(izq: any, der: any, op: string, label: string) {
        this.code.push(`${this.isFunc}if (${izq} ${op} ${der}) goto ${label};`);
    }

    /**
     * @method nextHeap avanzarHeap
     * Avanza el puntero heap a la posicion sigujiente
     */
    public nextHeap() { //nextHeap
        this.code.push(this.isFunc + 'h = h + 1;');
    }
    
    /**
     * @method gen_GetHeap genGetHeap
     * genera /> acceso al heap en la posicion index 
     * asigna al tem
     * @param temp temporal que recibira el valor del heap
     * @param index posicion del heap al cual se accedera
     */
    public gen_GetHeap(temp: any, index: any) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}${temp} = Heap[${index}];`);
    }

    /**
     * @method gen_SetHeap genSetHeap
     * genera una asignacion de valor al heap en la posicion index
     * @param index posicion del heap al cual se desea acceder
     * @param valor valor que se asignara a la posicion del heap
     */
    public gen_SetHeap(index: any, valor: any) { // prnsetheap
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}Heap[${index}] = ${valor};`);
    }

    /**
     * @method gen_GetStack genGetStack
     * genera una asignacion a tem del valor del stack en la posicion index
     * @param temp temporal al cual se asignara el valor del stack
     * @param index posicion del stack al cual se desea acceder
     */
    public gen_GetStack(temp: any, index: any) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}${temp} = Stack[${index}];`);
    }

    /**
     * @method gen_SetStack genSetStack
     * genera una asignacion al stack en la posicion index
     * @param index posicion del stack al cual se desea acceder
     * @param value valor que sera asignado al stack
     */
    public gen_SetStack(index: any, value: any) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}Stack[${index}] = ${value};`);
    }

    /**
     * @method gen_NextEnv genNextEnv
     * genera un desplazamiento del stack para generar un nuevo ambito
     * @param size posiciones que se desplazara el stack
     */
    public gen_NextEnv(size: number) {
        this.code.push(`${this.isFunc}p = p + ${size};`);
    }

    /**
     * @method gen_AntEnv genAntEnv
     * genera un desplazamiento del stack para volver a un ambito anterios
     * @param size posiciones que se desplazara el stack
     */
    public gen_AntEnv(size: number) {
        this.code.push(`${this.isFunc}p = p - ${size};`);
    }

    /**
     * @method gen_Call genCall
     * genera una llamada a una funcion
     * @param id nombre de la funcion
     */
    public gen_Call (id: string) {
        this.code.push(`${this.isFunc}${id}();`);
    }

    /**
     * @method gen_Funcion genFuncion
     * Genera el encabezado de una funcion 
     * @param id nombre de la funcion
     */
    public gen_Funcion(id: string) {
        this.code.push(`\nvoid ${id}() {`);
    }

    /**
     * @method gen_EndFunction  genEndFuncion
     * Genera el cierre de la definicion de una funcion
     */
    public gen_EndFunction() {
        this.code.push('}')
    }

    /**
     * @method gen_Print genPrint
     * genera un printf con el tipo de dato y el valor
     * @param formato tipo de dato que se va a imprimir
     * @param valor valor que se va a imprimir
     */
    public gen_Print(formato: string, valor: any) {
        valor = valor[0] === 'T' && formato !== 'f' ? '(int)' + valor : valor;
        this.code.push(`${this.isFunc}printf("%${formato}",${valor});`);
    }

    /**
     * @method gen_PrintTrue genPrintTrue
     * genera un print del valor true
     */
    public gen_PrintTrue() {
        this.gen_Print('c', 't'.charCodeAt(0));
        this.gen_Print('c', 'r'.charCodeAt(0));
        this.gen_Print('c', 'u'.charCodeAt(0));
        this.gen_Print('c', 'e'.charCodeAt(0));
    }

    /**
     * @method gen_PrintFalse gen_PrintFalse
     * genera un print del valor false
     */
    public gen_PrintFalse() {
        this.gen_Print('c', 'f'.charCodeAt(0));
        this.gen_Print('c', 'a'.charCodeAt(0));
        this.gen_Print('c', 'l'.charCodeAt(0));
        this.gen_Print('c', 's'.charCodeAt(0));
        this.gen_Print('c', 'e'.charCodeAt(0));
    }

    /**
     * @method gen_PrintNull gen_PrintNull
     * genera un print del valor null
     */
    public gen_PrintNull() {
        this.gen_Print('c', 'n'.charCodeAt(0));
        this.gen_Print('c', 'u'.charCodeAt(0));
        this.gen_Print('c', 'l'.charCodeAt(0));
        this.gen_Print('c', 'l'.charCodeAt(0));
    }

    /**
     * @method gen_Comment genComentario
     * 
     * @param comment  comentario
     */
    public gen_Comment(comment: string) {
        this.code.push(`${this.isFunc}// ----- ${comment} -----`);
    }

    /**
     * @method freeTemp freeTemp
     * libera temp del storage
     * @param temp temporal a liberar
     */
    public freeTemp(temp: string) {
        if (this.tempStorage.has(temp)) {
            this.tempStorage.delete(temp);
        }
    }

    /**
     * @method gen_Temp genTemp
     * agrega un temporal al storage
     * @param temp temporal que se agregara al storage
     */
    public gen_Temp(temp: string) {
        if (!this.tempStorage.has(temp))
            this.tempStorage.add(temp);
    }

    public salvandoTemporales(entorno: TablaSimbolos): number {
        if (this.tempStorage.size > 0) {
            const temp = this.newTemp(); this.freeTemp(temp);
            let size = 0;

            this.gen_Comment('Guardado de temporales en el stack');
            this.gen_Exp(temp, 'p', entorno.size, '+');
            this.tempStorage.forEach((value) => {
                size++;
                this.gen_SetStack(temp, value);
                if (size != this.tempStorage.size)
                    this.gen_Exp(temp, temp, '1', '+');
            });
            this.gen_Comment('Se guardo los temporales en el stack');
        }
        let ptr = entorno.size;
        entorno.size = ptr + this.tempStorage.size;
        return ptr;
    }

    public recuperandoTemporales(entorno: TablaSimbolos, pos: number) {
        if (this.tempStorage.size > 0) {
            const temp = this.newTemp(); this.freeTemp(temp);
            let size = 0;

            this.gen_Comment('Sacando los temporales del Stack');
            this.gen_Exp(temp, 'p', pos, '+');
            this.tempStorage.forEach((value) => {
                size++;
                this.gen_GetStack(value, temp);
                if (size != this.tempStorage.size)
                    this.gen_Exp(temp, temp, '1', '+');
            });
            this.gen_Comment('Se sacaron los temporales del Stack');
            entorno.size = pos;
        }
    }
}