import React from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

const DialogComponent = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <Dialog
        open={isOpen}
        onClose={onClose}
        size={"lg"}
        handler={onClose}
        className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[80vw] flex flex-col content-center align-middle justify-center ml-[10vw]'
      >
        <DialogHeader>{title}</DialogHeader>
        <DialogBody>
          { children }
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => onClose()}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => onClose()}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    );
};

export default DialogComponent;