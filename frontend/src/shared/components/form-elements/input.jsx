import React, { useReducer, useEffect } from 'react';
import { validate } from 'shared/util/validators';
import './input.scss';

//use a reducer hook when managing complex state
const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE': {
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      };
    }
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = (props) => {
  //be mindful that useReducer is not recreated with every render - runs only once
  //therefore changes to props.initialValue and props.initialValid will not cause useReducer to rerun
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  //useEffect hook - call onInput prop if any of the dependencies change
  useEffect(() => {
    onInput(id, value, isValid);
  }, [onInput, id, value, isValid]);

  const changeHandler = (e) => {
    dispatch({
      type: 'CHANGE',
      value: e.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
    });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={touchHandler}
        rows={props.rows || 3}
      />
    );

  return (
    <div
      className={`form-control ${
        inputState.isTouched && !inputState.isValid && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {inputState.isTouched && !inputState.isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
