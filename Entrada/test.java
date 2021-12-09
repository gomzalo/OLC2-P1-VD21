    println("************   PRIMITIVOS  **************");
    // CADENAS
    println("repeticion-"^3);
    println("Amperson-"&"Amperson-"&"Amperson-" );
    println("************   PRINT  **************");
    //PARTE DE RUEBA AUX
    println("Probando Manejo de Entornos");
    println("El valor de var1 global es $a");  //10
    // int var1 = 5*5;
    println("El valor de var1 local es $a");  //25
    println("************   EXPRESIONES  **************");
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
    println("************   IF con {}  **************");
    if(true){
        println("Erick puñeta xd");
    }
    println("************   IF-ELSE  con {} **************");
    if(false){
        println("Erick puñeta xd");
    }else{
        println("Erick no puñeta xd");
    }
    println("************   IF-ELSEIF-ELSE Anidados  con {} **************");
    if(false){
        println("Erick puñeta xd");
    }else if(true){
        println("Erick elsif puñeta xd");
    }else{
        println("Erick no puñeta xd");
    }
    if(false){
        println("Erick puñeta xd");
    }else if(true){
        println("Erick elsif puñeta xd");
        if(true){
            println("if dentro de elseif");
            if(true){
                println("if dentro de elseif x2");
            }
        }else{
            println("else dentro de elseif");
        }
    }else{
        println("Erick no puñeta xd");
    }
    println("************   IF sin {}  **************");
    if(true)
        println("Erick puñeta xd");
    println("************   IF-ELSE sin {} **************");
    if(false)
        println("Erick puñeta xd");
    else
        println("Erick no puñeta xd");
    println("************   IF-ELSEIF  sin {} **************");
    if(false)
        println("Erick puñeta xd");
    else if(true)
        println("Erick elsif puñeta xd");
    else
        println("Erick no puñeta xd");
    println("************   ASGINACIONES  **************");
    
    int test1, test2, test3;
    int test;
    println(test);