import React from 'react';
import { Button } from 'flowbite-react';
import { Label, TextInput, Textarea } from 'flowbite-react';
import { NavLink } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";

export const ContactsPage = () => {
  // TODO: Implement the ContactsPage component
  return (<div className='px-16 py-8 flex flex-col justify-center items-center'>
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Contact Us</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          We're here to help and answer any question you might have.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4 border-spacing-4  px-4 ">
          <h3 className="text-xl font-semibold">Reach out to us</h3>
          <div className="space-y-2">
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your Email" />
            </div>
            <TextInput id="email-contact" placeholder="Enter your email" type="email" />
          </div>
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Your message" />
            </div>
            <Textarea id="comment" placeholder="Leave a comment..." required rows={4} />
          </div>
          <button className='flex flex-col justify-center bg-red-600 px-4 py-2 rounded-lg hover:bg-red-800 text-white '>Send message</button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Our Information</h3>
          <p>Email: info@ordersystem.com</p>
          <p>Phone: +1 (123) 456-7890</p>
          <p>Branch Locations: New York, Los Angeles, Chicago</p>
          <div className="flex space-x-4">
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
      </div>
    </section></div>);
}

