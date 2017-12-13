package antonslakejer.buildinglegends.controller;

import antonslakejer.buildinglegends.Repository.ScoreRepository;
import antonslakejer.buildinglegends.domain.Build;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class LegendController {

    @Autowired
    private ScoreRepository scoreRepository;

    @GetMapping("/login")
    public ModelAndView loginPage() {
        return new ModelAndView("/login");
    }

    @GetMapping("/newuser")
    public ModelAndView newUser() {
        return new ModelAndView("/newuser");
    }

    @PostMapping("/newuser")
    public ModelAndView registerNewUser(@RequestParam String username, @RequestParam String password, @RequestParam String email) {
        String answer = scoreRepository.addMember(username, password, email);
        if (answer.equals("")) {
            return new ModelAndView("/login");
        } else {
            return new ModelAndView("/newuser").addObject("registrationError", answer);
        }
    }

    @PostMapping("/savebuild")
    @ResponseBody
    public String saveBuild(HttpSession session, @RequestParam String buildString) {
        Build build = new Build((String) session.getAttribute("user"), buildString);
        return scoreRepository.saveState(build);
//        return "legendbuilder";
    }

    @GetMapping("/loadBuilds")
    @ResponseBody
    public String loadBuilds(HttpSession session){
        return scoreRepository.getBuilds((String) session.getAttribute("user"));
    }

    @PostMapping("/login")
    public String login(HttpSession session, @RequestParam String username, @RequestParam String password) {
        String answer = scoreRepository.validateLogin(username, password);
        if (answer.equals(username)) {
            session.setAttribute("user", username);
            return "legendbuilder";
        } else
            session.setAttribute("loginError", answer);
        return "login";
    }

    @GetMapping("/legendbuilder")
    public ModelAndView legendbuilder(HttpSession session) {
        if (session.getAttribute("user") != null) {
//            session.setAttribute("build", new Build());
            return new ModelAndView("legendbuilder");
        }
        return new ModelAndView("login");
    }

}
