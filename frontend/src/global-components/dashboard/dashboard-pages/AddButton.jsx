import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { Plus } from 'lucide-react';
import React from 'react';


export const AddButton = ({ message, path }) => {
  return (
    <Link to={path}>
      <Button color="indigo" className="flex-shrink-0 ml-4 ">
        <Plus className="mr-2 h-4 w-4 flex-shrink-0 xs:hidden" />
        Add a {message}
      </Button>
    </Link>
  );
};
