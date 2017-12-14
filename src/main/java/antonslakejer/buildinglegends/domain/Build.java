package antonslakejer.buildinglegends.domain;

import java.util.Scanner;

public class Build {
    private String username;
    private String championname;

    private int championkey;
    private String buildtitle;
    private int items[] = new int[6];

    public Build(String username, String build) {
        Scanner sc = new Scanner(build);
        sc.useDelimiter(",");
//        System.out.println(build);
        setUsername(username);
        setBuildtitle(sc.next());
        setChampionname(sc.next());
        setChampionkey(sc.nextInt());
        for (int i = 0; i < items.length; i++) {
            if (sc.hasNext()) {
                items[i] = sc.nextInt();
            }else{
                items[i] = 0;
            }
        }
        sc.close();
    }

    public String getChampionname() {
        return championname;
    }

    public void setChampionname(String championname) {
        this.championname = championname;
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

    public int getChampionkey() {
        return championkey;
    }

    public void setChampionkey(int championkey) {
        this.championkey = championkey;
    }

    public String getBuildtitle() {
        return buildtitle;
    }

    public void setBuildtitle(String buildtitle) {
        this.buildtitle = buildtitle;
    }

    @Override
    public String toString() {
        return String.format("Username: %s BuildTitle: %s Item1: %d",username, buildtitle, items[0]);
    }
}
