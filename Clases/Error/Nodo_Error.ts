enum TipoError{
    ERROR_LEXICO,ERROR_SINTACTICO,ERROR_SEMANTICO
}

class Nodo_Error{

    private typeError:TipoError;
    private mensaje:string;
    private fila:number;
    private columna:number;

    constructor(typeError:TipoError,mensaje:string,fila:number,columna:number){
        this.typeError = typeError;
        this.mensaje = mensaje;
        this.fila = fila;
        this.columna = columna;
    }

    public isErrorLexico():boolean{
        return this.typeError == TipoError.ERROR_LEXICO;
    }

    public isErrorSintactico():boolean{
        return this.typeError == TipoError.ERROR_SINTACTICO;
    }

    public isErrorSemantico():boolean{
        return this.typeError == TipoError.ERROR_SEMANTICO;
    }

    public getTypeError():TipoError{
        return this.typeError;
    }

    public setTypeError(typeError:TipoError){
        this.typeError = typeError;
    }

    public getMensaje():string{
        return this.mensaje;
    }

    public setMensaje(mensaje:string){
        this.mensaje = mensaje;
    }

    public getFila():number{
        return this.fila;
    }

    public setFila(fila:number){
        this.fila = fila;
    }

    public getColumna():number{
        return this.columna;
    }

    public setColumna(columna:number){
        this.columna = columna;
    }

}