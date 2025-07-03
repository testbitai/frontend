
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted pt-12 pb-8 text-center md:text-left">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-brandPurple mb-4">TestBit</h3>
            <p className="text-muted-forground mb-4">Your trusted platform for JEE, BITSAT, and competitive exam preparation.</p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-forground hover:text-brandPurple">Home</Link></li>
              <li><Link to="/tests" className="text-muted-forground hover:text-brandPurple">Test Series</Link></li>
              <li><Link to="/dashboard" className="text-muted-forground hover:text-brandPurple">Dashboard</Link></li>
              <li><Link to="/rewards" className="text-muted-forground hover:text-brandPurple">Rewards</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-forground hover:text-brandPurple">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-forground hover:text-brandPurple">Contact</Link></li>
              <li><a href="#" className="text-muted-forground hover:text-brandPurple">Blog</a></li>
              <li><a href="#" className="text-muted-forground hover:text-brandPurple">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Connect With Us</h4>
            <div className='space-y-2'>

            
            <a href="mailto:support@testbit.in" className="text-muted-forground hover:text-brandPurple">support@testbit.in</a>
            <p className="text-muted-forground hover:text-brandPurple">+91 123 456 7890</p>
            <p className="text-muted-forground hover:text-brandPurple">Bhubaneswar, Odisha</p>
            <div className="flex space-x-4 mb-4 justify-center md:justify-start">
              <a href="#" className="text-muted-forground hover:text-brandPurple">Instagram</a>
              <a href="#" className="text-muted-forground hover:text-brandPurple">Twitter</a>
              <a href="#" className="text-muted-forground hover:text-brandPurple">YouTube</a>
            </div>

            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TestBit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
