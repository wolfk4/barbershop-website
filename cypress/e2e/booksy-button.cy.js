/// <reference types="cypress" />

describe("Book with Booksy button", () => {
  it("shows a link to the shop's Booksy page", () => {
    cy.intercept("GET", "/api/shop/cart", { statusCode: 200, body: [] })
    cy.visit("/scheduling")

    cy.contains("h1", "Book Your Appointment").should("be.visible")
    cy.contains("a", "Book with Booksy")
      .should("be.visible")
      .and(
        "have.attr",
        "href",
        "https://booksy.com/en-us/974082_kaizen-cutz_barber-shop_100342_citrus-heights",
      )
  })
})
