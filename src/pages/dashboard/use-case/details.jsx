import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UseCaseDetailsView } from 'src/sections/dashboard/use-case/view';
import { fetchUseCases } from 'src/store/slices/useCaseSlice';

// ----------------------------------------------------------------------

export const metadata = { name: 'Use Case Details' };

export default function Page() {
  const params = useParams();
  const dispatch = useDispatch();
  const { useCases, loading } = useSelector((state) => state.useCases);

  useEffect(() => {
    dispatch(fetchUseCases());
  }, [dispatch]);

  const useCase = useCases.find((uc) => uc.id === params.id);

  return <UseCaseDetailsView useCase={useCase} loading={loading} error={!useCase && !loading} />;
}

