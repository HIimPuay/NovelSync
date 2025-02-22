import { useState } from 'react';
import '../components/styles/homepage.css';
import { CirclePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className='homepage'>
      <h1>Your project</h1>
      <Link to="/Edit">
        <div className='item'>
          <CirclePlus color='black' size={28}/>
        </div>
      </Link>

      <h1>นิยาย</h1>
      <div className='container'>
        {[...Array(9)].map((_, index) => (
          <div key={index} className='item'></div>
        ))}
      </div>
    </div>
  );
}

export default Homepage;
