# **MANUAL DE USUARIO**

Quetzal-OLC2 es una herramienta muy util para el usuario que desea ejecutar, o interpretar, código quetzal. O bien traducir codigo a tres direcciones, para luego ser ejecutado en C.

A continuación se describen las partes de la página, su funcionalidad, como también las entradas y salidas esperadas.

## **Tabla de contenido**

- [Interfaz](#interfaz)
   - [Barra de navegación](#barnav)
      - [Menu archivo](#menu_archivo)
      - [Menu ejecución](#menu_ejecutar)
      - [Menu reportes](#menu_reportes)

## Interfaz <a name="interfaz"></a>

Al abrir la aplicación web se muestran dos cuadros de texto y la consola que mostrara el resultado del codigo ejecutado.

![interfaz1](/Documentacion/img/usuario/interfaz1.png)

Ademas, mas abajo se muestran las tablas que contendran tanto los distintos reportes que genera Quetzal-OLC2, como también los autores del programa.

![interfaz2](/Documentacion/img/usuario/interfaz2.png)

## Barra de navegación <a name="barnav"></a>

La barra de navegación contiene los menus necesarios para poder realizar las acciones que el usuario desee.

![navbar](/Documentacion/img/usuario/navbar.png)

## Menu archivo <a name="menu_archivo"></a>

En este menu se despliegan las opciones para que el usuario abra o guarde archivos.

![menu_archivo](/Documentacion/img/usuario/menu_archivo.png)

### **Abrir**

Permite al usuario cargar un archivo, extension .java, para luego interpretar el archivo o traducirlo.

![abrir_archivo](/Documentacion/img/usuario/abrir_archivo.png)

### **Guardar**

Permite guardar el contenido del archivo actual.

## Menu ejecución <a name="menu_ejecutar"></a>

En este menu se despliegan las dos funciones principales de la aplicación, que son interpretar (o ejecutar) y traducir a código de tres direcciones.

![menu_ejecucion](/Documentacion/img/usuario/menu_ejecucion.png)

### **Ejecutar**

Este botón permite ejecutar, o interpretar, el codigo que se tiene en el cuadro de texto de entrada. El resultado de este se muestra en la consola de salida.

![ejecutar](/Documentacion/img/usuario/ejecutar.png)

### **Traducir**

Este botón traducira la entrada en el cuadro de texto de entrada. Esta se mostrara en el cuadro de texto, llamado Código 3D, que se encuentra abajo.

![traducir](/Documentacion/img/usuario/traducir.png)

## Menu traducir <a name="menu_reportes"></a>
Este menu contiene los sub menus que producen los reportes que permite generar Quetzal-OLC2.

![traducir](/Documentacion/img/usuario/menu_reportes.png)

### **Errores**

Este reporte muestra los errores que se hayan encontrado, durante la interpretación o traducción del código. Se observa tanto el tipo de error, como también la fila y columna en donde se encontrarón.

![errores](/Documentacion/img/usuario/errores.png)

### **Tabla de símbolos**

Este reporte muestra las declaraciones, globales y locales, que se hayan hecho en el programa fuente, estas incluyen:
- Variables
- Funciones
- Structs
- Arreglos
Adicional, se muestran las asignaciones de variables.
Al igual que el reporte de errores, se muestra la fila y columna de estas, como también el ambito de estos objetos.

![tsimbolos](/Documentacion/img/usuario/tsimbolos.png)

### **AST**

Genera un gráfico con el árbol de análisis sintáctico, generado a partir de la entrada en el cuadro de texto.

![ast](/Documentacion/img/usuario/ast.png)

### **Gramatical**

Este último reporte, genera un una definición dirigida por la sintaxis con la grámatica seleccionada, esto indica las expresiones utilizadas, su precedencia, símbolos terminales y no terminales, como también las reglas semánticas.

![gramatical](/Documentacion/img/usuario/gramatical.png)