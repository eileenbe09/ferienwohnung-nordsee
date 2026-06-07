import Link from "next/link";

type ApartmentCardProps = {
  name: string;
  slug: string;
  shortDescription: string;
  guests: string;
  size: number;
  image: string;
};

export default function ApartmentCard({
  name,
  slug,
  shortDescription,
  guests,
  size,
  image,
}: ApartmentCardProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div
        className="h-64 w-full bg-cover bg-center sm:h-72"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className="p-6 sm:p-7">
        <h3 className="text-2xl font-semibold text-[#1f1c19]">{name}</h3>

        <p className="mt-4 leading-7 text-stone-600">{shortDescription}</p>

        <div className="mt-5 space-y-1 text-sm text-stone-700">
          <p>{guests}</p>
          <p>{size} m²</p>
        </div>

        <Link
          href={`/wohnungen/${slug}`}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#66735f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Mehr erfahren
        </Link>
      </div>
    </div>
  );
}