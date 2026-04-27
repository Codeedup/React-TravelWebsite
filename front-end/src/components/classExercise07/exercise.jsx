import { useState } from 'react'

function App() {
    const BASE_URL = "http://localhost:5050"

    const [locations, setLocations] = useState([])
    const [objects, setObjects] = useState([])

    async function fetchFromAPI(path) {
        const url = `${BASE_URL}${path}`
        let result = {}

        console.log(`Fetching API data from ${url}`)

        try {
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`Failed fetching ${url}`)
            }
            else {
                console.log(`Response ok: ${JSON.stringify(response)}`)
                result = await response.json() // parses JSON response into native JavaScript objects
                console.log(`Got response JSON: ${JSON.stringify(result)}`)
                return result
            }
        } catch (error) {
            result.error = error
            console.error("There has been a problem with your fetch operation:", error)
            return result
        }
    }

    async function getLocations() {       //  Exercise: do this on page load.
        const result = await fetchFromAPI("/locations")

        console.log("Got result", result)

        if (result.data) {
            setLocations(result.data)
            setObjects([])
        }
    }

    async function getObjectsAtLocation(id) {
        const result = await fetchFromAPI(`/objects_at_location/${id}`)

        console.log("Got result", result)

        if (result.data) {
            setObjects(result.data)
        }
    }

    return (
        <div className="panel">
            <div>
                <button onClick={ getLocations }>Get locations</button>
            </div>
            {
                locations.map((loc, i) =>
                    <div key={i}>
                        <button onClick={ () => {
                            getObjectsAtLocation(loc.id)
                        }}>
                            { loc.name }
                        </button>
                    </div>
                )
            }
            <div>
                {
                    objects.map((obj, i) =>
                        // Object table doesn't have primary "id" keys.
                        <div key={i}>
                            { obj.title }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default App