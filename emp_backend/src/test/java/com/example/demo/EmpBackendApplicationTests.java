package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootTest
class EmpBackendApplicationTests {

	@Value("${spring.datasource.url}")
	private String datasourceUrl;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Test
	void contextLoads() {
	}

	@Test
	void datasourceShouldUsePersistentFileStorage() {
		assertThat(datasourceUrl).contains("jdbc:h2:file:");
		assertThat(datasourceUrl).doesNotContain("jdbc:h2:mem:");
	}

	@Test
	void databaseShouldOnlyHaveEmployeeAndAdminDataTables() {
		assertThat(tableExists("EMPLOYEES_TABLE")).isTrue();
		assertThat(tableExists("ADMIN")).isTrue();
		assertThat(tableExists("ACTIVITY_LOG")).isFalse();
	}

	private boolean tableExists(String tableName) {
		return jdbcTemplate.queryForObject(
			"SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE LOWER(TABLE_NAME) = LOWER(?)",
			Integer.class,
			tableName
		) > 0;
	}

}
