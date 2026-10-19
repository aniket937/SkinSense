type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  id?: string;
};

export function SectionHeading({ eyebrow, title, sub, align = "left", id }: SectionHeadingProps) {
  return (
    <header className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="display mt-2 text-3xl sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-base text-ink-soft">{sub}</p>}
    </header>
  );
}
