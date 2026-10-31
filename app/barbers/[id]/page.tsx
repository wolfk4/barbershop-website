import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PortfolioGallery from "@/components/portfolio-gallery";
import { db } from "@/db/drizzle";
import { barbers, portfolioImages } from "@/db/schema";
import { portfolioBucket, s3 } from "@/lib/s3-client";
import { PORTFOLIO_SLOT_COUNT } from "@/lib/portfolio";
import { and, asc, eq, isNotNull } from "drizzle-orm";
 
type BarberBioPageProps = {
  readonly params: Promise<{ readonly id: string }>;
};
 
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
 
export default async function BarberBioPage({ params }: BarberBioPageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isSafeInteger(id)) notFound();
 
  const [barber] = await db.select().from(barbers).where(eq(barbers.id, id)).limit(1);
  if (!barber) notFound();
 
  const images = barber.userId
    ? await db
        .select({ slot: portfolioImages.slot, objectKey: portfolioImages.objectKey })
        .from(portfolioImages)
        .where(and(eq(portfolioImages.ownerUserId, barber.userId), isNotNull(portfolioImages.slot)))
        .orderBy(asc(portfolioImages.slot))
        .limit(PORTFOLIO_SLOT_COUNT)
    : [];
 
  // only the photos they actually uploaded, no empty slots
  const portfolio = await Promise.all(
    images.map(async ({ objectKey }) =>
      getSignedUrl(s3, new GetObjectCommand({ Bucket: portfolioBucket, Key: objectKey }), {
        expiresIn: 3600,
      }),
    ),
  );
 
  return (
    <div className="min-h-screen bg-white">
      <Header />
 
      <main className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/meet-the-team"
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Meet the Team
        </Link>
 
        {/* profile */}
        <section className="mt-8 grid items-center gap-10 md:grid-cols-[320px_1fr]">
          <div className="relative mx-auto aspect-4/5 w-full max-w-[320px] overflow-hidden rounded-2xl bg-black shadow-md">
            {barber.image ? (
              <Image
                src={barber.image}
                alt={barber.name}
                fill
                sizes="320px"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-6xl font-extrabold tracking-widest text-white">
                  {getInitials(barber.name)}
                </span>
              </div>
            )}
          </div>
 
          <div className="text-center md:text-left">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-500">Barber</p>
            <h1 className="mb-5 text-4xl font-extrabold md:text-5xl">{barber.name}</h1>
            {barber.description && (
              <p className="mb-8 max-w-xl whitespace-pre-line text-gray-700">
                {barber.description}
              </p>
            )}
            <Link
              href="/scheduling"
              className="inline-block rounded-full bg-black px-8 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-gray-800"
            >
              Book with {barber.name.split(" ")[0]}
            </Link>
          </div>
        </section>
 
        {/* portfolio */}
        <section className="mt-20" aria-label={`${barber.name}'s work portfolio`}>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold">Portfolio</h2>
          </div>
 
          {portfolio.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
              Portfolio coming soon.
            </p>
          ) : (
            <PortfolioGallery images={portfolio} barberName={barber.name} />
          )}
        </section>
      </main>
 
      <Footer />
    </div>
  );
}
