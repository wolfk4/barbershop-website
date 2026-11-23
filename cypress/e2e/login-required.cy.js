/// <reference types="cypress" />

describe("Empty login fields", () => {
  it("requires a username and password", () => {
    cy.visit("/login")
    cy.contains("button", "Sign In").click()

    cy.get("#username").should("have.attr", "aria-invalid", "true")
    cy.get("#password").should("have.attr", "aria-invalid", "true")
    cy.contains("Username is required.").should("be.visible")
    cy.contains("Password is required.").should("be.visible")
    cy.location("pathname").should("eq", "/login")
  })
})
