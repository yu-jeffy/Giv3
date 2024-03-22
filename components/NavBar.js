import React from 'react';
import Link from 'next/link';
import styles from '../styles/NavBar.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <Link href="/">
          <h1 className={styles.navbarTitle}>giv3</h1>
        </Link> 
        {/* Insert your logo below */}
        {/*<img src="/path-to-your-logo.png" alt="Logo" />*/}
      </div>
      <div className = {styles.right}>
        <div className={styles.navbarLinkContainer}>
          <Link className={styles.navbarLink} href="/">Home</Link>
          <Link className={styles.navbarLink} href="/about">About</Link>
          <Link className={styles.navbarLink} href="/campaigns">Campaigns</Link>
          <Link className={styles.navbarLink} href="/create">Create</Link>
        </div>
        <div className={styles.navbarConnect}>
          <ConnectButton className={styles.navbarConnect}/>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;