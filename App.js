import './App.css';
import React from 'react';
import axios from "axios";
import {nanoid} from "nanoid"
const BASE_URL = "http://localhost:8080/api/cards"//<-- my BASE URL is api/cards so any request endpoints have to build upon this.
const randomCardURL = BASE_URL + "/random"

function App() {
  const [savedCards, setSavedCards] = React.useState([]) //<-- for our collection
  const [catCard, setCatCard] = React.useState({}); //<-- for displaying main catFact and img
  const [isEditing, setIsEditing] = React.useState(false) //<-- for editing a saved photo

  //setting our page to display user saved collection
  React.useEffect(() => {
    axios.get(BASE_URL).then((response) => {
      setSavedCards(response.data)
      console.log(response.data);
    })
  }, [])

  //getting a card to display as main
  React.useEffect( () => {
    axios.get(randomCardURL).then((response) => {
      setCatCard(response.data)
      console.log(response.data)
    })
  }, [])

  /**A POST request. Takes in a card object then saves that to the collection.
   * If card is in collection, will call a PUT request
   * @param: card object
   */
  function saveToCollection(card) {

   if (isEditing) {updateCard(card)}
   else {
   fetch(BASE_URL, {
    method: 'POST',
    cache: 'no-cache',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(
      { //our ID is automatically set in our SQL,
        caption: card.caption ? card.caption: "", //if undefined set to empty string
        catFact: card.catFact, //only need to provide 3 values ? ? ?
        imgUrl: card.imgUrl   
      }
    )
  })
   .then((res) => console.log(res))
    alert('Save successful');
     window.location.reload()
   }
  }

  /**A PUT request to update user selected catCard
  * @param: card to be updated
  */
  function updateCard(card) {
    fetch(BASE_URL + "/" + card.catCardId, {
      method: 'PUT',
      cache: 'no-cache',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(card)
    })
     .then((res) => console.log(res))
      alert('Update successful');
      window.location.reload()
      setIsEditing(false)//<-- after update
  }

  /**Sets isEditing state and displays catCard selected to be edited
  * @param: card to be edited 
  */
  function editCard(card) {
    alert('Edit Your Cat Card');
    setIsEditing(true) //sets state so we can call updateCard in saveToCollection
    setCatCard(card) //sets main catCard img and fact to display
  } 

  /**sets the caption to be saved, takes in user input
  * @param: event
  */
  function editCaption(event) {
   setCatCard((card) => {
    return {...card, caption: event.target.value}
   })
  }

  /**A DELETE request. Deletes card associated with ID
  * @param: ID of card to be deleted
  */
  function deleteCard(id) {
    const deleteUrl = BASE_URL + '/' + id
    // axios.delete(deleteUrl).then(res => {console.log("Deleted")})
    fetch(deleteUrl, 
      {method: 'DELETE'})
      .then(() => console.log(id) 
      )
      alert('Delete successful');
    window.location.reload() //need to refresh page after delete
    }

  /**shows the user their saved collection of catCards
  * @param: none
  */
  function displayCollection() {

    return (savedCards.map((card) => {
     let id = nanoid()
      return (
         <div className="gallery" key={id}>
          <img className="saved-cat-img" src={card.imgUrl}/>
          <p className="saved-cat-caption">{card.caption}</p>
        <div className='save-card-buttons'>
          <button className='edit-button' onClick={() => editCard(card)}>edit</button>
          <button className='delete-button' onClick={() => deleteCard(card.catCardId)}>delete</button>
        </div>
         </div>
      )
     })) 
   } 
  
  return (
    <div>
      <h2 className='Header' >Welcome to Cat Cards</h2>
      <main >

          <section className='Cat-card' >
          <h2 className='Cat-fact'>{catCard.catFact}</h2>
          <img className='main-cat-img' src={catCard.imgUrl} />
          </section>

          <form>
            <label className='Caption-box'>
              <input className='Caption-box' onChange={(event) => editCaption(event)} type="text" name="caption" placeholder="Caption Me" />
            </label>
            <br></br>
          <div className='buttons'>
            <button className='save-button' type="button" onClick={() => saveToCollection(catCard)}>Save to Collection</button>
            <button className='next-button'>{isEditing ? "Cancel" : "Get Next Card"}</button>
          </div>
          </form>

      </main>
    
      <div className='collection'>
        <h2 className='collection-title'>Your collection</h2>
        <div className='saved-collection'>
        {displayCollection()}
        </div>
      </div> 
    </div>
  )
}

export default App;
