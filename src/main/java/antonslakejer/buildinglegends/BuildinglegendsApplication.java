package antonslakejer.buildinglegends;

import Repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@SpringBootApplication
@Controller
public class BuildinglegendsApplication {

	//@Autowired
	private ScoreRepository scoreRepository;

	public static void main(String[] args) {
		SpringApplication.run(BuildinglegendsApplication.class, args);
	}

	@Autowired
	private DataSource dataSource;

	@GetMapping("/select")
	public String testingQuery(){
		try (Connection conn = dataSource.getConnection();
			 PreparedStatement statement = conn.prepareStatement("SELECT * FROM Legends ")){
			ResultSet rs = statement.executeQuery();
			if (rs.next()) {
				return "dyn";
			}
		}
		catch (SQLException e){
			System.err.println("Great critical error of in validateLogin");
		}

		return "login";

	}




	@GetMapping("/login")
	public String login() {
		return "login";
	}

	@GetMapping("/newuser")
	public String newUser() {
		return "newuser";
	}

	@PostMapping("/newuser")
	public ModelAndView submit(HttpSession session, @RequestParam String username, @RequestParam String password) {
		System.out.println(username + " " + password);
		String answer = scoreRepository.addMember(username, password);
		if (answer.equals("")) {
			return new ModelAndView("/");
		} else {
			System.out.println("Hans was here");
			return new ModelAndView("/newuser").addObject("registrationError", answer);
		}
	}

	@PostMapping("/login")
	public ModelAndView login(HttpSession session, @RequestParam String username, @RequestParam String password) {
		System.out.println(username + " " + password);
		String answer = scoreRepository.validateLogin(username, password);
		if (answer.equals(username)) {
			return new ModelAndView("/").addObject("username", username);
		} else return new ModelAndView("/login").addObject("loginError", answer);

	}
}