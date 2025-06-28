import { useForm } from "react-hook-form"
import { useState } from "react"
import './App.css'
import Log from '../../loggingMiddleware/log.js'
function App() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [urls, setUrls] = useState([])
  const onSubmit = async (obj) => {
    try {
      Log("frontend", "info", "controller", "Form submitted with data")
      console.log(obj)
      const res = await fetch('http://localhost:5050/shorturls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
      })
      const data = await res.json()
      setUrls([...urls, data])
    }
    catch (error) {
      Log("frontend", "error", "controller", "Error submitting form")
      console.error('Error submitting form:', error)
    }
    Log("frontend", "info", "controller", "Form submission successful")
  }
  return (
    <div>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="url">Url</label>
          <input type="url" {...register("url", { required: true })} />
          {errors.url && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="validity">Validity</label>
          <input type="number" {...register("validity")} />
        </div>
        <div>
          <label htmlFor="shortcode">Short Code</label>
          <input type="text" {...register("shortcode")} />
        </div>
        <input type="submit" value="Submit" />
      </form>
      {
        urls.length > 0 && (
          <section>
            <h2>Shortened URLs</h2>
            <ul>
              {
                urls.map((url, index) => (
                  <li key={index}>
                    ShortUrl - <a href={url.shortLink} target="_blank">
                      {url.shortLink}
                    </a><br/>Expires on: {new Date(url.expiry).toLocaleString()}
                    
                  </li>
                ))
              }
            </ul>
          </section>
        )
      }
    </div>
  )
}

export default App