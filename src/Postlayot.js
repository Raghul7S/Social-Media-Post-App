import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Postlayot = () => {
  return (
    <div>
      <Link to="/postpage/1">Post1</Link><br />
      <Link to="/postpage/2">Post2</Link><br />
      <Link to="/postpage/3">Post3</Link><br />
      <Link to="/postpage/newpost">New post</Link>
      <Outlet />{/*Used to show the other components.*/}
    </div>
  )
}

export default Postlayot