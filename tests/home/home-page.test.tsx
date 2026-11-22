
import { fireEvent, render, screen } from "@testing-library/react"
import Header from "@/components/header"
import HomePage from "@/components/HomePage"
import ShopHours from "@/components/shop-hours"

// typing animation uses motion, just show the text instead
jest.mock("@/components/ui/typing-animation", () => ({
  TypingAnimation: ({ words }: { words: string[] }) => <span>{words[0]}</span>,
}))

beforeEach(() => {
  // fake cart with 2 items
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: async () => [{ id: 1 }, { id: 2 }] })
  ) as jest.Mock
})

afterEach(() => {
  jest.useRealTimers()
})

describe("Home Page / Navbar", () => {
  it("navbar links go to the right pages", () => {
    render(<Header />)
    expect(screen.getByRole("link", { name: "Meet the Team" })).toHaveAttribute("href", "/meet-the-team")
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/shop")
    expect(screen.getByRole("link", { name: "About Us" })).toHaveAttribute("href", "/about-us")
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact")
  })

  it("Book Now buttons go to the booking page", () => {
    render(
      <>
        <Header />
        <HomePage />
      </>
    )
    screen.getAllByRole("link", { name: /book now/i }).forEach((button) => {
      expect(button).toHaveAttribute("href", "/scheduling")
    })
  })

  it("cart icon shows how many items are in the cart", async () => {
    render(<Header />)
    expect(await screen.findByText("2")).toBeInTheDocument()
  })

  it("hamburger menu opens on mobile", () => {
    render(<Header />)
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument()
  })

  it("shop hours shows open or closed", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] })

    // Tuesday 2 PM, should be open
    jest.setSystemTime(new Date("2026-11-24T14:00:00-08:00"))
    const { unmount } = render(<ShopHours />)
    expect(await screen.findByText("Open now · until 6:00 PM")).toBeInTheDocument()
    unmount()

    // Sunday 6 PM, should be closed
    jest.setSystemTime(new Date("2026-11-22T18:00:00-08:00"))
    render(<ShopHours />)
    expect(await screen.findByText("Closed now")).toBeInTheDocument()
  })
})
