import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';
import { getCookie } from 'src/utils/cookie';
import { addressService } from 'src/services/address.service';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
    addresses: [],
    addressesLoading: false,
  });

  // Fetch addresses for logged-in user
  const fetchUserAddresses = useCallback(async (userId) => {
    if (!userId) {
      setState({ addresses: [], addressesLoading: false });
      return;
    }

    try {
      setState({ addressesLoading: true });
      const addresses = await addressService.getAllAddresses(null);
      setState({ addresses: addresses || [], addressesLoading: false });
    } catch (error) {
      setState({ addresses: [], addressesLoading: false });
    }
  }, [setState]);

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY) || getCookie('access-token');

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const userStr = sessionStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            setState({ user: { ...user, accessToken }, loading: false });

            // Fetch addresses after user is set
            if (user?._id || user?.id) {
              await fetchUserAddresses(user._id || user.id);
            }
          } catch (parseError) {
            setState({ user: null, loading: false, addresses: [] });
          }
        } else {
          setState({ user: null, loading: false, addresses: [] });
        }
      } else {
        setState({ user: null, loading: false, addresses: [] });
      }
    } catch (error) {
      setState({ user: null, loading: false, addresses: [] });
    }
  }, [setState, fetchUserAddresses]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      addresses: state.addresses || [],
      addressesLoading: state.addressesLoading || false,
      fetchUserAddresses,
    }),
    [checkUserSession, state.user, status, state.addresses, state.addressesLoading, fetchUserAddresses]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
