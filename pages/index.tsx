// Import necessary hooks and types from React and Next.js
import React, { useState, useEffect, FC } from 'react';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  // Texts you want to animate
  const texts: string[] = ["joy", "peace", "support", "love", "hope", "life", "freedom", "courage", "inspiration"];

  // State to manage current text, an index for the text array, and whether the text is being typed or deleted
  const [currentText, setCurrentText] = useState<string>('');
  const [arrayIndex, setArrayIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    // Timer to manage the speed of typing/deleting
    let timer: ReturnType<typeof setTimeout>;

    // Function to update text
    const handleTyping = () => {
      const currentIndex: number = arrayIndex % texts.length;  // Loop through text array
      const fullText: string = texts[currentIndex];  // Current full text to display

      // Update the currentText to type or delete characters
      setCurrentText(currentText => isDeleting ?
        fullText.substring(0, currentText.length - 1) :
        fullText.substring(0, currentText.length + 1));

      // If deleting, go a bit faster
      const typingSpeed: number = isDeleting ? 120 : 200;

      if (!isDeleting && currentText === fullText) {
        // If the full text is displayed, start deleting after a pause
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1000);
      } else if (isDeleting && currentText === '') {
        // If text has been fully deleted, switch to the next text and start typing
        setIsDeleting(false);
        setArrayIndex(arrayIndex + 1);
      } else {
        // Continue typing/deleting
        timer = setTimeout(handleTyping, typingSpeed);
      }
    };

    // Start the typing effect
    timer = setTimeout(handleTyping, 500);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [currentText, arrayIndex, isDeleting, texts]);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeSection}>
        <h1 className={styles.mainText}>giv3 {currentText}</h1>
      </div>
      <div className={styles.homeSection}>
        <h2>this is section 2</h2>
      </div>
      <div className={styles.homeSection}>
        <h2>this is section 3</h2>
      </div>
    </div>
  );
}

export default Home;