import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PortfolioGallery from "@/components/portfolio-gallery";
import { db } from "@/db/drizzle";
import { barbers, portfolioImages } from "@/db/schema";
import { portfolioBucket, s3 } from "@/lib/s3-client";
import { PORTFOLIO_SLOT_COUNT } from "@/lib/portfolio";
import { resolveImageUrl } from "@/lib/image-url";
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
 
  // image is usually a bucket key like "profile/3/abc.jpg", so sign it first
  const heroImage = await resolveImageUrl(barber.image);
 
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
    <div className="flex min-h-screen flex-col bg-white font-sans text-black">
      <Header />
 
      {/* profile banner - black like the Meet the Team header */}
      <section className="bg-black px-6 pb-16 pt-8 text-white md:pb-20">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/meet-the-team"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gray-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Meet the Team
          </Link>
 
          <div className="mt-10 grid items-center gap-10 md:grid-cols-[360px_1fr] md:gap-16">
            <div className="relative mx-auto aspect-4/5 w-full max-w-[360px] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={barber.name}
                  fill
                  unoptimized
                  sizes="360px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-neutral-800 via-neutral-900 to-black">
                  <Image
                    src="/KClogo.png"
                    alt=""
                    width={260}
                    height={260}
                    className="absolute opacity-10"
                  />
                  <span className="relative text-7xl font-extrabold tracking-widest text-white">
                    {getInitials(barber.name)}
                  </span>
                </div>
              )}
            </div>
 
            <div className="text-center md:text-left">
              <h1 className="mb-6 text-4xl font-extrabold uppercase tracking-widest md:text-6xl">
                {barber.name}
              </h1>
              {barber.description && (
                <p className="mx-auto mb-10 max-w-xl whitespace-pre-line text-lg text-gray-300 md:mx-0">
                  {barber.description}
                </p>
              )}
              <Link
                href="/scheduling"
                className="inline-block rounded-full bg-white px-10 py-4 font-bold uppercase tracking-wide text-black transition hover:bg-gray-200"
              >
                Book with {barber.name.split(" ")[0]}
              </Link>
            </div>
          </div>
        </div>
      </section>
 
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        {/* portfolio */}
        <section aria-label={`${barber.name}'s work portfolio`}>
          <h2 className="mb-10 text-center text-3xl font-extrabold uppercase tracking-widest">
            Portfolio
          </h2>
 
          {portfolio.length === 0 ? (
            <div className="rounded-2xl border px-6 py-20 text-center">
              <div className="mx-auto mb-6 w-fit rounded-full bg-black p-4 text-white">
                <Camera className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold">No photos yet</h3>
              <p className="text-gray-500">
                Check back soon to see {barber.name.split(" ")[0]}&apos;s work.
              </p>
            </div>
          ) : (
            <PortfolioGallery images={portfolio} barberName={barber.name} />
          )}
        </section>
      </main>
 
      <Footer />
    </div>
  );
}
 
