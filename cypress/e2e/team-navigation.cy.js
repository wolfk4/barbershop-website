/// <reference types="cypress" />

describe("Meet the Team navigation", () => {
  it("navigates to the team page", () => {
    cy.intercept("GET", "/api/shop/cart", { statusCode: 200, body: [] })
    cy.visit("/scheduling")

    cy.contains("section a", "Meet the Team").click()
    cy.location("pathname", { timeout: 20000 }).should("eq", "/meet-the-team")
  })
})
