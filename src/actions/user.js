import { useState, useEffect, useMemo } from 'react';
import { userService } from 'src/services/user.service';

// ----------------------------------------------------------------------

export function useGetUser(userId) {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setUserLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setUserLoading(true);
        setUserError(null);
        const userData = await userService.getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUserError(error);
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return useMemo(
    () => ({
      user,
      userLoading,
      userError,
      userValidating: false,
    }),
    [user, userLoading, userError]
  );
}

