import axio from "axios"
const axios = (url = "", method = "GET", data = {}, baseURL = "/") => {
  return new Promise((resolve, reject) => {
    axio({
      url: url,
      method: method,
      baseURL: baseURL,
      data: data
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export const getManifest = () => axios("/api/data/appManifest.json")
export const getTimelineData = () => axios("/api/data/default.json")
export const getTutorialData = () => axios("/api/data/tutorial.json")
export const saveTimline = data => axios("/api/savetimeline", "post", data)
export const readPriceFile = () => axios("/api/data/ah.jx3dat")
export const getGoods = () => axios("/api/data/goods.json")
export const getRecipes = () => axios("/api/data/recipes.json")
export const updateGoods = data => axios("/api/updategoods", "post", data)
