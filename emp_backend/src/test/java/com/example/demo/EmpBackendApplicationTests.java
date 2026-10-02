package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.demo.model.ActivityLog;
import com.example.demo.repository.ActivityLogRepository;

@SpringBootTest
class EmpBackendApplicationTests {

	@Value("${spring.datasource.url}")
	private String datasourceUrl;

	@Autowired
	private ActivityLogRepository activityLogRepository;

	@Test
	void contextLoads() {
	}

	@Test
	void datasourceShouldUsePersistentFileStorage() {
		assertThat(datasourceUrl).contains("jdbc:h2:file:");
		assertThat(datasourceUrl).doesNotContain("jdbc:h2:mem:");
	}

	@Test
	void activityLogRepositoryShouldSaveAuditEntries() {
		ActivityLog log = new ActivityLog();
		log.setUser("admin_4827");
		log.setPage("/login");
		log.setAction("LOGIN");
		log.setDetails("Admin login attempted");
		log.setStatus("INFO");

		ActivityLog saved = activityLogRepository.save(log);

		assertThat(saved.getId()).isGreaterThan(0);
		assertThat(activityLogRepository.findById(saved.getId())).isPresent();
	}

}
