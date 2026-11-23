/// <reference types="cypress" />

describe("Mobile menu navigation", () => {
  it("opens the mobile menu and navigates to booking", () => {
    cy.viewport(375, 812)
    cy.intercept("GET", "/api/shop/cart", { statusCode: 200, body: [] })
    cy.visit("/scheduling")

    cy.get('button[aria-label="Open menu"]').click()
    cy.get("nav:visible").contains("Contact").click()
    cy.location("pathname", { timeout: 20000 }).should("eq", "/contact")
    cy.get('button[aria-label="Open menu"]').click()
    cy.get("nav:visible").contains("Book Now").should("be.visible").click()
    cy.location("pathname", { timeout: 20000 }).should("eq", "/scheduling")
    cy.get('button[aria-label="Open menu"]').should("be.visible")
  })
})
