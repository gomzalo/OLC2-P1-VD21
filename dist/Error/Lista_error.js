class Lista_Error extends Array {
    constructor() {
        super();
    }
    static getInstancia() {
        return this.instancia;
    }
}
Lista_Error.instancia = new Lista_Error();
