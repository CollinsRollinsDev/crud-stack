import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Homepage from '../components/Homepage'
import Register from '../components/Register'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Auth Play Register</title>
        <meta name="description" content="Coded by Collins Rollins" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <Register />
    
    </div>
  )
}

export default Home