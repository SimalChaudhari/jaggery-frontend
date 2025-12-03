import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetProduct } from 'src/actions/product';

import { ProductShopDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product details - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { product, loading, error } = useGetProduct(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductShopDetailsView product={product} loading={loading} error={error} />
    </>
  );
}
