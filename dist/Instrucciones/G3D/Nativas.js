"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nativas = void 0;
const GeneradorC3D_1 = require("./GeneradorC3D");
class Nativas {
    generarNativas() {
        this.nativa_print_str();
        //this.nativa_print_integer();
        this.nativa_compararIgual_str_str();
        // this.nativa_compararNoIgual_str_str();
        //this.nativa_ToUpperCase();
        //this.nativa_ToLowerCase();
        this.nativa_concat_str_str();
        //this.nativa_concat_dbl_str();
        //  this.nativa_concat_str_dbl();
        this.nativa_concat_int_str();
        this.nativa_concat_str_int();
        //this.nativa_concat_str_bol();
        // this.nativa_concat_bol_str();
        //this.nativa_lenght_str();
        return GeneradorC3D_1.GeneradorC3D.getInstancia().getCodeNativas();
    }
    nativa_lenght_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let next = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_lenght_str');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t0, 'p', '1', '+');
        genC3d.gen_GetStack(t1, t0);
        genC3d.genAsignaTemp(t3, '0');
        genC3d.gen_Label(next);
        genC3d.gen_GetHeap(t2, t1);
        genC3d.gen_If(t2, '-1', '==', fin);
        genC3d.gen_Exp(t3, t3, '1', '+');
        genC3d.gen_Exp(t1, t1, '1', '+');
        genC3d.gen_Goto(next);
        genC3d.gen_Label(fin);
        genC3d.gen_SetStack('p', t3);
        genC3d.gen_Code('return;');
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t0);
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
    }
    nativa_print_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let next = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_print_str');
        genC3d.isFunc = '\t';
        genC3d.gen_GetStack(t1, 'p');
        genC3d.gen_Label(next);
        genC3d.gen_GetHeap(t2, t1);
        genC3d.gen_If(t2, '-1', '==', fin);
        genC3d.gen_Print('c', t2);
        genC3d.gen_Exp(t1, t1, '1', '+');
        genC3d.gen_Goto(next);
        genC3d.gen_Label(fin);
        genC3d.gen_Code('return;');
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
    }
    /*
        nativa_print_integer() {
            const genC3d = GeneradorC3D.getInstancia();
            let t1 = genC3d.newTemp();
            let t2 = genC3d.newTemp();
            let t3 = genC3d.newTemp();
            let inicio = genC3d.newLabel();
            let nextPos = genC3d.newLabel();
            let nextPrt = genC3d.newLabel();
            let fin = genC3d.newLabel();
    
            genC3d.gen_Funcion('nativa_print_integer');
            genC3d.isFunc = '\t';
            genC3d.gen_GetStack(t1, 'p');
            genC3d.gen_If(t1, '0', '>=', inicio);
            genC3d.gen_Print('c', '45');
            genC3d.gen_Exp(t1, t1, '-1', '*');
            genC3d.gen_Label(inicio);
            genC3d.genAsignaTemp(t3, 'p');
            genC3d.gen_SetStack(t3, '-1');
            genC3d.gen_Exp(t3, t3, '1', '+');
            genC3d.gen_Label(nextPos);
            genC3d.gen_If(t1, '0', '==', nextPrt);
            genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
            genC3d.gen_SetStack(t3, t2);
            genC3d.gen_Exp(t3, t3, '1', '+');
            genC3d.gen_Exp(t1, t1, '10', '/');
            genC3d.gen_Goto(nextPos);
            genC3d.gen_Label(nextPrt);
            genC3d.gen_Exp(t3, t3, '1', '-');
            genC3d.gen_GetStack(t1, t3);
            genC3d.gen_If(t1, '-1', '==', fin);
            genC3d.gen_Print('i', t1);
            genC3d.gen_Goto(nextPrt);
            genC3d.gen_Label(fin);
            genC3d.gen_Code('return;');
            genC3d.gen_EndFunction();
            genC3d.isFunc = '';
            genC3d.freeTemp(t1);
            genC3d.freeTemp(t2);
            genC3d.freeTemp(t3);
        }*/
    nativa_compararIgual_str_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let c1 = genC3d.newTemp();
        let c2 = genC3d.newTemp();
        let lblfalse = genC3d.newLabel();
        let lbltrue = genC3d.newLabel();
        let l2 = genC3d.newLabel();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_compararIgual_str_str');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t0, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t0);
        genC3d.gen_Exp(t0, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t0);
        genC3d.gen_If(p1, '-1', '==', l2);
        genC3d.gen_If(p2, '-1', '==', lblfalse);
        genC3d.gen_Goto(inicio);
        genC3d.gen_Label(l2);
        genC3d.gen_If(p2, '-1', '==', lbltrue);
        genC3d.gen_Goto(lblfalse);
        genC3d.gen_Label(inicio);
        genC3d.gen_GetHeap(c1, p1);
        genC3d.gen_GetHeap(c2, p2);
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(c1, c2, '!=', lblfalse);
        genC3d.gen_If(c1, '-1', '==', lbltrue);
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_GetHeap(c1, p1);
        genC3d.gen_GetHeap(c2, p2);
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(lbltrue);
        genC3d.gen_SetStack('p', '1');
        genC3d.gen_Goto(fin);
        genC3d.gen_Label(lblfalse);
        genC3d.gen_SetStack('p', '0');
        genC3d.gen_Label(fin);
        genC3d.gen_Code('return;');
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
        genC3d.freeTemp(c1);
        genC3d.freeTemp(c2);
    }
    nativa_compararNoIgual_str_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let c1 = genC3d.newTemp();
        let c2 = genC3d.newTemp();
        let lblfalse = genC3d.newLabel();
        let lbltrue = genC3d.newLabel();
        let l2 = genC3d.newLabel();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_compararNoIgual_str_str');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.gen_If(p1, '-1', '==', l2);
        genC3d.gen_If(p2, '-1', '==', lbltrue);
        genC3d.gen_Goto(inicio);
        genC3d.gen_Label(l2);
        genC3d.gen_If(p2, '-1', '==', lblfalse);
        genC3d.gen_Goto(lbltrue);
        genC3d.gen_Label(inicio);
        genC3d.gen_GetHeap(c1, p1);
        genC3d.gen_GetHeap(c2, p2);
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(c1, c2, '!=', lbltrue);
        genC3d.gen_If(c1, '-1', '==', lblfalse);
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_GetHeap(c1, p1);
        genC3d.gen_GetHeap(c2, p2);
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(lbltrue);
        genC3d.gen_SetStack('p', '1');
        genC3d.gen_Goto(fin);
        genC3d.gen_Label(lblfalse);
        genC3d.gen_SetStack('p', '0');
        genC3d.gen_Label(fin);
        genC3d.gen_Code('return;');
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
        genC3d.freeTemp(c1);
        genC3d.freeTemp(c2);
    }
    nativa_ToUpperCase() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let t4 = genC3d.newTemp();
        let nextPos = genC3d.newLabel();
        let setChar = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_ToUpperCase');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(t2, t1); // carga la referencia del string
        genC3d.genAsignaTemp(t3, 'h'); // inicio de posicion vacia del heap
        genC3d.gen_Label(nextPos);
        genC3d.gen_GetHeap(t4, t2);
        genC3d.gen_If(t4, '-1', '==', fin);
        genC3d.gen_If(t4, '97', '<', setChar);
        genC3d.gen_If(t4, '122', '>', setChar);
        genC3d.gen_Exp(t4, t4, '32', '-');
        genC3d.gen_Label(setChar);
        genC3d.gen_SetHeap('h', t4);
        genC3d.nextHeap();
        genC3d.gen_Exp(t2, t2, '1', '+');
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t3);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
        genC3d.freeTemp(t4);
    }
    nativa_ToLowerCase() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let t4 = genC3d.newTemp();
        let nextPos = genC3d.newLabel();
        let setChar = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_ToLowerCase');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(t2, t1); // carga la referencia del string
        genC3d.genAsignaTemp(t3, 'h'); // inicio de posicion vacia del heap
        genC3d.gen_Label(nextPos);
        genC3d.gen_GetHeap(t4, t2);
        genC3d.gen_If(t4, '-1', '==', fin);
        genC3d.gen_If(t4, '65', '<', setChar);
        genC3d.gen_If(t4, '90', '>', setChar);
        genC3d.gen_Exp(t4, t4, '32', '+');
        genC3d.gen_Label(setChar);
        genC3d.gen_SetHeap('h', t4);
        genC3d.nextHeap();
        genC3d.gen_Exp(t2, t2, '1', '+');
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t3);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
        genC3d.freeTemp(t4);
    }
    nativa_concat_str_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let str1 = genC3d.newLabel();
        let str2 = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_concat_str_str');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t1, 'h');
        genC3d.gen_Label(str1);
        genC3d.gen_GetHeap(t2, p1);
        genC3d.gen_If(t2, '-1', '==', str2);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Goto(str1);
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t2, p2);
        genC3d.gen_If(t2, '-1', '==', fin);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t1);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    nativa_concat_int_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let validar = genC3d.newLabel();
        let str1 = genC3d.newLabel();
        let str2 = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_concat_int_str');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_If(p1, '0', '>=', inicio);
        genC3d.gen_SetHeap('h', '45');
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '-1', '*');
        genC3d.gen_Label(inicio);
        genC3d.genAsignaTemp(t1, '0');
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(p1, '0', '==', validar);
        genC3d.gen_Exp(t1, t1, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${p1}, 10);`);
        //genC3d.gen_Exp(t2, '(int)' + p1, '10', '%');
        genC3d.gen_Exp(t1, t1, t2, '+');
        genC3d.gen_Exp(p1, p1, '10', '/');
        genC3d.gen_Code(p1 + ' = (int)' + p1 + ';');
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(validar);
        genC3d.gen_If(t1, '0', '!=', str1);
        genC3d.gen_SetHeap('h', '48');
        genC3d.nextHeap();
        genC3d.gen_Label(str1);
        genC3d.gen_If(t1, '0', '==', str2);
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        //genC3d.gen_Exp(t2, '(int)' + t1, '10', '%');
        genC3d.gen_Exp(t2, t2, '48', '+');
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(t1, t1, '10', '/');
        genC3d.gen_Code(t1 + ' = (int)' + t1 + ';');
        genC3d.gen_Goto(str1);
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t2, p2);
        genC3d.gen_If(t2, '-1', '==', fin);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    nativa_concat_str_int() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let pre = genC3d.newLabel();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let validar = genC3d.newLabel();
        let str1 = genC3d.newLabel();
        let str2 = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_concat_str_int');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t2, p1);
        genC3d.gen_If(t2, '-1', '==', pre);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(pre);
        genC3d.gen_If(p2, '0', '>=', inicio);
        genC3d.gen_SetHeap('h', '45');
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '-1', '*');
        genC3d.gen_Label(inicio);
        genC3d.genAsignaTemp(t1, '0');
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(p2, '0', '==', validar);
        genC3d.gen_Exp(t1, t1, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${p2}, 10);`);
        //genC3d.gen_Exp(t2, '(int)' + p2, '10', '%');
        genC3d.gen_Exp(t1, t1, t2, '+');
        genC3d.gen_Exp(p2, p2, '10', '/');
        genC3d.gen_Code(p2 + ' = (int)' + p2 + ';');
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(validar);
        genC3d.gen_If(t1, '0', '!=', str1);
        genC3d.gen_SetHeap('h', '48');
        genC3d.nextHeap();
        genC3d.gen_Label(str1);
        genC3d.gen_If(t1, '0', '==', fin);
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        //genC3d.gen_Exp(t2, '(int)' + t1, '10', '%');
        genC3d.gen_Exp(t2, t2, '48', '+');
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(t1, t1, '10', '/');
        genC3d.gen_Code(t1 + ' = (int)' + t1 + ';');
        genC3d.gen_Goto(str1);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    nativa_concat_dbl_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let t4 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let pre = genC3d.newLabel();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let validar = genC3d.newLabel();
        let str1 = genC3d.newLabel();
        let strd = genC3d.newLabel();
        let str2 = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_concat_dbl_str');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_If(p1, '0', '>=', pre);
        genC3d.gen_SetHeap('h', '45');
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '-1', '*');
        genC3d.gen_Label(pre);
        genC3d.gen_Code(`${t1} = (int)${p1};`);
        //genC3d.gen_Code(`${t2} = fmod(${p1}, 1);`);
        genC3d.genAsignaTemp(t3, '0');
        genC3d.gen_Label(inicio);
        genC3d.gen_If(t1, '0', '==', validar);
        genC3d.gen_Exp(t3, t3, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        genC3d.gen_Exp(t3, t3, t2, '+');
        genC3d.gen_Exp(t1, t1, '10', '/');
        genC3d.gen_Code(`${t1} = (int)${t1};`);
        genC3d.gen_Goto(inicio);
        genC3d.gen_Label(validar);
        genC3d.gen_If(t3, '0', '!=', nextPos);
        genC3d.gen_SetHeap('h', '48');
        genC3d.nextHeap();
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(t3, '0', '==', str1);
        genC3d.gen_Code(`${t1} = fmod(${t3}, 10);`);
        genC3d.gen_Exp(t3, t3, '10', '/');
        genC3d.gen_Code(`${t3} = (int)${t3};`);
        genC3d.gen_Exp(t2, t1, '48', '+');
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(str1);
        genC3d.gen_SetHeap('h', '46');
        genC3d.nextHeap();
        genC3d.genAsignaTemp(t3, '0');
        genC3d.gen_Code(`${t1} = fmod(${p1}, 1);`);
        genC3d.gen_Label(strd);
        genC3d.gen_If(t3, '3', '==', str2);
        genC3d.gen_Exp(t1, t1, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        genC3d.gen_Code(`${t2} = (int)${t2};`);
        genC3d.gen_Exp(t4, t2, '48', '+');
        genC3d.gen_SetHeap('h', t4);
        genC3d.nextHeap();
        genC3d.gen_Exp(t3, t3, '1', '+');
        genC3d.gen_Goto(strd);
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t2, p2);
        genC3d.gen_If(t2, '-1', '==', fin);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
        genC3d.freeTemp(t4);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    nativa_concat_str_dbl() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let t4 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let pre = genC3d.newLabel();
        let sig = genC3d.newLabel();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let validar = genC3d.newLabel();
        let str1 = genC3d.newLabel();
        let strd = genC3d.newLabel();
        let str2 = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_concat_str_dbl');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t2, p1);
        genC3d.gen_If(t2, '-1', '==', sig);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(sig);
        genC3d.gen_If(p2, '0', '>=', pre);
        genC3d.gen_SetHeap('h', '45');
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '-1', '*');
        genC3d.gen_Label(pre);
        genC3d.gen_Code(`${t1} = (int)${p2};`);
        //genC3d.gen_Code(`${t2} = fmod(${p2}, 1);`);
        genC3d.genAsignaTemp(t3, '0');
        genC3d.gen_Label(inicio);
        genC3d.gen_If(t1, '0', '==', validar);
        genC3d.gen_Exp(t3, t3, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        genC3d.gen_Exp(t3, t3, t2, '+');
        genC3d.gen_Exp(t1, t1, '10', '/');
        genC3d.gen_Code(`${t1} = (int)${t1};`);
        genC3d.gen_Goto(inicio);
        genC3d.gen_Label(validar);
        genC3d.gen_If(t3, '0', '!=', nextPos);
        genC3d.gen_SetHeap('h', '48');
        genC3d.nextHeap();
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(t3, '0', '==', str1);
        genC3d.gen_Code(`${t1} = fmod(${t3}, 10);`);
        genC3d.gen_Exp(t3, t3, '10', '/');
        genC3d.gen_Code(`${t3} = (int)${t3};`);
        genC3d.gen_Exp(t2, t1, '48', '+');
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(str1);
        genC3d.gen_SetHeap('h', '46');
        genC3d.nextHeap();
        genC3d.genAsignaTemp(t3, '0');
        genC3d.gen_Code(`${t1} = fmod(${p2}, 1);`);
        genC3d.gen_Label(strd);
        genC3d.gen_If(t3, '3', '==', fin);
        genC3d.gen_Exp(t1, t1, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        genC3d.gen_Code(`${t2} = (int)${t2};`);
        genC3d.gen_Exp(t4, t2, '48', '+');
        genC3d.gen_SetHeap('h', t4);
        genC3d.nextHeap();
        genC3d.gen_Exp(t3, t3, '1', '+');
        genC3d.gen_Goto(strd);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
        genC3d.freeTemp(t4);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    nativa_concat_str_bol() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let str1 = genC3d.newLabel();
        let bol = genC3d.newLabel();
        let lblf = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_concat_str_bol');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_Label(str1);
        genC3d.gen_GetHeap(t1, p1);
        genC3d.gen_If(t1, '-1', '==', bol);
        genC3d.gen_SetHeap('h', t1);
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Goto(str1);
        genC3d.gen_Label(bol);
        genC3d.gen_If(p2, '1', '!=', lblf);
        genC3d.gen_SetHeap('h', '116');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '114');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '117');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '101');
        genC3d.nextHeap();
        genC3d.gen_Goto(fin);
        genC3d.gen_Label(lblf);
        genC3d.gen_SetHeap('h', '102');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '97');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '108');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '115');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '101');
        genC3d.nextHeap();
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    nativa_concat_bol_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let str2 = genC3d.newLabel();
        let lblf = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('nativa_concat_bol_str');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_If(p1, '1', '!=', lblf);
        genC3d.gen_SetHeap('h', '116');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '114');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '117');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '101');
        genC3d.nextHeap();
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(lblf);
        genC3d.gen_SetHeap('h', '102');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '97');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '108');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '115');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '101');
        genC3d.nextHeap();
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t1, p2);
        genC3d.gen_If(t1, '-1', '==', fin);
        genC3d.gen_SetHeap('h', t1);
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
}
exports.Nativas = Nativas;
