int var1 = 1;
int punteo = 0;

void Main(){
  
    println("-----------------CALIFICACION ARCHIVO 1-----------------");
    println("Valor: 15 pts");
    println("--------------------------------------------------------");
    int var1 = 0;
    // Verificar ambitos, se toma con prioridad la variable local ante la global.
    if (var1 != 0) {
        println("No se toma con prioridad la variable local ante la global");
        println("Perdiste 8 puntos :c");
    }
    else {
        punteo = punteo + 8;
        println("Muy bien, prioridad de variable local correcta");
        println("Haz sumado 8 puntos");
        println("Punteo = " & punteo);
    }
  
  // Sección de declaracion de variables
	// el if es para simular un nuevo ambito 
    if(1==1){
        println("========= Metodo Declaracion =========");
        int n1 = 1;
        int n2 = 1;
        int n3 = 1;
        int n4 = 1;
        String str1 = "Voy a ganar Compiladores";
        String str2 = "Voy a ganar Compiladores";
        String str3 = "Voy a ganar Compiladores";
        String str4 = "Voy a ganar Compiladores";
        double db1 = 0.0;
        double db2 = 0.0;
        double db3 = 0.0;
        double db4 = 0.0;
        char chr1 = 's';
        char chr2 = 's';
        char chr3 = 's';
        char chr4 = 's';
        // sin modificar la asignacion
        if (db1 == db4) {
            println(str1 & chr2 & " " & n3 & " :D");
            punteo = punteo + 8;
            println("Declaración correcta");
            println("Haz sumado 6 puntos");
        } else {
            println("Problemas en el metodo declaracion :(");
            println("Perdiste 6 pts :(");
        }
        println("--------------------------------------");
        println("Punteo = " & punteo);
        println("======================================");
    }
  
  //seccion de manejo de Ambitos 2
    
	int amb1 = 3;
	if(amb1 == 3){
		
		String amb1 = "Desde ambito2";
		println("==============Ambitos 2===============");
		if (amb1 == "Desde ambito2") {
			println(amb1);
			punteo = punteo + 8;
		}
		else {
			println("Tienes un error al manejar la variable amb1 :(");
			println("Perdiste 8 puntos");
		}
		println("Punteo = " & punteo);
		println("======================================");

	}
  
      //Sección de expresiones aritméticas
	//para simular un nuevo ambito
    if(1==1){
        //suma de strings con caracteres
        println("==============Aritmeticas=============");
        String art1 = "Hola " & 'C' & "" & 'O' & "" & 'M' & "" & 'P' & "" & 'I';
        println(art1);
        if (art1 == "Hola COMPI") {
            punteo = punteo + 6;
        } else {
            println("Perdiste 6 puntos en suma de cadena y caracter :c");
        }
      
        int n2 = 50 - 1 - 49;
        if (n2 == 0) {
            punteo = punteo + 5;
        } else {
            println("Perdiste 5 puntos en la resta :c");
        }
      
      double n4 = (5750 * 2) - 11800 + 1.0;
      double n3 = (((3 * 3) + 4) - 80 + 40.00 * 2 + 358.50 - (29 / 14.50)) - (0.50) + n4;
      
      println("El valor de n3 = " & n3);
        if (n3 == 70.0) {
            punteo = punteo + 6;
        }
        else {
            println("Perdiste 6 puntos :c ");
        }
      
      if(2==2){
            //para simular un nuevo entorno

            //Operaciones Basicas

            println("Operaciones Aritmeticas 1: valor esperado:   a)62   b)0   c)-19   d)16   resultados>");
            int a;
            a = (20 - 10 + 8 / 2 * 3 + 10 - 10 - 10 + 50);
            int b;
            b = (50 / 50 * 50 + 50 - 100 + 100 - 100);
            int c;
            c = (100 / 20 * 9 - 78 + 6 - 7 + 8 - 7 + 7 * 1 * 2 * 3 / 3);
            int d;
            d = (2 * (20 / 5 * 2));
            println("a) " & a);
            println("b) " & b);
            println("c) " & c);
            println("d) " & d);
            
        if (a == 62 && b == 0 && c == -19 && d == 16) {
                println("Operaciones aritmeticas 1 bien :D");
                punteo = punteo + 8;
            } else {
                println("Error para las operaciones basicas :(");
            }
        }
      
              if(3==3){
            //operacionesAvanzadas
	
            double aritmetica1 = 2.0;
            int aritmetica2 = -10;
            println("Operaciones Aritmeticas 2: valor esperado> -20  -7 \nresultado>");
            double aritmetica3 = aritmetica2 * aritmetica1;
            println(aritmetica3 & "");
            aritmetica1 = aritmetica3 / aritmetica1 + 50 * 2 / 50 + 50 * 2 - 100 + 100 / 100 - 0;
            println(aritmetica1 & "");
            if (aritmetica3 == -20 && aritmetica1 == -7) {
                println("Operaciones aritmeticas 2 bien :D");
                punteo = punteo + 8;
            } else {
                println("Error Operaciones Aritmeticas");
            }
            
            println("Punteo = " & punteo);
            println("======================================");
        }
    }
  
  
        println("Punteo = " & punteo);
        println("======================================");
  
  //Seccion de expresiones lógicas
    if(4==4){
      
        println("==============Logicas1=============");
        if (!!!!!!!!!!!!!!!!!!true) {
            punteo = punteo + 1;
            println("Bien primera condicion:)");
        } else {
            println("Perdiste 1 punto :c");
        }
      
      if (((true && true) || ((false && false) && (false == true))) || (!true)) {
            punteo = punteo + 5;
            println("Bien segunda condicion:)");
        } else {
            println("Perdiste 5 puntos :c");
        }
        println("======================================");
      
      if(5==5){
        
        int n0 = 16;
        println("==============Logicas2=============");
        
        if (!(!(n0 == 16 && false == true) && !(true))) {
          println("Not y Ands Correctos");
          punteo = punteo + 5;

        } else {
          println("No funcionan nots y ands :(");
        }
        
        int n1;
        n1 = n0 / 16;
        boolean condicion1 = n1 != 2; //esto es verdadero
        boolean condicion3 = !true; //falso
        
        if (!(!(!(!condicion1) || condicion3))) {
                println("Nots y Ors correctos");
                punteo = punteo + 5;
            } else {
                println("No Funciona nots y ands :(");
            }
            println("======================================");
        
        if(6==6){
		  //Hacer lo mismo que logicas2 pero con nands y nors
          println("==============Logicas3=============");
          
          if (!(!(n0 == 16 && false == true) && !(true))) {
            println("NANDS Correctos");
            punteo = punteo + 5;

          } else {
            println("No funcionan NANDS :(");
          }
          
          int n1;
          n1 = n0 / 16;
          boolean condicion1 = false; //esto es falso
          boolean condicion2 = false; //falso
          boolean condicion3 = true; //verdadero
          
          if (!(!(!(condicion1 || condicion2) || condicion3))) {
            println("NORS correectos");
            punteo = punteo + 3;
          } else {
            println("No Funcionan NORS :(");
          }

          println("======================================");
        }
      }
    }
  
      println("--------------------------------------");
    println("Punteo = " & punteo);
    println("--------------------------------------");
  
  //Seccion de expresiones relacionales
  int n0 = 34;
  int n1 = 16;
  
  if (n0 == 34){
    int salida = 34;
    println("==============relacionales1=============");
		double n0 = salida + 0.0;
		if (n0 < 34.44) {
			salida = salida + 15;
			if (salida > 44) {
				//salida++;
                salida = salida + 1;
			}
		}
		else {
			salida = 1;
		}
    
    if (salida != 1) {
      if (salida == 50) {
        println("Salida Correcta Relacionales 1!");
        punteo = punteo + 10;
      }
      else {
        println("Salida incorrecta!!");
      }
    }
    else {
      println("Salida incorrecta!!");
    }
    println("======================================");
  }
  
  if (n1 == 16){
    int n0 = 16;
    println("vas bien, animo :D");
    println("============Relacionales2=============");
    
    if(10 - 15 >= 0 && 44.44 == 44.44)
    {
      println("Salida incorrecta primer Si relacionales2!!");
    }
    
    else {
      if(15 + 8 == 22 - 10 + 5 * 3 - 4 && 13 * 0 > -1){
        if(10.0 != 11.0 - 1.01) {
          println("Salida CORRECTA en relacionales2!!");
          punteo = punteo + 9;
        }
        else {
          println("Salida incorrecta segundo Si relacionales 2!!");
        }
      } else {
      if(1 == 1) {
        println("Salida incorrecta relacionales 2 3er si !!");
      }
      else {
        println("Salida incorrecta relacionales 2 Sino3er si !!");
      }
    }
    } 
    println("======================================");
  }
  
  	//punteo final
	println("Punteo Final: " & punteo);
	int resultado = (punteo*15)/100;
	println("-----------------------------------");
	println("|   RESULTADO ARCHIVO 1 = " & resultado & " pts  |");
	println("-----------------------------------");
  
  // return;
}
