package antonslakejer.buildinglegends.controller;

import antonslakejer.buildinglegends.domain.Rune;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
public class LegendController {

    @GetMapping("")
    @ResponseBody
    public List<Rune> sendRunesToJS() {
        return new ArrayList<>();
    }

}
