import React from 'react'
import styles from './Homepage.module.scss';
import Header from './Header';
import Intro from './Intro';

const Homepage = () => {
  return (
    <>
    <Header currentPage="home" />
    <Intro />
    </>
  )
}

export default Homepage