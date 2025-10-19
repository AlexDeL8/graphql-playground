import './App.css';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from 'react';

const GET_VIDEO_GAMES = gql`
query GetVideoGames {
  getVideoGames {
    id
    title
    price
  }
}
`;

const GET_VIDEO_GAME_BY_ID = gql`
query GetVideoGameById($id: ID!) {
  getVideoGameById(id: $id) {
    title
    releaseYear
    isOnPc
  }
}
`;

const CREATE_VIDEO_GAME = gql`
mutation CreateVideoGame($title: String!, $price: Float!, $releaseYear: Int!, $isOnPc: Boolean = false) {
  createVideoGame(title: $title, price: $price, releaseYear: $releaseYear, isOnPc: $isOnPc) {
    id
    title
  }
}
`;

function App() {
  /** STATE **/
  const [formData, setFormData] = useState({
    title: "",
    price: 0.00,
    releaseYear: 1900,
    isOnPc: false
  })

  /** QUERIES **/
  const {
    data: getVideoGamesData,
    error: getVideoGamesError,
    loading: getVideoGamesLoading,
  } = useQuery(GET_VIDEO_GAMES)

  const {
    data: getVideoGameByIdData,
    error: getVideoGameByIdError,
    loading: getVideoGameByIdLoading,
  } = useQuery(GET_VIDEO_GAME_BY_ID, {
    variables: { "id": "4" }
  });

  /** MUTATIONS **/
  const [createVideoGame] = useMutation(CREATE_VIDEO_GAME)

  /** FUNCTIONS **/
  const handleCreateVideoGame = async () => {
    console.log(formData)
    createVideoGame({
      variables: {
        title: formData.title,
        price: parseFloat(formData.price.toString()),
        releaseYear: Number(formData.releaseYear),
        isOnPc: formData.isOnPc
      }
    });
    setFormData({
      title: "",
      price: 0.00,
      releaseYear: 1900,
      isOnPc: false
    })
  }

  const handleChange = (e) => {
    const {name, value, checked} = e.target
    if (name === 'isOnPc') {
      setFormData({
        ...formData,
        [name]: checked
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  if(getVideoGamesLoading || getVideoGameByIdLoading) {
    return (
      <p>Please wait...</p>
    )
  }
  if(getVideoGamesError || getVideoGameByIdError) {
    return (
      <>
        <p>ERROR - ${getVideoGamesError.message || getVideoGameByIdError}</p>
        <p>{getVideoGamesError.stack || getVideoGameByIdError?.stack}</p>
      </>
    )
  }

  return (
    <>
      <h1>Video Games:</h1>
      <ul>
        {getVideoGamesData.getVideoGames.map((videoGame) => (
          <li key={videoGame.id}>
            {videoGame.title} - {videoGame.price === 0 ? "Free" : videoGame.price}
          </li>
        ))}
      </ul>
      <h1>Video Games By ID:</h1>
      <ul>
        <li key={getVideoGameByIdData.getVideoGameById.id}>
          The game is - {getVideoGameByIdData.getVideoGameById.title}, released in {getVideoGameByIdData.getVideoGameById.releaseYear} and is {getVideoGameByIdData.getVideoGameById.isOnPc ? "Is on PC" : "Is only on consoles"}
        </li>
      </ul>
      <h1>Create a new Video Game:</h1>
        <div>
          <label htmlFor='title'>Title: </label>
          <input type='text' placeholder='Game title...' name='title' value={formData.title} onChange={handleChange}/>
        </div>
        <div>
          <label htmlFor='price'>Price: </label>
          <input type='number' min="0" placeholder='i.e. 69.99' name='price' value={formData.price} onChange={handleChange}/>
        </div>
        <div>
          <label htmlFor='releaseYear'>Release Year: </label>
          <input type='number' min="1900" max="2025" placeholder='i.e. 2023' name='releaseYear' value={formData.releaseYear} onChange={handleChange}/>
        </div>
        <div>
          <input type='checkbox' name='isOnPc' onChange={handleChange}/>
          <label htmlFor='isOnPc'>Is On PC?</label>
        </div>
        <button onClick={() => handleCreateVideoGame()}>Add Game</button>
    </>
  )
}

export default App
