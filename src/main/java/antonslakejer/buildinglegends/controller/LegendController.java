package antonslakejer.buildinglegends.controller;

import antonslakejer.buildinglegends.Repository.ScoreRepository;
import antonslakejer.buildinglegends.domain.Build;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

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
    public String saveBuild(HttpSession session, @ModelAttribute Build build){
        if(session.getAttribute("build") != null){
//            scoreRepository.saveBuild(build);
            System.out.println(build.getJsonString());
            return build.getJsonString();
        }
        return "redirect:/legendbuilder";
    }

 /*   @PostMapping("/login")
    public ModelAndView login(HttpSession session, @RequestParam String username, @RequestParam String password) {
        String answer = scoreRepository.validateLogin(username, password);
        if (answer.equals(username)) {
            session.setAttribute("user", username);
            return new ModelAndView("/legendbuilder"); //.addObject("username", username);
        } else return new ModelAndView("/login").addObject("loginError", answer);
    }*/

    @PostMapping("/login")
    public String login(Model model, HttpSession session, @RequestParam String username, @RequestParam String password) {
        String answer = scoreRepository.validateLogin(username, password);
        if (answer.equals(username)) {
            session.setAttribute("user", username);
            model.addAttribute("build", new Build());
            return "legendbuilder";
        } else
            session.setAttribute("loginError",answer);
            return "login";
    }

    @GetMapping("/legendbuilder")
    public ModelAndView legendbuilder(HttpSession session) {
        if (session.getAttribute("user") != null) {
//            session.setAttribute("build", new Build());
            return new ModelAndView("legendbuilder").addObject("build", new Build());
        }
        return new ModelAndView("login");
    }

}
