import { useState, useEffect } from 'react';
import { communityService } from 'src/services/community.service';

export function useGetCommunity(communityId) {
  const [community, setCommunity] = useState(null);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityError, setCommunityError] = useState(null);

  useEffect(() => {
    if (!communityId) {
      setCommunityLoading(false);
      return;
    }

    const fetchCommunity = async () => {
      try {
        setCommunityLoading(true);
        setCommunityError(null);
        const data = await communityService.getCommunityById(communityId);
        setCommunity(data);
      } catch (error) {
        setCommunityError(error?.message || 'Failed to fetch community');
        setCommunity(null);
      } finally {
        setCommunityLoading(false);
      }
    };

    fetchCommunity();
  }, [communityId]);

  return { community, communityLoading, communityError };
}

