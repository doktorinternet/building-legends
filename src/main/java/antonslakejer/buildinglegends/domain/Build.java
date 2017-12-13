package antonslakejer.buildinglegends.domain;

import java.util.Scanner;

public class Build {
    private String username;
    private int champion;
    private String title;
    private int items[] = new int[6];

    public Build(String username, String build) {
        Scanner sc = new Scanner(build);
        sc.useDelimiter(",");
        System.out.println(build);
        setUsername(username);
        setTitle(sc.next());
        setChampion(sc.nextInt());
        for (int i = 0; i < items.length; i++) {
            if (sc.hasNext()) {
                items[i] = sc.nextInt();
            }else{
                items[i] = 0;
            }
        }
        sc.close();
    }

    public int[] getItems(){
        return items;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getChampion() {
        return champion;
    }

    public void setChampion(int champion) {
        this.champion = champion;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return String.format("Username: %s BuildTitle: %s Item1: %d",username, title, items[0]);
    }
}
