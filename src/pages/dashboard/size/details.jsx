import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SizeDetailsView } from 'src/sections/dashboard/size/view';
import { fetchSizes } from 'src/store/slices/sizeSlice';

// ----------------------------------------------------------------------

export const metadata = { name: 'Size Details' };

export default function Page() {
  const params = useParams();
  const dispatch = useDispatch();
  const { sizes, loading } = useSelector((state) => state.sizes);

  useEffect(() => {
    dispatch(fetchSizes());
  }, [dispatch]);

  const size = sizes.find((s) => s.id === params.id);

  return <SizeDetailsView size={size} loading={loading} error={!size && !loading} />;
}

