package antonslakejer.buildinglegends;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@Controller
public class DBTest {

    @Autowired
    DataSource dataSource;

    @RequestMapping(value = "/dbtest", produces = "text/plain")
    @ResponseBody
    public String test() {
        System.out.println("HEje");
        int two = 0;

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT 1+1")) {

            rs.next();
            two = rs.getInt(1);

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return "Database connectivity seems " + (two == 2 ? "OK." : "weird!");
    }

    @GetMapping(value = "/tester")
    public String tester(){
        return "dyn";
    }

}
