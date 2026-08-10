import Image from 'next/image';
import Link from 'next/link';
import css from './Hero.module.css';

export default function Hero() {
  return (
    <section className={css.hero}>
     
        <div className={css.heroBgWrapper}>
          <Image 
            src="/images/hero.png" 
            alt="Find your harmony background"
            fill 
            priority 
            className={css.backgroundImage}
          />
        </div>

        <div className={css.content}>
          <h1 className={css.title}>
  <span className={css.mobileTitle}>
    <span className={css.mobileFirstLine}>
      Find your <span className={css.italicText}>harmony</span>
    </span>
    <span className={css.mobileSecondLine}>
      in community
    </span>
  </span>

  <span className={css.desktopTitle}>
    <span>Find your</span>
    <span>
      <span className={css.italicText}>harmony</span> in
    </span>
    <span>community</span>
  </span>
</h1>
          
          <div className={css.buttons}>
            <Link href="#popular-articles" className={css.btnPrimary}>
              Go to Articles
            </Link>
            <Link href="/register" className={css.btnSecondary}>
              Register
            </Link>
          </div>

        </div>

    </section>
  );
}