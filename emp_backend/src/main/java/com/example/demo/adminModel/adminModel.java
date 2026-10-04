package com.example.demo.adminModel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "admin")
public class adminModel {

	public adminModel() {}

	public adminModel(String adminName, String adminPassword) {
		this.adminName = adminName;
		this.adminPassword = adminPassword;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long adminID;

	@Column(name = "adminName")
	private String adminName;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(name = "adminPassword")
	private String adminPassword;

	public long getAdminID() {
		return adminID;
	}

	public void setAdminID(long adminID) {
		this.adminID = adminID;
	}

	public String getAdminName() {
		return adminName;
	}

	public void setAdminName(String adminName) {
		this.adminName = adminName;
	}

	public String getAdminPassword() {
		return adminPassword;
	}

	public void setAdminPassword(String adminPassword) {
		this.adminPassword = adminPassword;
	}
}
