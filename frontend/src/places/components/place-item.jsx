import React, { useState, useContext } from 'react';
import Card from 'shared/components/ui-elements/card';
import Button from 'shared/components/form-elements/button';
import Modal from 'shared/components/ui-elements/modal';
import Map from 'shared/components/ui-elements/map';
import LoadingSpinner from 'shared/components/ui-elements/loading-spinner';
import ErrorModal from 'shared/components/ui-elements/error-modal';
import { AuthContext } from 'shared/context/auth-context';
import { useHttpClient } from 'shared/hooks/http-hook';
import { endpoints } from 'shared/util/constants';
import './place-item.scss';

const PlaceItem = ({
  id,
  image,
  title,
  address,
  description,
  coordinates,
  creatorId,
  onDelete,
}) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const toggleDeleteWarningHandler = () => {
    setShowConfirmModal((prevValue) => !prevValue);
  };

  const confirmDeleteHandler = async () => {
    //toogle off delete warning
    toggleDeleteWarningHandler();

    try {
      await sendRequest(`${endpoints.placeById}${id}`, 'DELETE', null, {}, auth.token);
      //call onDelete prop
      onDelete(id);
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={coordinates} zoom={16} />}
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={toggleDeleteWarningHandler}>
              Cancel
            </Button>
            <Button danager onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this place?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={image} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === creatorId && <Button to={`/places/${id}`}>EDIT</Button>}
            {auth.userId === creatorId && (
              <Button danger onClick={toggleDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
