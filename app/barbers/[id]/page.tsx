import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { db } from "@/db/drizzle";
import { barbers, portfolioImages } from "@/db/schema";
import { portfolioBucket, s3 } from "@/lib/s3-client";
import { desc, eq } from "drizzle-orm";

 
type BarberBioPageProps = {
  readonly params: Promise<{ readonly id: string }>;
};

export default async function BarberBioPage({ params }: BarberBioPageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isSafeInteger(id)) notFound();

  const [barber] = await db.select().from(barbers).where(eq(barbers.id, id)).limit(1);
  if (!barber) notFound();

  const images = barber.userId
    ? await db
        .select({ objectKey: portfolioImages.objectKey })
        .from(portfolioImages)
        .where(eq(portfolioImages.ownerUserId, barber.userId))
        .orderBy(desc(portfolioImages.createdAt))
        .limit(6)
    : [];

  const portfolio = await Promise.all(
    images.map(async ({ objectKey }) => ({
      url: await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: portfolioBucket, Key: objectKey }),
        { expiresIn: 3600 },
      ),
    })),
  );

 
  return (
    <div className="bg-[#f0f0f0] min-h-screen">
      <Header />
 
      <main className="flex flex-col items-center py-16 px-6">
        <div className="w-full max-w-6xl">
          <Link href="/meet-the-team" className="text-sm text-gray-600 hover:underline">
            ← Back to Meet the Team
          </Link>
 
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="relative w-full h-72 bg-gray-200">
                {barber.image ? (
                  <Image
                    src={barber.image}
                    alt={barber.name}
                    fill
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 100 120" className="w-24 h-24 text-gray-400" fill="currentColor">
                      <circle cx="50" cy="38" r="22" />
                      <path d="M10 110 Q10 75 50 75 Q90 75 90 110 Z" />
                    </svg>
                  </div>
                )}
              </div>
 
              <div className="p-6">
                <h1 className="text-2xl font-bold">{barber.name}</h1>
                <p className="text-gray-500 text-sm mt-1">{barber.createdAt.toLocaleDateString()}</p>
 
                <p className="mt-4 text-gray-700">{barber.description}</p>
 
                {/* {barber[0].specialties.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Specialties</p>
                    <p className="text-sm text-gray-700">{barber.specialties.join(", ")}</p>
                  </div>
                )}
    */}
                {/* <Button className="mt-6 w-full" asChild>
                  <Link href="/book">Book with {barber.name}</Link>
                </Button> */}
              </div>
            </div>

            <section aria-label={`${barber.name}'s work portfolio`}>
              {portfolio.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {portfolio.map((image, index) => (
                    <div key={image.url} className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                      <Image
                        src={image.url}
                        alt={`${barber.name}'s work ${index + 1}`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, 30vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-48 items-center justify-center bg-gray-200 px-6 text-center text-sm text-gray-600">
                  No photos yet.
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
 
      <Footer />
    </div>
  );
}
 