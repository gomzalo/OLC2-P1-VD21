public class Recursivas{

    public static void main(String []args){
        // System.out.println("ackerman(3,4) = 125");
        // System.out.println(ackerman(3,4));
        // System.out.println("ackerman(3,5) = 253");
        // System.out.println(ackerman(3,5));
        // System.out.println("ackerman(3,6) = 509");
        // System.out.println(ackerman(3,6)); // 509
        // System.out.println("ackerman(3,7) = 1021");
        // System.out.println(ackerman(3,7)); // 1021
        System.out.println("ackerman(3,8) = 2045");
        System.out.println(ackerman(3,8)); // 2045
        // System.out.println("ackerman(4,2) = xd");
        // System.out.println(ackerman(4,2));
    }

    public static int ackerman(int m, int n)
    {   
        if (m == 0){
            return n + 1;
        }else if (m > 0 && n == 0){
            return ackerman(m - 1, 1);
        }else{
            return ackerman(m - 1, ackerman(m, n - 1));
        }
    }
}