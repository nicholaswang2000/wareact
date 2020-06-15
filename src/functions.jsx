export const reshuffle = (deckId) => {
  let id_api = "https://deckofcardsapi.com/api/deck/" + deckId + "/shuffle/";

  fetch(id_api)
    .then((res) => res.json())
    .then(
      (result) => {
        console.log(result);
      },
      (error) => {}
    );
};
