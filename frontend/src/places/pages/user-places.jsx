import React, { useEffect, useState } from 'react';
import PlaceList from 'places/components/place-list';
import { useParams } from 'react-router-dom';
import ErrorModal from 'shared/components/ui-elements/error-modal';
import LoadingSpinner from 'shared/components/ui-elements/loading-spinner';
import { useHttpClient } from 'shared/hooks/http-hook';
import { endpoints } from 'shared/util/constants';

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();

  const { userId } = useParams();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`${endpoints.userPlaces}${userId}`);
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    //alternatively, refetch places from an api
    setLoadedPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== deletedPlaceId));
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
