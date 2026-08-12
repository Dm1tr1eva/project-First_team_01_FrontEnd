import Image from "next/image";
import Link from "next/link";

import { type User } from "@/types/user";
import css from "./AuthorsItem.module.css";

interface AuthorUserProps {
  author: User;
}

export default function AuthorsItem({ author }: AuthorUserProps) {
  return (
    <li className={css.item}>
      <Link href={`/authors/${author._id}`} className={css.link}>
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={262}
            height={262}
            className={css.avatar}
          />
        ) : (
          <div className={css.avatarPlaceholder}>{author.name.charAt(0).toUpperCase()}</div>
        )}

        <p className={css.name}>{author.name}</p>
      </Link>
    </li>
  );
}
