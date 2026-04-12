xport type Barber = {
  slug: string;
  name: string;
  title: string;
  image: string; // placeholder until real images are added
  bio: string;
  specialties: string[];
  instagram?: string;
};
 
export const barbers: Barber[] = [
  {
    slug: "p-da-barber",
    name: "P. Da Barber",
    title: "Master Barber",
    image: "", // import image here
    bio: "NA",
    specialties: ["Fades", "Skin Fades", "Beard Trims"],
    instagram: "",
  },
  {
    slug: "isifadez",
    name: "IsiFadez",
    title: "Barber",
    image: "",
    bio: "NA.",
    specialties: ["Fades", "Lineups", "Tapers"],
    instagram: "",
  },
  {
    slug: "kevin",
    name: "Kevin",
    title: "Barber",
    image: "",
    bio: "NA",
    specialties: ["Fades", "Beard Grooming", "Styling"],
    instagram: "",
  },
];
 
export function getBarberBySlug(slug: string): Barber | undefined {
  return barbers.find((b) => b.slug === slug);
}