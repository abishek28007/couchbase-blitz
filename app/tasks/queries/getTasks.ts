import couchdb from "db"

export default async function getTasks() {
  try {
    const k = await (await couchdb).bucket.collection("todo").get("testdoc")
    return [k.content]
  } catch (e) {
    console.log(e)
  }
}
