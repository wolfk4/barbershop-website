import { sql } from "@/lib/db"

export type Barber = 
{
  id: number
  slug: string
  name: string
  title: string
  bio: string
  image: string | null
  gallery: string[]
  specialties: string[]
  booking_url: string | null
}

export async function getAllBarbers() 
{
  const data = await sql`SELECT * FROM barbers ORDER BY created_at ASC`
  return data as Barber[]
}

export async function getBarberBySlug(slug: string) 
{
  const data = await sql`SELECT * FROM barbers WHERE slug = ${slug} LIMIT 1`
  return data[0] as Barber | undefined
}

export async function getAllBarberSlugs() 
{
  const data = await sql`SELECT slug FROM barbers`
  return data as { slug: string }[]
}