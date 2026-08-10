import Link from 'next/link';
import css from './Footer.module.css';
export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.wrap}>
        <Link href="/" className={css.headerLink} aria-label="Home">
          <svg className={css.logoIcon}>
            <use href="/icon.svg#iconlogo" />
          </svg>
        </Link>
        <p>&copy; {new Date().getFullYear()} Harmoniq. All rights reserved.</p>

        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/" className={css.navigationLink}>
              Articles
            </Link>
          </li>

          <li className={css.navigationItemDesc}>
            <Link href="/" className={css.navigationLink}>
              Account
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
