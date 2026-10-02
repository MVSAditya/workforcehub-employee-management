package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.ActivityLog;
import com.example.demo.repository.ActivityLogRepository;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:38893", "http://127.0.0.1:4200", "http://127.0.0.1:38893"})
@RequestMapping("/api/v1")
public class ActivityLogController {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @GetMapping("/activity-logs")
    public List<ActivityLog> getAllLogs() {
        return activityLogRepository.findAllByOrderByTimestampDesc();
    }

    @PostMapping("/activity-logs")
    public ActivityLog createLog(@RequestBody ActivityLog log) {
        if (log.getTimestamp() == null || log.getTimestamp().isBlank()) {
            log.setTimestamp(java.time.Instant.now().toString());
        }
        return activityLogRepository.save(log);
    }
}
