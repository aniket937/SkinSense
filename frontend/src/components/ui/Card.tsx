import { cx } from "@/lib/cx";

const toneClass = {
  default: "",
  blush: "bg-blush",
  moss: "bg-moss",
  honey: "bg-honey",
} as const;

type CardProps = {
  children: React.ReactNode;
  className?: string;
  tone?: keyof typeof toneClass;
  as?: "div" | "section" | "article";
  id?: string;
  "aria-labelledby"?: string;
};

export function Card({
  children,
  className,
  tone = "default",
  as = "div",
  id,
  "aria-labelledby": ariaLabelledby,
}: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={cx("brutal brutal-shadow p-5 sm:p-6", toneClass[tone], className)}
      id={id}
      aria-labelledby={ariaLabelledby}
    >
      {children}
    </Tag>
  );
}
