void Main()
{
    println("=======================================================================");
    println("==========================FUNCIONES Y RETURN===========================");
    println("=======================================================================");
    

    // println(potenciaNativa(5, 7));
    // println(potenciaNativa(2, 2));
    // println(potenciaNativa(4, 2));

    // println(sumarTodo(5, 4));
    // println(sumarTodo(-1, -5));
    // println(sumarTodo(7, 7));
    println(sumarTodo());
}

double potenciaNativa(base, exponente)
{
    double resultado = base;
    while (exponente > 1){
        resultado = resultado * base;
        exponente = exponente - 1;
    }
    return resultado;
}

// int sumarTodo(num1, num2)
// {
//     double result = 0;
//     if( num1 < 0 || num2 < 0)
//     {
//         return -1;
//     }

//     while (num1 > 0 || num2 > 0)
//     {
//         result = result + (num1 + num2);
//         num1 = num1 - 1;
//         num2 = num2 - 1;
//     }
//     return result;
// }

int sumarTodo()
{
    int num1 = 3, num2 = 5;
    double result = 0;
    if( num1 < 0 || num2 < 0)
    {
        println(-1);
        // return -1;
    }

    while (num1 > 0 || num2 > 0)
    {
        result = result + (num1 + num2);
        num1 = num1 - 1;
        num2 = num2 - 1;
    }
    println(result);
    // return result;
}

    // int num1 = 3, num2 = 5;
    //     double result = 0;
    //     if( num1 < 0 || num2 < 0)
    //     {
    //         System.out.println(-1);
    //         // return -1;
    //     }
    
    //     while (num1 > 0 || num2 > 0)
    //     {
    //         result = result + (num1 + num2);
    //         System.out.println(result);
    //         num1 = num1 - 1;
    //         num2 = num2 - 1;
    //         System.out.println(num1);
    //         System.out.println(num2);
    //     }