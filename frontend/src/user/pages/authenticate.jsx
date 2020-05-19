import React, { useState, useContext } from 'react';
import { useForm } from 'shared/hooks/form-hook';
import { useHttpClient } from 'shared/hooks/http-hook';
import Input from 'shared/components/form-elements/input';
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from 'shared/util/validators';
import Button from 'shared/components/form-elements/button';
import ImageUpload from 'shared/components/form-elements/image-upload';
import Card from 'shared/components/ui-elements/card';
import { AuthContext } from 'shared/context/auth-context';
import ErrorModal from 'shared/components/ui-elements/error-modal';
import LoadingSpinner from 'shared/components/ui-elements/loading-spinner';
import { endpoints } from 'shared/util/constants';
import './authenticate.scss';

const Authenticate = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //set initial inputs for signup mode
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false //overall form validity
  );

  const authSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          endpoints.login,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          })
        );

        auth.login(
          responseData.user.id,
          responseData.user.token.value,
          responseData.user.token.expiration
        );
      } catch (err) {
        //empty catch since http hook throws an erro
      }
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        const responseData = await sendRequest(endpoints.signup, 'POST', formData, {});

        auth.login(
          responseData.user.id,
          responseData.user.token.value,
          responseData.user.token.expiration
        );
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    //if current mode is not login, prepare to be switched to login mode
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined, //name and image not needed in login mode
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      //will be switching from login mode => signup mode
      //adding name back in
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }

    setIsLoginMode((prevMode) => !prevMode);

    //multiple synchronous state changes in same code block immediately after each other will result in React batching them all into one update/re-render :)
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name"
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
          <Input
            id={'email'}
            element="input"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            id={'password'}
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password (at least 6 characters)."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button onClick={switchModeHandler} inverse>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Authenticate;
