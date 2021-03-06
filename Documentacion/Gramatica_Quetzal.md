###################################################

                    Simbolos       

###################################################

..............      Especiales      ...............

    \n
    \\
    \"
    \t
    \'

..............      Aritmeticos      ...............

    +
    -
    *
    /
    ^
    %
    =

..............      Relacionales      ...............

    ==
    =!
    <
    >
    <=
    >=

..............     Logicos      ...............

    ||
    &&
    !

..............     Agrupacion      ...............

    (
    )

..............     Precedencia      ...............

    NIVEL       OPERADOR                    ASOCIATIVIDAD
    _____________________________________________________
    0           -                           Derecha
    1           ^                          No asociativa
    2           /, *, %                     Izquierda
    3           +, -                        Izquierda
    4           ==, =!, <, <=, >, >=        Izquierda
    5           !                           Derecha
    6           &&                          Izquierda
    7           ||                          Izquierda

..............     Finalizacion      ...............

    ;           [Obligatorio]
    {}          Encapsula sentencias

..............     Arreglos      ...............

    []
..............     Control      ...............

    :

..............     Asignacion      ...............

    ::

###################################################

     Reservadas       

###################################################

..............      Primitivos      ...............

    int
    double
    boolean
    char
    String
    null

..............      Compuestos      ...............

    struct

..............      Sentencias      ...............
￼

....    Control

    if
    else
    elseif
    switch
    case
    default

....    Ciclicas

    while
    do while
    for

....    Transferencia

    break
    continue
    return

..............      Funciones      ...............

    function
    print
    println

....    Nativas

    sin
    cos
    tan
    log10
    sqrt
    parse
    toInt
    toDouble
    String
    typeof
    push
    pop
    caracterOfPosition
    subString
    length
    toLowercase
    toUppercase

reservadas = {

..............      Primitivos      ...............
    
    'int'           :   'RINT',
    'double'        :   'RDOUBLE',
    'boolean'       :   'RBOOLEAN',
    'char'          :   'RCHAR',
    'String'        :   'RSTRING',
    'null'          :   'RNULL',

..............      Compuestos      ...............

    'struct'        :   'RSTRUCT',

..............      Nativas      ...............

    'log10'         :   'RLOG10',
    'sin'           :   'RSIN',
    'cos'           :   'RCOS',
    'tan'           :   'RTAN',
    'sqrt'          :   'RSQRT',

..............      Declaraciones      ...............

    'global'        :   'RGLOBAL',
    'local'         :   'RLOCAL',

..............      Sentencias      ...............

....    Control

    'if'            :   'RIF',
    'elseif'        :   'RELSEIF',
    'else'          :   'RELSE'

....    Ciclicas

    'while'         :   'RWHILE',
    'do'            :   'RDO',
    'for'           :   'RFOR',
    'in'            :   'RIN',

....    Transferencia

    'break'         :   'RBREAK',
    'continue'      :   'RCONTINUE',
    'return'        :   'RRETURN',

..............      Funciones      ...............

    'function'      :   'RFUNCTION',
    'print'         :   'RPRINT',
    'println'       :   'RPRINTLN'

....    Nativas

    'parse'         :   'RPARSEF',
    'toInt'         :   'RTOINTF',
    'toDouble'      :   'RTODOUBLEF',
    'String'        :   'RSTRINGF',
    'typeof'        :   'RTYPEOF',
    'push'          :   'RPUSH',
    'pop'           :   'RPOP',
    'length'        :   'RLENGTH',
    'toLowercase'   :   'RTOLOWERCASE',
    'toUppercase'   :   'RTOUPPERCASE'
}

tokens = [

    'PUNTO',                .
    'PUNTOCOMA',            ;
    'COMA',                 ,
    'DOSPUNTOS',            :
    'PARA',                 (
    'PARC',                 )
    'CORA',                 [
    'CORC',                 ]
    'LLAVEA',               {
    'LLAVEC',               }
    'MAS',                  +
    'MENOS',                -
    'POR',                  *
    'DIV',                  /
    'POTENCIA'              ^
    'MODULO'                %
    'IGUAL'                 =
    'IGUALDAD'              ==
    'DIFERENTE'             !=
    'MENORQUE'              <
    'MAYORQUE'              >
    'MENORIGUAL'            <=
    'MAYORIGUAL'            >=
    'OR'                    ||
    'AND'                   &&
    'NOT'                   !
    'DECIMAL',
    'ENTERO',
    'CADENA',
    'ID'

]

###################################################

     Gramatica       
     
