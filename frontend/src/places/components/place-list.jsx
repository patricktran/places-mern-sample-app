import React from 'react';
import Card from 'shared/components/ui-elements/card';
import Button from 'shared/components/form-elements/button';
import PlaceItem from './place-item';
import './place-list.scss';

const PlaceList = ({ items, onDeletePlace }) => {
  if (items.length === 0)
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );

  return (
    <ul className="place-list">
      {items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          address={place.address}
          description={place.description}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
