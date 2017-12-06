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
    public String newUser() {
        return "newuser";
    }

    @PostMapping("/newuser")
    public ModelAndView submit(@RequestParam String username, @RequestParam String password) {
        String answer = scoreRepository.addMember(username, password);
        if (answer.equals("")) {
            return new ModelAndView("/dyn");
        } else {
            return new ModelAndView("/newuser").addObject("registrationError", answer);
        }
    }

    @PostMapping("/login")
    public ModelAndView login(@RequestParam String username, @RequestParam String password) {
        String answer = scoreRepository.validateLogin(username, password);
        if (answer.equals(username)) {
            return new ModelAndView("/dyn");  //.addObject("username", username);
        } else return new ModelAndView("/login"); //.addObject("loginError", answer);
    }

    @GetMapping("/savedLegends")
    public ModelAndView savedLegends(){
        return new ModelAndView ("/savedLegends");
    }
}