###################################################

    inicio              :   instrucciones

    declaraciones       :   declaraciones declaracion
    
    terminacion         :   PUNTOCOMA
                        |   

    declaracion         :   tipo lista_id terminacion
                        |   tipo ID IGUAL expresion terminacion
    
    lista_id            :   lista_id ID

    asignaciones        :   asignaciones asignacion

    asignacion          :   ID IGUAL expresion terminacion

    asignacion_structs  :   ID ID IGUAL ID PARA parametros PARC terminacion
                        |   ID PUNTO ID IGUAL expresion terminacion                        

    instrucciones       :   instrucciones instruccion

    instruccion         :   declaraciones
                        |   asignaciones
                        |   asignacion_struct
                        |   print_instr
                        |   println_instr
                        |   if_instr
                        |   switch_case_instr
                        |   while_instr
                        |   for_instr
                        |   funciones
                        |   llamada
                        |   log10_instr
                        |   log_instr
                        |   sin_instr
                        |   cos_instr
                        |   tan_instr
                        |   sqrt_instr
                        |   tolower_instr
                        |   toupper_instr
                        |   length_instr
                        |   truncate_instr
                        |   round_instr
                        |   typeof_instr
                        |   struct_instr
                        |   error_instr
                        |   dowhile_statement

    print_instr         :   RPRINT PARA expresion PARC terminacion
    
    println_instr       :   RPRINTLN PARA expresion PARC terminacion

    log10_instr         :   RLOG10 PARA expresion PARC terminacion
    
    log_instr           :   RLOG PARA expresion COMA expresion PARC terminacion
    
    sen_instr           :   RSEN PARA expresion PARC terminacion

    cos_instr           :   RCOS PARA expresion PARC terminacion

    tan_instr           :   RTAN PARA expresion PARC terminacion

    sqrt_instr          :   RSQRT PARA expresion PARC terminacion

    tolower_instr       :   RTOLOWER PARA expresion PARC terminacion

    toupper_instr       :   RTOUPPER PARA expresion PARC terminacion

    length_instr        :   RLENGTH PARA expresion PARC terminacion

    truncate_instr      :   RTRUNCATE PARA valor PARC terminacion

    round_instr         :   RROUND PARA valor PARC terminacion

    typeof_instr        :   RTYPEOF PARA valor PARC terminacion

    if_instr            :   RIF PARA expresion PARC
                            LLAVEA instrucciones LLAVEC
                        |   RIF PARA expresion PARC
                            LLAVEA instrucciones LLAVEC
                            RELSE LLAVEA instrucciones LLAVEC
                        |   RIF PARA expresion PARC
                            LLAVEA instrucciones LLAVEC
                            RELSE if_instr

    switch_case_instr   :   RSWITCH PARA expresiones PARC
                            LLAVEA cases_list default LLAVEC
                        |   RSWITCH PARA expresiones PARC
                            LLAVEA cases_list LLAVEC
                        |   RSWITCH PARA expresiones PARC
                            LLAVEA default LLAVEC

    cases_list          :   RCASE expresion DOSPUNTOS
                            instrucciones

    default             :   RDEFAULT DOSPUNTOS
                            instrucciones

    while_instr         :   RWHILE PARA expresion PARC
                            LLAVEA instrucciones LLAVEC
    
    dowhile_statement   :   DO LLAVEA instrucciones LLAVEC WHILE PARA expresion PARC  

    for_instr           :   RFOR PARA declaracion PUNTOCOMA condicion PUNTOCOMA actualizacion PARC
                            LLAVE instrucciones LLAVEC
    
    for_in              :   RFOR PARA ID RIN expresion PARC
                            LLAVE instrucciones LLAVEC
                        |   RFOR PARA ID RIN rango PARC
                            LLAVE instrucciones LLAVEC

    funciones           :   RFUNCTION ID PARA parametros PARC
                            LLAVEA instrucciones LLAVEC

    struct_instr        :   RSTRUCT ID
                            declaraciones
                            asignaciones
                            terminacion

    parametros          :   parametros COMA tipo [] ID
                        |   tipo [] ID

    llamada             :   ID PARA parametros_llamada PARC terminacion
                        |   ID PARA PARC terminacion

    parametros_llamada  :   parametros_llamada COMA expresion
                        |   expresion

    expresion           :   expresion MAS expresion
                        |   expresion MENOS expresion
                        |   expresion MULTIPLICACION expresion
                        |   expresion DIVISION expresion
                        |   expresion MODULO expresion
                        |   UMENOS expresion
                        |   expresion POTENCIA expresion

    rango               :   expresion DOSPUNTOS expresion
                        |   RBEGIN DOSPUNTOS REND
                        |   expresion DOSPUNTOS REND
                        |   RBEGIN DOSPUNTOS expresion

    tipo                :   RINT
                        |   RDOUBLE
                        |   RBOOLEAN
                        |   RCHAR
                        |   RSTRING
