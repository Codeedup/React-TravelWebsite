This is the documentation for the basic framework of the project.<br><br>

At this stage I have built a simple framework based on an empty canvas. The app has two pages, one is the index.astro which is the landing page, and the other one is the secondPage.astro. I have made the second page just to test the integration of the components.
Inside the components folder you'll find the header component with its specific css file. Also, here are the API test components. I tried to maintain a workflow by creating a folder that will contain the components plus its css file.
Inside the layouts folder you'll find the Layout.astro. This file is the main framework of the entire site. In case you want to change the grid, the way the header and footer are arranged on the grid this is the place to do it.
To maintain a workflow I have written the css code directly inside each .astro file. To find it just scroll down. <br><br>

Now, going to the API. This is the tricky part. For this entire thing to not fall apart we have to do two things. One is to run the app.py file by using the command `python3 app.py`. This will run the server on our machine to send over the data to be read by website. After we do that, then we can run `npm run dev` to fire up the website. Because I integrated the fallback thing, the website will still run without running the `python3 app.py`. But it will not show the data that is inside the script. Also, be careful to be in the right folder when running the commands. For app.py you'll need to be inside the backend folder, and for the npm run dev you'll have to be inside the main directory. To be able to run both of them I had two terminals on my VsCode running at the same time.<br><br>

Overall, that's pretty much it about the app. I think the next steps we will need to do are to decide on an API, or what type of data we want to use and of course how we would like the website to look like. At the moment I have built a very simple website, but I have built it in such a way to be easier for everyone to add, edit and update the code. For example, to change the way the header or navbar looks like you'll only have to work inside the header folder.<br><br>

## Project Structure

```text
/
├── backend/
│   └── app.py -> Script for the API.
│
├── public/
│
├── src/
│   └── components/
│   │   └── header/ -> Here's the header.jsx and css
│   │   └── testAPI/ -> Component for the API
│   │ 
│   └── layouts/ -> Inside here is the main layout which will be reused on every page
│   │ 
│   └── pages/
│       └── index.astro -> Main page that astro uses.
│       └── secondPage.astro ->Second page etc...
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


## Useful links

For React I used -> https://react.dev/learn/writing-markup-with-jsx <br><br>

For colours I used -> https://coolors.co/palette/606c38-283618-fefae0-dda15e-bc6c25 <br><br>

To revise the css -> https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout <br><br>

I also used some parts from the previous project -> https://git.arts.ac.uk/24032492/TSD <br><br>

For JavaScript and Python I used Nick's previous in class exercises -> https://ual-moodle-sitedata.s3.eu-west-2.amazonaws.com/f5/11/f5110d83ad71bd57ddc90f554a2818f566f79402?response-content-disposition=inline%3B%20filename%3D%22Session%2004_%20Text%2C%20Data%20and%20API.pdf%22&response-content-type=application%2Fpdf&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA2PCH3OG65JHUZNKL%2F20260330%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T180611Z&X-Amz-SignedHeaders=host&X-Amz-Expires=21589&X-Amz-Signature=146e85d84feee3f9d9421248030aacbde28b75b37cf4c583943a6e7e25635ccc