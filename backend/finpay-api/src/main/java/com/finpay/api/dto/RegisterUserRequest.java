package com.finpay.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterUserRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name is too long")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name is too long")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Size(max = 255, message = "Email is too long")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^(\\+254|0|254)7\\d{8}$",
        message = "Enter a valid Kenyan phone number"
    )
    private String phoneNumber;

    public RegisterUserRequest() {}

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
