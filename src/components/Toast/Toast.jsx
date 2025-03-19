'use client';
import React from "react";
import './toastStyles.css';
import { ToastContext } from "../ToastProvider";

import { Box, Button, Callout, Flex, Text } from "@radix-ui/themes";
import { TriangleAlert, CircleCheckBig, OctagonX, X, Info } from "lucide-react";

const COSMETICS_BY_VARIANT = {
  notice: {
    icon: Info,
    color: 'indigo',
  },
  warning: {
    icon: TriangleAlert,
    color: 'yellow',
  },
  success: {
    icon: CircleCheckBig,
    color: 'teal',
  },
  error: {
    icon: OctagonX,
    color: 'red',
  },
}

export default function ToastShelf(){
  const { toasts } = React.useContext(ToastContext);

  return (
    <>
      <Box asChild>
        <ol className="wrapper" role="region" aria-live="polite" aria-label="Notification">
          {
            toasts.map((toast, index) => (
              <li 
                className="toastWrapper"
                key={`${index}-${toast.variant}-${index}-${toast.message}-${index}`} 
              >
                <Toast toast={toast} />
              </li>
            ))
          }
        </ol>
      </Box>
    </>
  );
}

function Toast({ toast }){
  const { dismissToast, duration } = React.useContext(ToastContext);
  const Icon = COSMETICS_BY_VARIANT[toast.variant]['icon'];
  const color = COSMETICS_BY_VARIANT[toast.variant]['color'];
  const toastRef = React.useRef(null);

  React.useEffect(() => {
    const toast = toastRef.current;
    const timeoutId = setTimeout(() => {
      toast.remove();
    }, duration);

    return () => {
      clearTimeout(timeoutId);
    }
  }, []);
  
  return (
    <Callout.Root ref={toastRef} className={`toastRoot ${toast.variant}`} color={color} variant='outline'>
      <Callout.Icon className="toastIcon">
        <Icon />
      </Callout.Icon>
      <Flex align={'center'} direction={'row'} gapX={'4'} justify={'between'} width={'100%'}>
        <Text size={'3'} asChild weight={'regular'}>
          <Callout.Text>
            { toast.message }
          </Callout.Text>
        </Text>
        <Button onClick={dismissToast} size={'1'} className="toastBtn" variant='ghost' aria-label='Dismiss message' aria-live='off'>
          <X />
        </Button>
      </Flex>
    </Callout.Root>
  );
}