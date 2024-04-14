import { Facebook, Instagram } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaXTwitter } from "react-icons/fa6";

export const Footer = () => {
  return (
    <div className=''>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t space-y-8 sm:space-y-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full px-8">
          <div>
            {/* TODO: Fetch the locations */}
            <h3 className="text-lg font-bold">Locations</h3>
            <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
              <li>New York, USA</li>
              <li>London, UK</li>
              <li>Sydney, Australia</li>
            </ul>
          </div>
          <div>
            {/* TODO: Fetch this data */}
            <h3 className="text-lg font-bold">Contact Us</h3>
            <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
              <li>Email: info@orderingsystem.com</li>
              <li>Phone: +1 (123) 456-7890</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Order Now</h3>
            <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
              <li>
                <NavLink className="hover:underline underline-offset-4" href="#">
                  Online
                </NavLink>
              </li>
              <li>
                <NavLink className="hover:underline underline-offset-4" href="#">
                  App Store
                </NavLink>
              </li>
            </ul>
          </div>
          <div className='flex flex-col items-center '>
            {/* TODO: Change the links */}

            <h3 className="text-lg font-bold">Follow Us</h3>
            <ul className="flex space-x-4 text-xs text-zinc-500 dark:text-zinc-400">
              <li>
                <NavLink href="#">
                  <Facebook className=" w-5 h-5 text-blue-500" />
                </NavLink>
              </li>
              <li>
                <NavLink href="#">
                  <FaXTwitter className='w-5 h-5 text-gray-800' />
                </NavLink>
              </li>
              <li>
                <NavLink href="#">
                  <Instagram className=" w-5 h-5 text-pink-500" />
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
