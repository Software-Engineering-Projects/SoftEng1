import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

const accordionData = [
  {
    header: "Consectetur aliquip anim sunt aliqua sint ullamco excepteur cupidatat velit pariatur officia culpa minim.",
    body: "Commodo do amet incididunt exercitation cupidatat dolor sit dolore. Mollit duis deserunt velit irure irure ad do nulla sint. Enim irure nulla id occaecat aliquip aute."
  },
  {
    header: "Pariatur id et pariatur officia consequat magna est veniam reprehenderit pariatur eu anim.",
    body: "Sit nulla officia elit in duis elit culpa laboris laborum. Esse ex occaecat consequat nostrud irure nostrud voluptate adipisicing. Laborum commodo ea ad minim. Nulla officia mollit labore tempor minim. Magna dolore Lorem non mollit nisi dolore anim. Qui aute qui Lorem tempor cupidatat consectetur esse fugiat ut ullamco ex mollit. Sunt ad duis eu elit dolor anim do incididunt fugiat sint velit tempor."
  },
  {
    header: "Eiusmod irure consectetur labore qui.",
    body: "Ad id anim excepteur aliqua nulla aliquip. Sint consectetur elit pariatur sint reprehenderit aute sunt eiusmod excepteur ipsum occaecat est pariatur. Nostrud irure irure magna esse magna dolore."
  }
];

export const FAQPage = () => {
  const [open, setOpen] = React.useState(1);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <span className="font-semibold text-4xl pt-12">Frequently Asked Question</span>
      <div className="px-16 py-16">
        {accordionData.map((item, index) => (
          <Accordion key={index} open={open === index + 1} className="mb-2 rounded-lg border border-gray-700 px-4">
            <AccordionHeader
              onClick={() => handleOpen(index + 1)}
              className={`border-b-0 transition-colors ${open === index + 1 ? "text-blue-700 hover:!text-blue-900" : ""
                }`}
            >
              {item.header}
            </AccordionHeader>
            <AccordionBody className="pt-0 text-base font-normal">
              {item.body}
            </AccordionBody>
          </Accordion>
        ))}
      </div>
    </>
  );
}
