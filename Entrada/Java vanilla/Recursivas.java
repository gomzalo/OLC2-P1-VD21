public class Recursivas{

    public static void main(String []args){
        System.out.println(ackerman(3,5));
    }

    public static int ackerman(int m, int n)
    {   
        System.out.println("ACKERMANNNNNNNNNNNNNNN-"+m+" "+n);
        if (m == 0){
            System.out.println("ACKERMANNNNNNNNNNNNNNN- if"+m+" "+n);
            return n + 1;
        }else if (m > 0 && n == 0){
            System.out.println("ACKERMANNNNNNNNNNNNNNN- else if"+m+" "+n);
            return ackerman(m - 1, 1);
        }else{
            System.out.println("ACKERMANNNNNNNNNNNNNNN- else"+m+" "+n);
            return ackerman(m - 1, ackerman(m, n - 1));
        }
    }
}