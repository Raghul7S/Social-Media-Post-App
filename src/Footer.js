import React from 'react'

const Footer = () => {
   const date = new Date();
  return (
    <footer>
      <p className='Footer'>Copy &copy; {date.getFullYear()} </p>
    </footer>
  )
}

export default Footer