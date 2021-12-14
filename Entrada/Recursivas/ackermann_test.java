int ackerman(int m, int n)
{   
    // println("ACKERMAN ENTRA -> ",m,", ",n);
    if (m == 0){
        // println("ACKERMAN- if -> ",m,", ",n);
        return n + 1;
    }
    else if (m > 0 && n == 0){
        // println("ACKERMAN- else if -> ",m,", ",n);
        return ackerman(m - 1, 1);
    }
    else{
        // println("ACKERMAN- else -> ",m,", ",n);
        return ackerman(m - 1, ackerman(m, n - 1));
    }
}

void Main()
{
    println("===============ACKERMAN==============================");
    // println("ackerman(0, 0) = 1");
    // println(ackerman(0, 0)); // 1
    // println("ackerman(0, 1) = 2");
    // println(ackerman(0, 1)); // 2
    // println("ackerman(0, 2) = 3");
    // println(ackerman(0, 2)); // 3
    // println("ackerman(0, 3) = 4");
    // println(ackerman(0, 3)); // 4
    // println("ackerman(1, 0) = 2");
    // println(ackerman(1, 0)); // 2
    // println("ackerman(1, 1) = 3");
    // println(ackerman(1, 1)); // 3
    // println("ackerman(1, 2) = 4");
    // println(ackerman(1, 2)); // 4
    // println("ackerman(1, 3) = 5");
    // println(ackerman(1, 3)); // 5
    // println("ackerman(2, 0) = 3");
    // println(ackerman(2, 0)); // 3
    // println("ackerman(2, 1) = 5");
    // println(ackerman(2, 1)); // 5
    // println("ackerman(2, 2) = 7");
    // println(ackerman(2, 2)); // 7
    // println("ackerman(2, 3) = 9");
    // println(ackerman(2, 3)); // 9
    // println("ackerman(3, 0) = 5");
    // println(ackerman(3, 0)); // 5
    // println("ackerman(3, 1) = 13");
    // println(ackerman(3, 1)); // 13
    // println("ackerman(3, 2) = 29");
    // println(ackerman(3, 2)); // 29
    // println("ackerman(3, 3) = 61");
    // println(ackerman(3, 3)); // 61
    // println(ackerman(3, 4)); // 125
    // println("ackerman(3, 5) = 253");
    // println(ackerman(3, 5)); // 253
    println("ackerman(3,6) = 509");
    println(ackerman(3,6)); // 509
    println("ackerman(3,7) = 1021");
    println(ackerman(3,7)); // 1021
    println("ackerman(4, 0) = 13");
    println(ackerman(4, 0)); // 13
    // println("ackerman(4, 1) = 65533"); // muere xdnt
    // println(ackerman(4, 1)); // 65533
    // ackerman(4, 3);
    return;
}
