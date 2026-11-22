import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { SizeSelector } from "@/components/size-selector"

// fake popup messages
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }))
const mockToast = jest.requireMock("sonner").toast

// shirt with no S, 3 M left, and plenty of the rest
const stock = { S: 0, M: 3, L: 10, XL: 10, "2XL": 10 }

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, "error").mockImplementation(() => {})
})

describe("Shop / Cart", () => {
  it("sold out sizes can't be picked", () => {
    render(<SizeSelector itemId="shirt-1" stockBySize={stock} />)
    expect(screen.getByRole("button", { name: "S" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "L" })).toBeEnabled()
    expect(screen.getByText("Crossed out sizes are sold out.")).toBeInTheDocument()
  })

  it("can't add to cart without picking a size", () => {
    render(<SizeSelector itemId="shirt-1" stockBySize={stock} />)
    expect(screen.getByRole("button", { name: /select a size/i })).toBeDisabled()
  })

  it("shows how many are left when stock is low", () => {
    render(<SizeSelector itemId="shirt-1" stockBySize={stock} />)
    fireEvent.click(screen.getByRole("button", { name: "M" }))
    expect(screen.getByText("Only 3 left")).toBeInTheDocument()
  })

  it("adds the shirt to the cart", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: async () => ({ quantity: 1 }) })) as jest.Mock
    render(<SizeSelector itemId="shirt-1" stockBySize={stock} />)

    fireEvent.click(screen.getByRole("button", { name: "L" }))
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }))

    await waitFor(() => expect(mockToast.success).toHaveBeenCalledWith("Added to cart"))
    expect(global.fetch).toHaveBeenCalledWith("/api/shop/cart", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ itemId: "shirt-1", size: "L" }),
    }))
  })

  it("shows an error when the item is out of stock", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: async () => ({ error: "This item is out of stock" }) })
    ) as jest.Mock
    render(<SizeSelector itemId="shirt-1" stockBySize={stock} />)

    fireEvent.click(screen.getByRole("button", { name: "L" }))
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }))

    await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith("This item is out of stock"))
  })
})
