'use client'
import { useParams } from 'next/navigation';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import axios from 'axios';
 
const features = {
    people: ["name", "skin_color", "height", "gender"]
  };
const page = () => {
  const {id} = useParams();
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  
  const handleSearchResource = async (e) => {
    try {
        const response = await axios.get(` https://swapi.dev/api/people/${id}`);
        const result = await response.data;
        result.resource = "people";  
        const planetResponse = await axios.get(result.homeworld);
        const planetResult = await planetResponse.data;
        result.homeworld =planetResult.name;
        console.log(result);
        setData(result);
        setError(false);
    } catch (error) {
        console.log(error);
        setData({});
        setError(true);
    }
  };
  useEffect(() => {
    handleSearchResource();
  }, []);

  return (
    <div>
      <div>
        {Object.keys(data).length > 0
          ? features[data.resource].map((item, index) => {
              return (
                <h1 key={index} style={{ margin: 0 }}>
                  {item.toUpperCase()}: {data[item]}
                </h1>
              );
            })
          : null}
        {error && (
          <Fragment>
            <h1>Estos no son los droides que estas buscando</h1>
            <img
              src="https://upload.wikimedia.org/wikipedia/en/c/c5/Obiwan1.jpg"
              alt="obi"
            />
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default page
