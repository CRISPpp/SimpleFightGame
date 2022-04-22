package cn.cirsp.riotproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@Controller
public class ViewController {
    @RequestMapping("/*")
    String get(){
        return "index";
    }
}
