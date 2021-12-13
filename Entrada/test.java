void Main()
{
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
    println("El valor de var1 global es $a");  //10
    // int var1 = 5*5;
    println("El valor de var1 local es $a");  //25
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
        println("entro a elsif en if-else-elseif xd"); // entro a elsif en if-else-elseif xd
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
        println("entro a elsif en if-else-elseif xd"); // entro a elsif en if-else-elseif xd
    else
        println("no entra xd");
    println("");
    println("************   Switch-C-D **************");
    println("");
    char c = '*';
    switch(c) {
        case '+':
            println('+');
            break;
        case '-':
            println('-');
            break;
        case '*':
            println('*'); // '*'
            break;
        case '/':
            println('/');
            break;
        default:
            println('0');
    }
    println("");
    println("************   Switch-C **************");
    println("");
    switch('+') {
        case '+':
            println('+'); // '+'
            break;
        case '-':
            println('-');
            break;
        case '*':
            println('*');
            break;
        case '/':
            println('/');
            break;
    }
    println("");
    println("************   Switch-D **************");
    println("");
    switch('+') {
        default:
            println('0'); // 0
    }
    println("");
    println("************   Ternario  **************");
    println("");
    int edad =56;
    String respuesta, animal = "Perro";
    respuesta = edad >= 50 ? "Puede vacunarse" : "No puede vacunarse";
    println(respuesta); // No puede vacunarse
    println(animal == "Perro" ? 15 : 10);
    println(animal == "Perro" ? (animal == "Perro" ? "adentro" : 10) : 10); //adentro
    println("");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println(":::::::::::::   VARIABLES  :::::::::::::");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println("");
    println("************   Asignaciones  **************");
    println("");
    int test1, test2 = 56, test3;
    char cprueba;
    int test;
    println(test); // 0
    println(test2); // 56
    println(cprueba); // 0
    println("");
    println("************   Incrementos  **************");
    println("");
    test1++;
    test1++;
    test1--;
    println(test1); // 1
    test=-25*(69-33*2)+22-32*2-33*(-48+48);
    println(test); // -117
    println("");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println(":::::::::::::   LOOPS  :::::::::::::");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println("");
    println("************   While  **************");
    println("");
    //while
    int i = 0;
    while (i < 5) {
        print(i,"|"); // 0|1|2|3|4
        i++;
    }
    println("");
    println("");
    println("************   While anidado **************");
    println("");
    i = 0;
    while (i < 5) {
        println(i,":"); // i:
        i=i+1;
        int h =0;
        while (h < 5) {
            print(h,"|"); // 0|1|2|3|4
            h=h+1;
        }
        println("");
    }
    /*  0:
        0|1|2|3|4|
        1:
        0|1|2|3|4|
        2:
        0|1|2|3|4|
        3:
        0|1|2|3|4|
        4:
        0|1|2|3|4|
    */
    // 
    println("");
    println("");
    println("************   Do-While  **************");
    println("");
    //do while
    int i_do = 0;
    do {
        print(i_do,":");
        i_do=i_do+1;
    }
    while (i_do < 5); // 0:1:2:3:4
    println("");
    println("");
    println("************   For  **************");
    println("");
    for (int i = 0; i < 5; i++) {
        print(i," "); // 0 1 2 3 4
    }
    println("");
    println("");
    println("************   For-In cadena x **************");
    println("");
    for letra in "Hola Mundo!"  // Recorre las letras de la cadena
    {
        print(letra, "-");      // Imprime H-o-l-a-M-u-n-d-o-!
    
    }
    println("");
    println("");
    println("************   For-In arreglo x **************");
    println("");
    for ts in ["2", "3", "5"]  // Recorre los valores del arreglo
    {
        print(ts, "-");      // Imprime 2-3-5
    
    }
    println("");
    println("************   For-In cadena declarada **************");
    println("");
    String cadena = "OLC2";
    for l in cadena
    {
        print(l, "-");      // Imprime O-L-C-2
    }
    println("");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println(":::::::::::::   ARREGLOS  :::::::::::::");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println("");
    println("************   Declaracion de arreglos  **************");
    println("");
    String[] arr = ["H","O","L","A"];
    println("Nuevo arreglo declarado: " & arr); // Nuevo arreglo declarado: H-O-L-A
    // String[] arr = ["H",["O","O"],"L","A"];
    println("");
    println("************   For-In arreglo declarado con rango **************");
    println("");
    for t in arr[0:2]  // Recorre las letras de la cadena
    {
        print(t, "-");      // Imprime H-O-L
    
    }
    println("");
    println("");
    println("************   For-In arreglo declarado sin rango **************");
    println("");
    for j in arr  // Recorre las letras de la cadena
    {
        print(j, "-");      // Imprime H-O-L-A
    
    }
    println("");
    println("");
    println("************   Acceso de arreglos  **************");
    println("");
    String arr_por_cero = arr[0];
    println(arr_por_cero); // H
    println(arr); // H-O-L-A
    println(arr[2]); // L
    println("");
    println("************   Modificacion de arreglos  **************");
    println("");
    arr[2] = "T";
    println(arr[2]); // T
    println(arr); // H,O,T,A
    println("");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println(":::::::::::::   NATIVAS  :::::::::::::");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println("");
    println(":::::::::::::   Arreglos  :::::::::::::");
    println("");
    println("************   Pop arreglos  **************");
    println("");
    println(arr.pop()); // A
    String t = arr.pop(); // T
    println(t); // T
    println(arr); // H,O
    println("");
    println("************   Length arreglos  **************");
    println("");
    println(arr.lenght()); // 2
    println("");
    println("************   Push  **************");
    println("");
    arr.push("S");
    println(arr); // H,O,S
    println("");
    println("************   Copia de arreglos  **************");
    println("");
    String []arr2 = #arr;
    println(arr2); // H,O,S
    println("");
    println(":::::::::::::   String  :::::::::::::");
    println("");
    println("************   Length String  **************");
    println("");
    String var_str = "Cadena";
    int var_int = 7;
    println(var_str.lenght()); // 6
    println("Error a proposito: ");
    println(var_int.lenght()); // Error variable no es Arreglo o String
    println("");
    println("************   Substring  **************");
    println("");
    println(var_str.subString(2,4)); // den
    println("Errores a proposito: ");
    println(var_str.subString(-2,4)); // Error inicio no puede ser negativo
    println(var_str.subString(1,8)); // Error inicio no puede ser negativo
    println("");
    println("************   caracterOfPosition  **************");
    println("");
    println(var_str.caracterOfPosition(2)); // d
    println("Error a proposito: ");
    println(var_str.caracterOfPosition(2.5)); // Error posicion no es un entero
    println("");
    println("************   toUpper  **************");
    println("");
    String minus = "mintomay";
    println(minus);
    println(minus.toUppercase()); // MINTOMAY
    println("************   toLower  **************");
    println("");
    String mayus = "MAYTOMIN";
    println(mayus);
    println(mayus.toLowercase()); // maytomin
    println("");
    println(":::::::::::::   Matematicas  :::::::::::::");
    println("");
    println("************   Sin  **************");
    println("");
    println(sin(3)); // 0.1411200080598672
    println("");
    println("************   Cos  **************");
    println("");
    println(cos(3)); // -0.9899924966004454
    println("");
    println("************   Tan  **************");
    println("");
    println(tan(3)); // -0.1425465430742778
    println("");
    println("************   Sqrt  **************");
    println("");
    println(sqrt(3)); // 1.7320508075688772
    println("");
    println("************   Log10  **************");
    println("");
    println(log10(3)); // 0.47712125471966244
    println("");
    println(":::::::::::::   Numericas  :::::::::::::");
    println("");
    println("************   Parse a int  **************");
    println("");
    String a = "3";
    println(int.parse("8200")); // 8200
    println(typeOf(a)); // string
    int a_int = int.parse(a);
    println(int.parse(a)); // 3
    println(typeOf(a_int)); // int
    println("");
    println("************   Parse a double  **************");
    println("");
    println(double.parse("3.13159")); // 3
    println("");
    println("************   Parse a boolean  **************");
    println("");
    println("Error a proposito: ");
    println(boolean.parse(a)); // Error, valor no puede convertirse a booleano
    println(boolean.parse("tRuE")); // true
    println(boolean.parse("0")); // false
    println("");
    println("************   ToInt  **************");
    println(toDouble(55)); // 55
    println("");
    println("************   ToDouble  **************");
    println(toInt(2.223)); // 2
    println("");
    println("************   String  **************");
    println("");
    println(string(218128)); // 218128
    println("");
    println("************   TypeOf  **************");
    println("");
    println(typeOf("a")); // string
    println(typeOf(2)); // int
    println(typeOf(2.5)); // double
    println(typeOf('e')); // char
    println(typeOf(a)); // int
    println(typeOf([2,2,2])); // array
    println("");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println(":::::::::::::   FUNCIONES  :::::::::::::");
    println("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    println("");
    println("************   Llamada  **************");
    println("");
    println(operacionMatematica('+',90,5)); // 95
    println(operacionMatematica('*',90,5)); // 450
    metodo("hola"); // Hola
}
/*
    Comentario multilinea
    xd
    xddd
*/
double operacionMatematica(char operador, int valor1, int valor2){
    switch(operador) {
        case '+':
            return valor1 + valor2;
            break;
        case '-':
            return valor1 - valor2;
            break;
        case '*':
            return valor1 * valor2;
            break;
        case '/':
            return valor1 / valor2;
            break;
        default:
            return 0;
    }
} 

void metodo (string hola)
{
    println(hola);
}

