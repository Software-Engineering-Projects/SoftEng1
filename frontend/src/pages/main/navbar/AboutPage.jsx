
import React from 'react';
import { Avatar, Blockquote, Rating } from 'flowbite-react';

import { Button, Timeline } from 'flowbite-react';
import { HiArrowNarrowRight } from 'react-icons/hi';
export const AboutPage = () => {
  return (
    <div className='flex flex-col items-center justify-center'> <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-16">
          <div className="container px-4 md:px-6">
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Us</h1>
              <p className="max-w-[700px] mx-auto text-zinc-500 md:text-xl dark:text-zinc-400">
                Ullamco cillum ut ullamco cupidatat reprehenderit mollit exercitation eiusmod sint aute ea consequat qui nostrud. Et pariatur fugiat irure nostrud amet non fugiat consectetur esse. Consectetur ea reprehenderit ex commodo. Et labore tempor consectetur excepteur amet veniam id ex velit culpa pariatur nostrud. Incididunt dolor aliquip pariatur ea dolor consequat incididunt id. Minim magna esse nulla et tempor ex non eu sint occaecat ex. Laboris qui officia pariatur eu commodo exercitation sunt dolor culpa consectetur sunt.
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-16 lg:py-20 dark:bg-zinc-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Mission</h2>
                <p className="text-zinc-500 md:text-xl dark:text-zinc-400">
                  Do nulla veniam laboris nostrud occaecat veniam officia esse eiusmod excepteur. Proident ipsum ullamco cupidatat ex laboris irure id nisi. Deserunt Lorem pariatur id id laborum aliqua do.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Vision</h2>
                <p className="text-zinc-500 md:text-xl dark:text-zinc-400">
                  Laborum incididunt consequat occaecat duis incididunt veniam esse. Exercitation pariatur veniam excepteur non magna labore. Ex commodo magna commodo Lorem adipisicing ipsum labore exercitation consequat qui qui. Irure qui elit nostrud id elit ut fugiat dolor proident ad ullamco quis.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-5xl font-bold tracking-tighter  text-center">Reviews</h2>
            <div className="grid gap-10 sm:gap-16 lg:grid-cols-3 mt-8">
              <blockquote className="text-lg font-semibold leading-snug lg:text-xl lg:leading-normal xl:text-2xl">
                "Aute ipsum deserunt velit id nulla aliquip aliqua irure."
                <Rating size="md">
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                </Rating>
                <cite className="block mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  - Jules Winnfield, CEO, Acme Inc
                </cite>
              </blockquote>
              <blockquote className="text-lg font-semibold leading-snug lg:text-xl lg:leading-normal xl:text-2xl">
                "Velit cillum esse exercitation ipsum est veniam labore."
                <cite className="block mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Rating size="md">
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star />
                  </Rating>
                  - Mia Wallace, Manager, Vega Brothers
                </cite>
              </blockquote>
              <blockquote className="text-lg font-semibold leading-snug lg:text-xl lg:leading-normal xl:text-2xl">
                "Laboris esse adipisicing amet nulla officia consectetur pariatur amet culpa ea cillum ullamco."
                <cite className="block mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Rating size="md">
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star />

                  </Rating>
                  - Vincent Vega, Owner, Big Kahuna Burger
                </cite>
              </blockquote>
            </div>
          </div>
        </section>
        <section className="w-full py-16 bg-zinc-100 dark:bg-zinc-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-5xl font-bold tracking-tighter text-center">Our Journey</h2>

            <Timeline>
              <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>February 2022</Timeline.Time>
                  <Timeline.Title>Pariatur enim voluptate cillum cillum do aliquip sit.</Timeline.Title>
                  <Timeline.Body>
                    Ex nostrud aliquip dolor nulla sunt deserunt. Cillum cupidatat ex culpa aliqua ad duis in cupidatat esse adipisicing. Do excepteur irure duis ex occaecat id ipsum elit mollit amet voluptate ut.
                  </Timeline.Body>
                  <Button color="gray">
                    Learn More
                    <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </Timeline.Content>
              </Timeline.Item>
              <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>March 2022</Timeline.Time>
                  <Timeline.Title>Anim qui eiusmod occaecat proident incididunt laborum minim amet.</Timeline.Title>
                  <Timeline.Body>
                    Fugiat veniam eu elit id veniam duis eu irure do adipisicing Lorem. Fugiat laborum qui cillum adipisicing magna ex eiusmod laboris dolor dolore. Commodo velit non in minim consequat reprehenderit eu nisi irure. Nulla eu velit anim tempor consequat.
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
              <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>April 2022</Timeline.Time>
                  <Timeline.Title>Occaecat velit ad ipsum non.</Timeline.Title>
                  <Timeline.Body>
                    Velit excepteur qui nisi incididunt exercitation consequat proident ex sit. Magna incididunt est culpa nulla ipsum minim velit consectetur ad. Ut amet et voluptate minim aute officia sit do et. Ea nulla incididunt ex consectetur elit deserunt adipisicing nostrud mollit.
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            </Timeline>
          </div>
        </section>
      </main>
    </div>
    </div>
  );
}

