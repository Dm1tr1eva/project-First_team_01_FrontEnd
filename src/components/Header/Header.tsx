'use client';

import Link from 'next/link';
import css from './Header.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter, usePathname } from 'next/navigation';

import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const getLinkClass = (path: string) => {
    return pathname === path
      ? `${css.navigationLink} ${css.active}`
      : css.navigationLink;
  };

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  const handleBurger = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <header className={css.header}>
        <div className={css.headerWrapper}>
          <Link
            onClick={() => setIsOpen(false)}
            href="/"
            className={css.headerLink}
            aria-label="Home">
            <svg className={css.logoIcon}>
              <use href="/icon.svg#iconlogo" />
            </svg>
          </Link>
          <div className={css.navigationDescFild}>
            <nav aria-label="Main Navigation">
              <ul className={css.navigationDesc}>
                <li className={css.navigationItemDesc}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/"
                    className={getLinkClass('/')}>
                    Home
                  </Link>
                </li>

                <li className={css.navigationItemDesc}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/"
                    className={getLinkClass('/')}>
                    Articles
                  </Link>
                </li>

                <li className={css.navigationItemDesc}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/"
                    className={getLinkClass('/')}>
                    Creators
                  </Link>
                </li>

                {isAuthenticated ? (
                  <>
                    <li className={css.navigationItemDesc}>
                      <Link
                        onClick={() => setIsOpen(false)}
                        href="/profile"
                        prefetch={false}
                        className={getLinkClass('/profile')}>
                        My Profile
                      </Link>
                    </li>

                    <li className={css.navigationItem}>
                      <Link
                        onClick={() => setIsOpen(false)}
                        href="/"
                        prefetch={false}
                        className={css.navigationLinkJoinDesc}>
                        Create an article
                      </Link>
                    </li>

                    <li className={css.userFieldDesc}>
                      <div className={css.userFieldFirst}>
                        <img
                          className={css.userAvatar}
                          src={user?.avatar}
                          alt={user?.email || 'User avatar'}
                        />

                        <p className={css.userName}>{user?.email}</p>
                      </div>
                      <Link href={`/logoutUser/`} className={css.logoutButton}>
                        Logout
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className={css.navigationItemDesc}>
                      <Link
                        onClick={() => setIsOpen(false)}
                        href="/sign-in"
                        prefetch={false}
                        className={css.navigationLink}>
                        Log in
                      </Link>
                    </li>

                    <li className={css.navigationItem}>
                      <Link
                        onClick={() => setIsOpen(false)}
                        href="/"
                        prefetch={false}
                        className={css.navigationLinkJoinDesc}>
                        Join now
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
            <div>
              <button
                className={css.navBarMobButton}
                type="button"
                onClick={handleBurger}>
                {isOpen ? (
                  <>
                    <svg width="32" height="32">
                      <use href="/icon.svg#iconcontrolsclose" />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg width="32" height="32">
                      <use href="/icon.svg#icongenericburgerregular" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div
        className={isOpen ? `${css.navBarMob} ${css.isOpen}` : css.navBarMob}>
        <nav aria-label="Main Navigation">
          <ul className={css.navigation}>
            <li className={css.navigationItem}>
              <Link
                onClick={() => setIsOpen(false)}
                href="/"
                className={getLinkClass('/')}>
                Home
              </Link>
            </li>

            <li className={css.navigationItem}>
              <Link
                onClick={() => setIsOpen(false)}
                href="/"
                className={getLinkClass('/')}>
                Articles
              </Link>
            </li>

            <li className={css.navigationItem}>
              <Link
                onClick={() => setIsOpen(false)}
                href="/"
                className={getLinkClass('/')}>
                Creators
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className={css.navigationItem}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/profile"
                    prefetch={false}
                    className={getLinkClass('/profile')}>
                    My Profile
                  </Link>
                </li>

                <li className={css.navigationItem}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/"
                    prefetch={false}
                    className={css.navigationLinkJoin}>
                    Create an article
                  </Link>
                </li>

                <li className={css.userField}>
                  <div className={css.userFieldFirst}>
                    <img
                      className={css.userAvatar}
                      src={user?.avatar}
                      alt={user?.email || 'User avatar'}
                    />

                    <p className={css.userName}>{user?.email}</p>
                  </div>

                  <Link href={`/logoutUser/`} className={css.logoutButton}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className={css.navigationItem}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/sign-in"
                    prefetch={false}
                    className={css.navigationLink}>
                    Log in
                  </Link>
                </li>

                <li className={css.navigationItem}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href="/"
                    prefetch={false}
                    className={css.navigationLinkJoin}>
                    Join now
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
