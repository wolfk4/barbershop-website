import { render, screen } from "@testing-library/react"
import SchedulingPage from "@/app/scheduling/page"
import BooksyWidget from "@/components/BooksyWidget"

const BOOKSY_URL = "https://booksy.com/en-us/974082_kaizen-cutz_barber-shop_100342_citrus-heights"

beforeEach(() => {
  // navbar cart
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: async () => [] })) as jest.Mock
})

describe("Booking", () => {
  it("Book with Booksy button opens the shop's Booksy page", () => {
    render(<SchedulingPage />)
    const button = screen.getByRole("link", { name: "Book with Booksy" })
    expect(button).toHaveAttribute("href", BOOKSY_URL)
    expect(button).toHaveAttribute("target", "_blank")
  })

  it("Meet the Team button goes to the team page", () => {
    render(<SchedulingPage />)
    const links = screen.getAllByRole("link", { name: "Meet the Team" })
    // last one is the button on the page, the first one is in the navbar
    expect(links[links.length - 1]).toHaveAttribute("href", "/meet-the-team")
  })

  it("Booksy widget loads with a real Booksy link", () => {
    const { container } = render(<BooksyWidget src="https://booksy.com/widget/code.js?id=974082" />)
    expect(container.querySelector("script")).toHaveAttribute("src", "https://booksy.com/widget/code.js?id=974082")
  })

  it("Booksy widget does not load with a bad link", () => {
    const badLinks = ["https://evil.com/code.js", "http://booksy.com/code.js", "not a link"]
    badLinks.forEach((link) => {
      const { container, unmount } = render(<BooksyWidget src={link} />)
      expect(container.querySelector("script")).toBeNull()
      unmount()
    })
  })
})
