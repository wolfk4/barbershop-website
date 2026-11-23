/// <reference types="cypress" />

describe("Unauthorized admin access", () => {
  it("redirects unauthenticated visitors away from the admin page", () => {
    cy.visit("/admin")

    cy.location("pathname").should("eq", "/login")
    cy.contains("h1", "Employee Login").should("be.visible")
  })
})
