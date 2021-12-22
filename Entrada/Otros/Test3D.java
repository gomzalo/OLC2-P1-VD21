void main(){
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println(":::::::::::::   PRIMITIVOS  :::::::::::::");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println("");
    // CADENAS
    println("repeticion-"^3); // repeticion-repeticion-repeticion-
    println("Amperson-"&"Amperson-"&"Amperson-" ); // Amperson-Amperson-Amperson-
    println("");
    println("************   Print  **************");
    println("");
    //PARTE DE PRUEBA AUX
    println("Probando Manejo de Entornos");
    // int var11 = 10;
    // println("El valor de var1 global es $var11");  //10
    // int var1 = 5*5;
    // println("El valor de var1 local es $var1");  //25
    println("");
    println("************   Expresiones  **************");
    println("");
    println("Probando expresiones Arítmeticas");
    println(-25*(69-33*2)+22-32*2-33*(-48+48));   // -117
    println(-93.555+92.12-81.33+19+26-68+-7/(79+11)/86);    // -105.765
    println(8+67+74-1.0*((-86+22)*2)-5*6);  // 247.0
    println((51 % 49) * (9.9+90.1));    // 200.0
    println(0+9*3*(85%(46+95)));    // 2295
    println("Probando expresiones Booleanas y Lógicas");
    println(56 < 48 && 68 >=12 && 62 != 96);    // false
    println((21.0==20.5||95>=94)&&((19<39&&83<=96)||35<97));    // true
    println((68==33||(2<95&&17==37))&&63<=9||12<=42||25==1);    // true
    println("");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println(":::::::::::::   CONDICIONALES  :::::::::::::");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println("");
    println("************   If con {}  **************");
    println("");
    if(true){
        println("entro a if simple xd"); // entro a if simple xd
    }
    println("");
    println("************   If-Else  con {} **************");
    println("");
    if(false){
        println("no entra xd");
    }else{
        println("entro a else en if-else xd"); // entro a else en if-else xd
    }
    println("");
    println("************   If-ElseIf-Else con {} **************");
    println("");
    if(false){
        println("no entra xd");
    }else if(true){
        println("entro a elsif en if-else-elseif xd"); // entro a elsif en if-elseif-else xd
    }else{
        println("no entra xd");
    }
    println("************   If-ElseIf-Else Anidados con {} **************");
    if(false){
        println("no entra xd");
    }else if(true){
        println("entro a elsif xd"); // entro a elsif xd
        if(true){
            println("if dentro de elseif"); // if dentro de elseif
            if(true){
                println("if dentro de elseif x2"); // if dentro de elseif x2
            }
        }else{
            println("no entra xd");
        }
    }else{
        println("no entra xd");
    }
    println("");
    println("************   If sin {}  **************");
    println("");
    if(true)
        println("entro a if simple xd");
    println("");
    println("************   If-Else sin {} **************");
    println("");
    if(false)
        println("no entra xd"); // entro a if simple xd
    else
        println("entro a else en if-else xd"); // entro a else en if-else xd
    println("");
    println("************   If-ElseIf-Else  sin {} **************");
    println("");
    if(false)
        println("no entra xd");
    else if(true)
        println("entro a elsif en if-else-elseif xd"); // entro a elsif en if-elseif-else xd
    else
        println("no entra xd");
    println("");

    println("************   If-ElseIf-Else  sin {} **************");
    int prueba =5;
    println("hola ", 454, 56>3);

    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println(":::::::::::::   VARIABLES  :::::::::::::");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    boolean nbandera =true;
    boolean nbandera2 ;
    println(nbandera);//true
    nbandera =false;
    println(nbandera);//false
    println(nbandera2);//false
    println("");
    println("************   Asignaciones  **************");
    println("");
    int ppp;
    ppp=5;
    println(ppp); // 5
    int test1, test2 = 56, test3;
    char cprueba;
    println(cprueba);//0
    int test;
    println(test); // 0
    println(test2); // 56
    println(cprueba); // 0
    println("");
    // println("************   Incrementos  **************");
    // println("");
    // test1++;
    // test1++;
    // test1--;
    // println(test1); // 1
    test=-25*(69-33*2)+22-32*2-33*(-48+48);
    println(test); // -117
    // println(test++); // -116
    println("");
    println("************   Switch-C-D **************");
    println("");
    char c = '*';
    switch(c) {
        case '+':
            println("+");
            break;
        case '-':
            println("-");
            break;
        case '*':
            println("*"); // '*'
            break;
        case '/':
            println("/");
            break;
        default:
            println("0");
    }
    println("");
    println("************   Switch-C **************");
    println("");
    switch('+') {
        case '+':
            println("+"); // '+'
            break;
        case '-':
            println("-");
            break;
        case '*':
            println("*");
            break;
        case '/':
            println("/");
            break;
    }
    println("");
    println("************   Switch-D **************");
    println("");
    switch('+') {
        default:
            println("0"); // 0
    }
    println("");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println(":::::::::::::   LOOPS  :::::::::::::");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println("");
    println("************   WHILE  **************");
    int i =2;
    while(i>1)
    {
    i=i-1;
    println(i);
    }
    //while
    int ix = 0;
    while (ix < 5) {
        print(ix,"|"); // 0|1|2|3|4
        ix = ix +1;
    }
}