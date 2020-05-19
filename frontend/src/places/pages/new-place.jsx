import React, { useContext } from 'react';
import { AuthContext } from 'shared/context/auth-context';
import { useHistory } from 'react-router-dom';
import { useForm } from 'shared/hooks/form-hook';
import Input from 'shared/components/form-elements/input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from 'shared/util/validators';
import Button from 'shared/components/form-elements/button';
import ErrorModal from 'shared/components/ui-elements/error-modal';
import LoadingSpinner from 'shared/components/ui-elements/loading-spinner';
import ImageUpload from 'shared/components/form-elements/image-upload';
import { useHttpClient } from 'shared/hooks/http-hook';
import { endpoints } from 'shared/util/constants';
import './place-form.scss';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
      placeImage: {
        value: null,
        isValid: false,
      },
    },
    false //overall form validity
  );

  const placeSubmitHandler = async (e) => {
    e.preventDefault(); //prevent default browser behavior that will cause a page refresh

    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.placeImage.value);

      await sendRequest(endpoints.createPlace, 'POST', formData, {}, auth.token);

      history.push('/');
    } catch (err) {
      //error state already set inside http hook
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input
          id={'title'}
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id={'description'}
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id={'address'}
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload
          id="placeImage"
          center
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
