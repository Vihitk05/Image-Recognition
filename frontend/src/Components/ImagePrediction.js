import React, { useState } from "react";
import { Bars } from "react-loader-spinner";

export default function ImagePrediction() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([{}]);
  const [buttonClicked, setbuttonClicked] = useState(true);
  const [resultsOn, setResultsOn] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = (e) => {
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };
  const results = [];

  predictions.forEach((prediction, index) => {
    results.push(
      <div key={index}>
        <p className="p-2 bg-gray-300 rounded-full mx-1 mb-[2%] w-fit">
          {prediction.label}-<b>{prediction.probability}%</b>
        </p>
      </div>
    );
  });

  const handleUpload = () => {
    setbuttonClicked(false);
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setPredictions(data["predictions"]);
        setbuttonClicked(true);
        setResultsOn(true);
      })
      .catch((error) => {
        console.error("Error: ", error);
        setbuttonClicked(true);
        setResultsOn(true);
      });
  };
  console.log(predictions);
  return (
    <>
      <h2 className="text-center font-extrabold text-[300%] mt-20">
        Unveiling the Power of Image Intelligence
      </h2>
      <div class=" w-[50%] mt-[2%] text-center px-4 rounded-md flex flex-col items-center justify-center cursor-pointer border-4 border-gray-500 border-dashed mx-auto">
        <div class="py-6">
          {file == null ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-20 mb-2 fill-gray-600 inline-block"
                viewBox="0 0 32 32"
              >
                <path
                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                  data-original="#000000"
                />
                <path
                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                  data-original="#000000"
                />
              </svg>
              <h4 class="text-base font-semibold text-gray-600">
                Choose your Image
              </h4>
            </>
          ) : (
            <>
              <img
                src={imageUrl}
                alt=""
                width={300}
                height={350}
                className="rounded"
              />
            </>
          )}
          <input
            type="file"
            id="uploadFile1"
            onChange={handleFileChange}
            class="hidden"
            accept="image/*"
          />
        </div>
        <hr class="w-full border-black my-2" />
        <div class="py-6">
          <input
            type="image"
            id="uploadFile1"
            onChange={handleFileChange}
            class="hidden"
            accept="image/*"
            alt=""
          />
          <label
            for="uploadFile1"
            class="block px-6 py-2.5 rounded text-white text-sm tracking-wider font-semibold border-none outline-none bg-black hover:bg-gray-900 cursor-pointer"
          >
            Browse Images
          </label>
          <p class="text-xs text-white mt-4">
            PNG, JPG SVG, WEBP, and GIF are Allowed.
          </p>
        </div>
      </div>
      {buttonClicked ? (
        <div className="flex justify-center">
          <button
            type="button"
            class="py-2.5 w-1/6 px-4 mt-10 font-bold rounded text-white bg-black hover:bg-gray-900 focus:outline-none"
            onClick={handleUpload}
          >
            Upload Image
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            type="button"
            class="py-2.5 w-1/6 px-4 mt-10 disabled font-bold rounded flex justify-center text-white bg-gray-700 focus:outline-none"
            disabled
          >
            <Bars
              height="25"
              width="25"
              color="#ffffff"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </button>
        </div>
      )}
      {resultsOn ? (
        <>
          <div className="predictions w-[50%] mt-[5%] mb-[5%] px-4 rounded-md cursor-pointer border-4 border-gray-500 mx-auto">
            <div className="text-xl mt-3">Predictions</div>
            <br />
            <div className="results flex flex-wrap justify-start">
              {results}
            </div>
            <br />
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
