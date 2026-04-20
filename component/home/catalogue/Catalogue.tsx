import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import catalogue from "@/public/catalogue.png";


const Catalogue = () => {
  return (
    <Stack sx={{width: '100%', aspectRatio: '16 / 9', position: 'relative'}}>
     <Image src={catalogue} alt="catalogue" fill style={{ objectFit: 'fill' }} />
    </Stack>
  );
};

export default Catalogue;