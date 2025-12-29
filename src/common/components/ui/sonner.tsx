import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner position="top-right" duration={1400} className="toaster group" {...props} />;
};

export { Toaster };
