import { useState, useEffect } from "react";
import "./styles.css";

export default function CatGenerator() {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCat = async function () {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`https://cataas.com/cat?t=${Date.now()}`);

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const imageBlob = await response.blob();

      const localImageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(localImageUrl);
    } catch (error) {
      setErrorMessage("Not working, try again later");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect( function(){
    fetchCat();
  }, []);

  return (
    <div id="main-container">
      <img
        src={imageUrl}
        id="random-cat"
        alt="an image of a random cat from the API cataas"
      />

      <button onClick={fetchCat} disabled={isLoading}>Press for a random cat!</button>
    </div>
  );
}
