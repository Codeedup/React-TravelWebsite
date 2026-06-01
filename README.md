# Project Submission Structure

This project is organized for submission using the requested folder layout:

```text
/
├── back-end/
│   ├── app.py              -> Main Flask API script
│   ├── requirements.txt    -> Python dependencies
│   └── testApi.ipynb       -> Jupyter notebook for testing logic
│
├── front-end/
│   ├── package.json
│   ├── public/             -> Static assets (images, fonts)
│   └── src/
│       ├── components/     -> React components grouped by feature.
│       │   ├── catAPI/     -> catGenerator.jsx & styles
│       │   ├── catmotions/ -> catmotions.jsx & styles
│       │   ├── header/     -> Navigation/Header UI
│       │   └── testAPI/    -> Initial test components
│       │ 
│       ├── layouts/        -> Main Layout.astro (global wrapper)
│       │ 
│       └── pages/          -> Astro routes
│           ├── index.astro
│           ├── catGenerator.astro
│           └── catmotions.astro
```

## Notes from Astro team

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## Commands

These commands are mandatory to be able to run this app on your machine. They will have to be run on different terminals. The first two npm commands will need to be executed inside the main directory, while the pip3 and python will need to be executed inside the backend folder.

| Command                           | Action                                           |
| :-------------------------------- | :----------------------------------------------- |
| `npm install`                     | Installs dependencies                            |
| `npm run dev`                     | Starts local dev server at `localhost:4321`      |
| `pip3 install -r requirements.txt`| Reads the txt and install all the python tools   |
| `python3 app.py`                  | Starts local Python API at `localhost:5000`      |

These are the commands I used while creating the app: (I don't have enough patient left to write it as above ) <br><br>

npx astro add react -> to add react <br><br>

pip3 install flask flask-cores -> to install flask <br><br>

pip3 freeze > requirements.txt -> takes a snapshot of the installed tools and saved them in a txt file to install when needed <br><br>

## Destination images

Destination cards load static files from `apiviewer/public/assets/destinations` using the city slug, for example `paris.jpg`. To fill in missing destination images with the Pexels API, create `setup/.env` from `setup/.env.example`, add your own `PEXELS_API_KEY`, then run:

```bash
python setup/fetch_destination_images.py
```

The script keeps the existing curated images, downloads only missing city images, and writes Pexels attribution metadata for generated assets.


## Useful links

For React I used -> https://react.dev/learn/writing-markup-with-jsx <br><br>
For colours I used -> https://coolors.co/palette/606c38-283618-fefae0-dda15e-bc6c25 <br><br>
To revise the css -> https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout <br><br>
I also used some parts from the previous project -> https://git.arts.ac.uk/24032492/TSD <br><br>
For free APIs: https://free-apis.github.io/#/browse <br><br>
Cataas API: https://cataas.com <br><br>
Json specification: https://www.json.org/json-en.html <br><br>
For fetching data using API: https://docs.astro.build/en/guides/data-fetching/
