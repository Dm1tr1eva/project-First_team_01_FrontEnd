import Link from 'next/link';
import Image from 'next/image';
import styles from './TopCreators.module.css';

const creators = [
  { id: 1, name: 'Naomi', avatar: '/images/creators/naomi.jpg' },
  { id: 2, name: 'Andrii', avatar: '/images/creators/andrii.jpg' },
  { id: 3, name: 'Emma', avatar: '/images/creators/emma.jpg' },
  { id: 4, name: 'Max', avatar: '/images/creators/max.jpg' },
  { id: 5, name: 'Tony', avatar: '/images/creators/tony.jpg' },
  { id: 6, name: 'Tailor', avatar: '/images/creators/tailor.jpg' },
];

export default function TopCreators() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Top Creators</h2>
        <Link href="/creators" className={styles.link}>
          Go to all Creators
        </Link>
      </div>

      <ul className={styles.list}>
        {creators.map(({ id, name, avatar }) => (
          <li key={id} className={styles.card}>
            <Image
              src={avatar}
              alt={`Фото автора ${name}`}
              width={104}
              height={104}
              className={styles.avatar}
            />
            <p className={styles.name}>{name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}