package antonslakejer.buildinglegends.Repository;

import antonslakejer.buildinglegends.domain.Build;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
@Component
public class ScoreRepository {

    @Autowired
    private DataSource dataSource;

    public String addMember(String username, String password, String email) {
        if (doUserNameExist(username)) {
            return "Användarnamn upptaget!";
        } else if (isUsernameTooShort(username)) {
            return "Användarnamn måste vara minst 2 tecken";
        } else if (isUsernameTooLong(username)) {
            return "Användarnamn får max vara 20 tecken";
        } else if (isPasswordTooShort(password)) {
            return "Lösenord måste minst vara 6 tecken låååångt";
        } else if (isPasswordTooLong(password)) {
            return "Lösenord får max vara 40 tecken långt";
        }
        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement statement = conn.prepareStatement
                         ("INSERT INTO userLegends (username,password,email) VALUES(?,?,?)")) {
                statement.setString(1, username);
                statement.setString(2, password);
                statement.setString(3, email);
                statement.executeUpdate();
            } catch (SQLException e) {
                System.err.println("Super lethal error in addMember");
            }
        } else {
            System.err.println("Data is null :(");
        }
        return "";
    }

    // ändra så att den tar emot ett objekt
    public String saveState(Build build) {

        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement statement = conn.prepareStatement
                         ("INSERT INTO savedLegends (username,championkey,buildtitle,item1,item2,item3,item4,item5,item6) VALUES(?,?,?,?,?,?,?,?,?)")) {
                statement.setString(1, build.getUsername());
                statement.setInt(2, build.getChampionkey());
                statement.setString(3, build.getBuildtitle());
                int parameter = 4;
                for (int item : build.getItems()) {
                    statement.setInt(parameter, item);
                    parameter++;
                }
                statement.executeUpdate();
            } catch (SQLException e) {
                System.err.println("saveState didn´t work");
            }
        } else {
            System.err.println("Data is null not OK :(");
        }
        return "success";
    }

    public String getBuilds(String username) {
        String ret = "";
        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement statement = conn.prepareStatement
                         ("SELECT * FROM savedLegends WHERE username = ?")) {
                statement.setString(1, username);
                ResultSet rs = statement.executeQuery();
//                if (!rs.next()) {
//                    ret = "No builds found!";
//                } else {
                    while (rs.next()) {
                        ret = ret.concat(rs.getInt("id") + ",");
                        ret = ret.concat(rs.getString("username") + ",");
                        ret = ret.concat(rs.getInt("championkey") + ",");
                        ret = ret.concat(rs.getString("buildtitle") + ",");
                        ret = ret.concat(rs.getInt("item1") + ",");
                        ret = ret.concat(rs.getInt("item2") + ",");
                        ret = ret.concat(rs.getInt("item3") + ",");
                        ret = ret.concat(rs.getInt("item4") + ",");
                        ret = ret.concat(rs.getInt("item5") + ",");
                        ret = ret.concat(rs.getInt("item6") + ",");
                    }
//                }
//                System.out.println("Ret: " + ret);

            } catch (SQLException e) {
                System.err.println("saveState didn't work");
            }
        } else {
            System.err.println("Data is null not OK :(");
        }
        return ret;
    }


    public String validateLogin(String username, String password) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement statement = conn.prepareStatement
                     ("SELECT username,password FROM userLegends WHERE username = ? AND password = ? ")) {
            statement.setString(1, username);
            statement.setString(2, password);
            ResultSet rs = statement.executeQuery();

            if (!rs.next()) {
                return "Användarnamn eller lösenord fel";
            } else {
                return username;
            }
        } catch (SQLException e) {
            System.err.println("Great critical error of in validateLogin");
        }
        return "";
    }


    private boolean doUserNameExist(String username) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement statement = conn.prepareStatement
                     ("SELECT username FROM userLegends WHERE username = (?)")) {
            statement.setString(1, username);
            ResultSet rs = statement.executeQuery();
            if (!rs.next()) {
                return false;
            } else {
                return true;
            }
        } catch (SQLException e) {
            System.err.println("Fatal error in doUserExist");
        }
        return false;
    }

    private boolean isUsernameTooShort(String username) {
        if (username.length() < 2) return true;
        else return false;
    }

    private boolean isPasswordTooShort(String password) {
        if (password.length() < 6) return true;
        else return false;
    }

    private boolean isUsernameTooLong(String username) {
        if (username.length() > 20) return true;
        else return false;
    }

    private boolean isPasswordTooLong(String password) {
        if (password.length() > 40) return true;
        else return false;
    }
}
