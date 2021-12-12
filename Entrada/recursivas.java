int ackerman(int m, int n)
{   
    println("ACKERMANNNNNNNNNNNNNNN-",m," ",n);
    if (m == 0){
        return n + 1;
    }else if (m > 0 && n == 0){
        return ackerman(m - 1, 1);
    }else{
        return ackerman(m - 1, ackerman(m, n - 1));
    }
}

void hanoi(int discos, int origen, int auxiliar, int destino)
{
    println(discos," ",origen," ",auxiliar, " ",destino);
    if (discos == 1){
        println("Mover de ", origen, " a ", destino);
    }else{
      	println("else: ",discos," ",origen," ",auxiliar, " ",destino);
        hanoi(discos - 1, origen, destino, auxiliar);
        println("Mover de ", origen, " a ", destino);
        hanoi(discos - 1, auxiliar, origen, destino);
    }
}

int factorial(int num)
{
    if (num == 1){
        return 1;
    }else{
        return num * factorial(num - 1);
    }
}

void Main()
{
    println("=====================================================");
    println("===========FUNCIONES RECURSIVAS======================");
    println("=====================================================");
    println("");

    println("==============FACTORIAL==============================");
    println(factorial(5));
    println("===============ACKERMAN==============================");
    //println(ackerman(3, 5));
    println("===============HANOI=================================");
    hanoi(3, 1, 2, 3);
}
