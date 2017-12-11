package antonslakejer.buildinglegends.controller;

import antonslakejer.buildinglegends.Repository.ScoreRepository;
import antonslakejer.buildinglegends.domain.Rune;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import java.util.ArrayList;
import java.util.List;

@Controller
public class LegendController {

    @Autowired
    private ScoreRepository scoreRepository;

    @GetMapping("/rune")
    @ResponseBody
    public List<Rune> sendRunesToJS() {
        return new ArrayList<>();
    }


    @GetMapping("/login")
    public ModelAndView loginPage(){
        return new ModelAndView("/login");
    }

    @GetMapping("/newuser")
    public ModelAndView newUser() {
        return new ModelAndView("/newuser");
    }

    @PostMapping("/newuser")
    public ModelAndView registerNewUser(@RequestParam String username, @RequestParam String password, @RequestParam String email) {
        String answer = scoreRepository.addMember(username, password,email);
        if (answer.equals("")) {
            return new ModelAndView("/login");
        } else {
            return new ModelAndView("/newuser").addObject("registrationError", answer);
        }
    }

    @PostMapping("/login")
    public ModelAndView login(@RequestParam String username, @RequestParam String password) {
        String answer = scoreRepository.validateLogin(username, password);
        if (answer.equals(username)) {
            return new ModelAndView("/legendbuilder").addObject("username", username);
        } else return new ModelAndView("/login").addObject("loginError", answer);
    }

    @GetMapping("/savedLegends")
    public ModelAndView savedLegends(){
        return new ModelAndView ("/savedLegends");
    }
}



