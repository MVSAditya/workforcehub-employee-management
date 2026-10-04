package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
        "/home",
        "/login",
        "/show-all-employees",
        "/add-employee",
        "/activity-log",
        "/updating-by-id/{id}",
        "/details-of-employee/{id}"
    })
    public String forwardToAngular() {
        return "forward:/index.html";
    }
}
