import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { variants } from 'cylchess-logic'
import Rooms from '../components/Rooms/Rooms'
import NewRoom from '../components/NewRoom/NewRoom'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cylchess</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Cylchess
        </h1>

        <p className={styles.description}>
          Play one of {variants.size} (and growing) chess variants against people or AI!
        </p>

        <div className={styles.grid}>
          <Rooms />
          <NewRoom />
        </div>
      </main>

      <footer className={styles.footer}>
        <div>
          Created by&nbsp;
          <a href="http://ideasalmanac.com">Filip Artur Kowalski</a>
        </div>
        <div>
          This project is open source. You can&nbsp;
          <a href="https://github.com/Voycawojka/cylchess">implement a new variant</a>
          &nbsp;if you can code ;)
        </div>
      </footer>
    </div>
  )
}
