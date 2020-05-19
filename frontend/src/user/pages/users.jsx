import React, { useEffect, useState } from 'react';
import UsersList from '../components/users-list';
import ErrorModal from 'shared/components/ui-elements/error-modal';
import LoadingSpinner from 'shared/components/ui-elements/loading-spinner';
import { useHttpClient } from 'shared/hooks/http-hook';
import { endpoints } from 'shared/util/constants';

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //do not use async with useEffect since async will return an implicit promise
  useEffect(() => {
    //workaround - create async method inside
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(endpoints.users);
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };

    fetchUsers();
  }, [sendRequest]); //sendRequest is wrapped in useCallback in the hook to prevent an infinite loop

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
