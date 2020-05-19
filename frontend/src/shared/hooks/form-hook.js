import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE': {
      let formIsValid = true;

      //need to loop thru to determine overall validity
      for (const inputId in state.inputs) {
        //is inputId undefined?
        if (!state.inputs[inputId]) continue;

        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsValid,
      };
    }
    case 'SET_DATA': {
      return {
        ...state,
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    }
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity, //overall form validity
  });

  //use callback to avoid potential infinite loops since Input component calls `inputHandler` in a useEffect hook
  const inputHandler = useCallback(
    (id, value, isValid) => {
      dispatch({
        type: 'INPUT_CHANGE',
        inputId: id,
        value,
        isValid,
      });
    },
    [] //not necessary to add dispatch as a dependency because React makes sure it's always the same reference
  );

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []); //no dependencies, so function should never be created

  return [formState, inputHandler, setFormData];
};
