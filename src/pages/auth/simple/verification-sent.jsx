import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SimpleVerificationSentView } from 'src/sections/auth/simple';

// ----------------------------------------------------------------------

const metadata = { title: `Verification Email Sent | ${CONFIG.site.name}` };

export default function VerificationSentPage() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <SimpleVerificationSentView />
    </>
  );
}

