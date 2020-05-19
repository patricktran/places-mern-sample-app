import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from 'shared/context/auth-context';
import { useForm } from 'shared/hooks/form-hook';
import { useParams, useHistory } from 'react-router-dom';
import Input from 'shared/components/form-elements/input';
import Button from 'shared/components/form-elements/button';
import Card from 'shared/components/ui-elements/card';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from 'shared/util/validators';
import { useHttpClient } from 'shared/hooks/http-hook';
import { endpoints } from 'shared/util/constants';
import LoadingSpinner from 'shared/components/ui-elements/loading-spinner';
import ErrorModal from 'shared/components/ui-elements/error-modal';
import './place-form.scss';

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();

  const { placeId } = useParams();
  const history = useHistory();

  //Hook rule - react hooks must be directly under functional component declaration and should never appear inside conditionals
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`${endpoints.placeById}${placeId}`);

        setLoadedPlace(responseData.place);

        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchPlace();
  }, [placeId, sendRequest, setFormData]);

  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      await sendRequest(
        `${endpoints.placeById}${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {},
        auth.token
      );

      history.push(`/${auth.userId}/places`);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  //defer rendering until we know we have values loaded
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialValid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default UpdatePlace;
