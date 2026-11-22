import { render, screen } from "@testing-library/react"
import MeetTheTeamPage from "@/app/meet-the-team/page"
import BarberBioPage from "@/app/barbers/[id]/page"

// fake database, each query returns the next item in this list
let dbResults: unknown[] = []

jest.mock("@/db/drizzle", () => {
  const query: Record<string, unknown> = {}
  ;["from", "where", "orderBy", "limit"].forEach((name) => {
    query[name] = () => query
  })
  query.then = (resolve: (value: unknown) => void) => resolve(dbResults.shift() ?? [])
  return { db: { select: () => query } }
})

// skip the real image bucket
jest.mock("@/lib/image-url", () => ({ resolveImageUrl: async () => null }))
jest.mock("@/lib/s3-client", () => ({ s3: {}, portfolioBucket: "test" }))
jest.mock("@aws-sdk/client-s3", () => ({ GetObjectCommand: class {} }))
jest.mock("@aws-sdk/s3-request-presigner", () => ({ getSignedUrl: async () => "https://test/photo.jpg" }))

// barber not found
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND")
  },
}))

beforeEach(() => {
  dbResults = []
  // navbar cart
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: async () => [] })) as jest.Mock
})

describe("Meet the Team / Barber Profiles", () => {
  it("shows each barber with a link to their profile", async () => {
    dbResults = [[
      { id: 1, name: "Mike Tyson", description: "Knockout fades", image: null },
      { id: 2, name: "The Rizzler", description: "Rizz cuts", image: null },
    ]]
    render(await MeetTheTeamPage())

    expect(screen.getByText("Mike Tyson")).toBeInTheDocument()
    expect(screen.getByText("The Rizzler")).toBeInTheDocument()
    expect(screen.getByText("Mike Tyson").closest("a")).toHaveAttribute("href", "/barbers/1")
  })

  it("shows a message when there are no barbers", async () => {
    dbResults = [[]]
    render(await MeetTheTeamPage())

    expect(screen.getByText("Team info coming soon")).toBeInTheDocument()
  })

  it("barber profile shows their info and a book button", async () => {
    dbResults = [[{ id: 1, name: "Mike Tyson", description: "Knockout fades", image: null, userId: null }]]
    render(await BarberBioPage({ params: Promise.resolve({ id: "1" }) }))

    expect(screen.getByRole("heading", { name: "Mike Tyson" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Book with Mike" })).toHaveAttribute("href", "/scheduling")
  })

  it("shows a message when the barber has no photos", async () => {
    dbResults = [[{ id: 1, name: "Mike Tyson", description: "Knockout fades", image: null, userId: null }]]
    render(await BarberBioPage({ params: Promise.resolve({ id: "1" }) }))

    expect(screen.getByText("No photos yet")).toBeInTheDocument()
  })

  it("bad barber id goes to the not found page", async () => {
    // id that isn't a number
    await expect(BarberBioPage({ params: Promise.resolve({ id: "abc" }) })).rejects.toThrow("NOT_FOUND")

    // id that isn't in the database
    dbResults = [[]]
    await expect(BarberBioPage({ params: Promise.resolve({ id: "999" }) })).rejects.toThrow("NOT_FOUND")
  })
})
