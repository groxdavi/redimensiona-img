import { useState } from "react";

function App() {
  const [images, setImages] = useState([]);
  const [dimensions, setDimensions] = useState({ width: "", height: "" });
  const [resizedImages, setResizedImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          newImages.push({
            src: reader.result,
            width: img.width,
            height: img.height,
            fileName: file.name
          });

          if (newImages.length === files.length) {
            setImages(newImages);
            setResizedImages([]);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResize = () => {
    if (dimensions.width && dimensions.height) {
      const newResizedImages = images.map((image) => {
        const img = new Image();
        img.src = image.src;

        const canvas = document.createElement("canvas");
        canvas.width = parseInt(dimensions.width);
        canvas.height = parseInt(dimensions.height);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        return {
          ...image,
          resizedSrc: canvas.toDataURL()
        };
      });

      setResizedImages(newResizedImages);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start p-4 bg-black min-h-screen text-green-500">
      <div className="flex flex-col items-start w-full lg:w-1/2">
        <h1 className="text-3xl font-bold mb-4 border-b border-green-500 pb-2">Transforma imágenes</h1>
        <label className="mb-4 text-green-500 font-medium">Sube tus imágenes:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          multiple
          className="mb-4 text-green-500 bg-black border border-green-500 rounded p-2 hover:border-green-600 focus:outline-none focus:ring focus:ring-green-500"
        />
        {images.length > 0 && (
          <div className="text-left mb-4">
            {images.map((image, index) => (
              <div key={index}>
                <p className="text-sm mb-2">Tamaño original: <span className="font-semibold">{image.width} x {image.height}</span></p>
                <img
                  src={image.src}
                  alt={`Uploaded ${index}`}
                  className="max-w-full max-h-64 mb-4 border border-green-500 rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="number"
            placeholder="Ancho"
            value={dimensions.width}
            onChange={(e) =>
              setDimensions({ ...dimensions, width: e.target.value })
            }
            className="p-2 border border-green-500 rounded bg-black text-green-500 w-full sm:w-auto hover:border-green-600 focus:outline-none focus:ring focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Altura"
            value={dimensions.height}
            onChange={(e) =>
              setDimensions({ ...dimensions, height: e.target.value })
            }
            className="p-2 border border-green-500 rounded bg-black text-green-500 w-full sm:w-auto hover:border-green-600 focus:outline-none focus:ring focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleResize}
          className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 shadow-md transition duration-200"
        >
           Imágenes redimensionadas
        </button>
      </div>
      <div className="hidden lg:block h-full w-px bg-green-500 mx-4"></div>
      {resizedImages.length > 0 && (
        <div className="flex flex-col items-center w-full lg:w-1/2 mt-8 lg:mt-0 lg:pl-8">
        <h2 className="text-lg font-bold mb-2 text-center">Imágenes redimensionadas:</h2>
          {resizedImages.map((image, index) => (
            <div key={index}>
              <img
                src={image.resizedSrc}
                alt={`Resized ${index}`}
                className="max-w-full max-h-64 border border-green-500 rounded-lg shadow-lg"
              />
              <a
                href={image.resizedSrc}
                download={image.fileName.replace(/\.[^/.]+$/, "") + "-resized.png"}
                className="block mt-4 px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 shadow-md transition duration-200 text-center"
              >
                Descargar imagen redimensionada {index + 1}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;