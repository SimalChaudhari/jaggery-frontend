import Box from '@mui/material/Box';

import { _mapContact } from 'src/_mock';

import { DashboardContent } from 'src/layouts/dashboard';

// import { ContactMap } from '../contact-map';
// import { ContactHero } from '../contact-hero';
import { ContactForm } from '../contact-form';

// ----------------------------------------------------------------------

export function ContactView() {
  return (
    <>
      {/* <ContactHero /> */}

      <DashboardContent sx={{ py: 10 }}>
        <ContactForm />
      </DashboardContent>
    </>
  );
}
