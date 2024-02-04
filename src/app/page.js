"use client";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import React, { Fragment } from "react";

const features = {
  people: ["name", "skin_color", "height", "gender"],
  films: ["title", "director", "created", "created"],
  starships: ["name", "consumables", "created"],
  vehicles: ["name", "model", "consumables", "max_atmosphering_speed"],
  species: ["name", "language", "hair_colors", "designation"],
  planets: ["diameter", "created", "climate", "gravity"],
};
export default function Home() {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(false);

  const getResources = async () => {
    try {
      const { data } = await axios.get("https://swapi.dev/api/");
      const resourceOptions = Object.entries(data).map(([label, url]) => ({
        label,
        url,
      }));
      console.log(resourceOptions);
      setResources(resourceOptions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getResources();
  }, []);

  const handleSearchResource = async (e) => {
    e.preventDefault();
    console.log(selectedId, selectedResource);

    try {
      const response = await axios.get(`${selectedResource}${selectedId}`);
      const result = await response.data;
      result.resource = selectedResource.split("/").at(-2);

      if (result.resource === "people") {
        const planetResponse = await axios.get(result.homeworld);
        const planetResult = await planetResponse.data;
        result.homeworld = planetResult.name;
      }
      console.log(result);
      setData(result);
      setError(false);
    } catch (error) {
      console.log(error);
      setData({});
      setError(true);
    }
  };

  return (
    <header>
      <form onSubmit={handleSearchResource}>
        <label>Buscar por:</label>
        <select
          name="opciones"
          id="opcion"
          value={selectedResource}
          onChange={(e) => setSelectedResource(e.target.value)}
        >
          <option value="" disabled>
            Opciones
          </option>
          {resources.map((item, index) => {
            return (
              <option key={index} value={item.url}>
                {item.label.toUpperCase()}
              </option>
            );
          })}
        </select>
        <input
          type="number"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        ></input>
        <button type="submit">Buscar</button>
      </form>
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
    </header>
  );
}
