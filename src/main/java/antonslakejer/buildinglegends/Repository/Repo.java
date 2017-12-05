package antonslakejer.buildinglegends.Repository;

//Bra att ha överblick över scorerepot som kommer bli ganska rörigt, om inte annat :)

public interface Repo {

    String addMember(String username, String password);
    String validateLogin(String username, String password);
}
